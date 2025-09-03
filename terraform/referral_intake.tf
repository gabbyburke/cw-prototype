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

# Referral Intake Service Source Code
data "archive_file" "referral_intake_tarball" {
  type        = "tar.gz"
  output_path = "${path.module}/referral_intake.tar.gz"
  source_dir  = "../src/apis/referral_intake"
}

locals {
  referral_intake_tarball_name = "cloud-run/referral-intake.tar.gz"
}

resource "google_storage_bucket_object" "referral_intake_tarball" {
  name   = local.referral_intake_tarball_name
  bucket = google_storage_bucket.cloud_run_code.name
  source = data.archive_file.referral_intake_tarball.output_path
  depends_on = [
    google_storage_notification.referral_intake_tarball,
    google_cloudbuild_trigger.referral_intake_build_trigger
  ]
}

resource "google_storage_notification" "referral_intake_tarball" {
  bucket             = google_storage_bucket.cloud_run_code.name
  payload_format     = "NONE"
  topic              = google_pubsub_topic.referral_intake_source_upload.id
  event_types        = ["OBJECT_FINALIZE"]
  object_name_prefix = local.referral_intake_tarball_name
  depends_on         = [time_sleep.wait_for_iam_propagation]
}

resource "google_pubsub_topic" "referral_intake_source_upload" {
  name = "referral-intake-source-upload${local.random_suffix}"
}

resource "google_pubsub_topic_iam_member" "referral_intake_gcs_pubsub_publisher" {
  topic  = google_pubsub_topic.referral_intake_source_upload.id
  role   = "roles/pubsub.publisher"
  member = data.google_storage_project_service_account.gcs_service_account.member
}

resource "google_service_account_iam_member" "referral_intake_sa_user" {
  service_account_id = google_service_account.referral_intake_runtime_sa.name
  role               = "roles/iam.serviceAccountUser"
  member             = google_service_account.cloud_build_deployer.member
}

locals {
  referral_intake_computed_image_tag = substr(data.archive_file.referral_intake_tarball.output_sha256, 0, 12)
  referral_intake_image_tags = [
    local.referral_intake_computed_image_tag,
    "latest"
  ]
  referral_intake_image_urls = formatlist("%s:%s", "${local.image_base_url}/referral-intake", local.referral_intake_image_tags)
  referral_intake_image_url  = local.referral_intake_image_urls[0]
}

resource "google_cloudbuild_trigger" "referral_intake_build_trigger" {
  name            = "${local.prefix}referral-intake-trigger"
  location        = data.google_compute_zones.available.region
  description     = "Triggers a build and deploy to Cloud Run when a new source .tar.gz is uploaded."
  service_account = google_service_account.cloud_build_deployer.id

  pubsub_config {
    topic = google_pubsub_topic.referral_intake_source_upload.id
  }

  build {
    source {
      storage_source {
        bucket = google_storage_bucket.cloud_run_code.name
        object = local.referral_intake_tarball_name
      }
    }
    step {
      name = "gcr.io/cloud-builders/docker"
      args = flatten(["build", [for url in local.referral_intake_image_urls : ["-t", url]], ["-f", "Dockerfile", "."]])
    }
    images      = local.referral_intake_image_urls
    logs_bucket = "${google_storage_bucket.cloud_run_code.name}/build-logs/referral-intake"
    tags        = ["referral-intake", "terraform-managed"]
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

resource "google_service_account" "referral_intake_runtime_sa" {
  account_id   = regex("^(.*?)(?:-)?$", substr("${local.prefix}referral-intake-runtime", 0, 30))[0]
  display_name = "Referral Intake Runtime SA"
  description  = "Service account for Referral Intake Cloud Run service"
}

resource "google_project_iam_member" "referral_intake" {
  for_each = toset([
    "roles/datastore.user",
    "roles/pubsub.publisher",
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
  ])
  project = var.project_id
  role    = each.value
  member  = google_service_account.referral_intake_runtime_sa.member
}

module "wait_for_referral_intake_build" {
  source  = "terraform-google-modules/gcloud/google"
  version = "~> 3.0"

  platform              = "linux"
  create_cmd_entrypoint = "bash"
  create_cmd_body       = "${path.module}/../files/wait_for_build.sh ${google_cloudbuild_trigger.referral_intake_build_trigger.location} referral-intake ${local.referral_intake_image_url} 5"

  destroy_cmd_entrypoint = "echo"
  destroy_cmd_body       = "Build wait completed"

  module_depends_on = [
    google_cloudbuild_trigger.referral_intake_build_trigger
  ]
}

resource "google_cloud_run_v2_service" "referral_intake" {
  name                = "${var.environment}-${local.vertex_ai_model_region}-referral-intake${local.random_suffix}"
  location            = local.vertex_ai_model_region
  deletion_protection = var.cloud_run_service_deletion_protection
  ingress             = "INGRESS_TRAFFIC_ALL"

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  template {
    service_account = google_service_account.referral_intake_runtime_sa.email
    containers {
      image = google_cloudbuild_trigger.referral_intake_build_trigger.build[0].images[0]
      ports {
        container_port = 8080
      }
      resources {
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
      }
      dynamic "env" {
        for_each = {
          PROJECT_ID             = var.project_id,
          FIRESTORE_DATABASE     = google_firestore_database.this.name,
          CORE_CASE_MGMT_API_URL = google_cloud_run_v2_service.core_case_mgmt.uri
        }
        content {
          name  = env.key
          value = env.value
        }
      }
    }
    timeout = "60s"
  }
  depends_on = [
    module.wait_for_referral_intake_build.wait
  ]
}
