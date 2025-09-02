# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Core Case Management Service Source Code
data "archive_file" "core_case_mgmt_tarball" {
  type        = "tar.gz"
  output_path = "${path.module}/core_case_mgmt.tar.gz"
  source_dir  = "../src/apis/core_case_mgmt"
}

locals {
  core_case_mgmt_tarball_name = "cloud-run/core-case-mgmt.tar.gz"
}

resource "google_storage_bucket_object" "core_case_mgmt_tarball" {
  name   = local.core_case_mgmt_tarball_name
  bucket = google_storage_bucket.cloud_run_code.name
  source = data.archive_file.core_case_mgmt_tarball.output_path
  depends_on = [
    google_storage_notification.core_case_mgmt_tarball,
    google_cloudbuild_trigger.core_case_mgmt_build_trigger
  ]
}

resource "google_storage_notification" "core_case_mgmt_tarball" {
  bucket             = google_storage_bucket.cloud_run_code.name
  payload_format     = "NONE"
  topic              = google_pubsub_topic.core_case_mgmt_source_upload.id
  event_types        = ["OBJECT_FINALIZE"]
  object_name_prefix = local.core_case_mgmt_tarball_name
  depends_on         = [time_sleep.wait_for_iam_propagation]
}

resource "google_pubsub_topic" "core_case_mgmt_source_upload" {
  name = "core-case-mgmt-source-upload${local.random_suffix}"
}

resource "google_pubsub_topic_iam_member" "core_case_mgmt_gcs_pubsub_publisher" {
  topic  = google_pubsub_topic.core_case_mgmt_source_upload.name
  role   = "roles/pubsub.publisher"
  member = data.google_storage_project_service_account.gcs_service_account.member
}

resource "google_service_account_iam_member" "core_case_mgmt_sa_user" {
  service_account_id = google_service_account.core_case_mgmt_runtime_sa.name
  role               = "roles/iam.serviceAccountUser"
  member             = google_service_account.cloud_build_deployer.member
}

locals {
  core_case_mgmt_computed_image_tag = substr(data.archive_file.core_case_mgmt_tarball.output_sha256, 0, 12)
  core_case_mgmt_image_tags = [
    local.core_case_mgmt_computed_image_tag,
    "latest"
  ]
  core_case_mgmt_image_urls = formatlist("%s:%s", "${local.image_base_url}/core-case-mgmt", local.core_case_mgmt_image_tags)
  core_case_mgmt_image_url  = local.core_case_mgmt_image_urls[0]
}

resource "google_cloudbuild_trigger" "core_case_mgmt_build_trigger" {
  name            = "${local.prefix}core-case-mgmt-trigger"
  location        = data.google_compute_zones.available.region
  description     = "Triggers a build and deploy to Cloud Run when a new source .tar.gz is uploaded."
  service_account = google_service_account.cloud_build_deployer.id

  pubsub_config {
    topic = google_pubsub_topic.core_case_mgmt_source_upload.id
  }

  build {
    source {
      storage_source {
        bucket = google_storage_bucket.cloud_run_code.name
        object = local.core_case_mgmt_tarball_name
      }
    }
    step {
      name = "gcr.io/cloud-builders/docker"
      args = flatten(["build", [for url in local.core_case_mgmt_image_urls : ["-t", url]], ["-f", "Dockerfile", "."]])
    }
    images      = local.core_case_mgmt_image_urls
    logs_bucket = "${google_storage_bucket.cloud_run_code.name}/build-logs/core-case-mgmt"
    tags        = ["core-case-mgmt", "terraform-managed"]
    options {
      log_streaming_option = "STREAM_ON"
    }
  }
  depends_on = [
    google_storage_bucket_iam_member.cloud_build_deployer,
    google_project_iam_member.cloud_build_deployer,
    google_artifact_registry_repository_iam_member.cloud_build_deployer,
    time_sleep.wait_for_iam_propagation
  ]
}

resource "google_service_account" "core_case_mgmt_runtime_sa" {
  account_id   = regex("^(.*?)(?:-)?$", substr("${local.prefix}core-case-mgmt-runtime", 0, 30))[0]
  display_name = "Core Case Mgmt Runtime SA"
  description  = "Service account for Core Case Management Cloud Run service"
}

resource "google_project_iam_member" "core_case_mgmt" {
  for_each = toset([
    "roles/bigquery.dataEditor",
    "roles/bigquery.jobUser",
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
  ])
  project = google_project.this.project_id
  role    = each.value
  member  = google_service_account.core_case_mgmt_runtime_sa.member
}

module "wait_for_core_case_mgmt_build" {
  source  = "terraform-google-modules/gcloud/google"
  version = "~> 3.0"

  platform              = "linux"
  create_cmd_entrypoint = "bash"
  create_cmd_body       = "${path.module}/../files/wait_for_build.sh ${google_cloudbuild_trigger.core_case_mgmt_build_trigger.location} core-case-mgmt ${local.core_case_mgmt_image_url} 5"

  destroy_cmd_entrypoint = "echo"
  destroy_cmd_body       = "Build wait completed"

  module_depends_on = [
    google_cloudbuild_trigger.core_case_mgmt_build_trigger
  ]
}

resource "google_cloud_run_v2_service" "core_case_mgmt" {
  name                = "${var.environment}-${local.vertex_ai_model_region}-core-case-mgmt${local.random_suffix}"
  location            = local.vertex_ai_model_region
  deletion_protection = var.cloud_run_service_deletion_protection
  ingress             = "INGRESS_TRAFFIC_INTERNAL_ONLY"

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  template {
    service_account = google_service_account.core_case_mgmt_runtime_sa.email
    containers {
      image = google_cloudbuild_trigger.core_case_mgmt_build_trigger.build[0].images[0]
      ports {
        container_port = 8080
      }
      resources {
        limits = {
          cpu    = "2000m"
          memory = "8Gi"
        }
      }
      dynamic "env" {
        for_each = {
          PROJECT_ID         = google_project.this.project_id,
          BIGQUERY_DATASET   = "cw_case_notes",
        }
        content {
          name  = env.key
          value = env.value
        }
      }
    }
    timeout = "3600s"
  }
  depends_on = [
    module.wait_for_core_case_mgmt_build.wait
  ]
}
