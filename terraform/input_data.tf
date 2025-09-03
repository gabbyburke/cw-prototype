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

# Input Catalog Source Code
data "archive_file" "input_data_tarball" {
  type        = "tar.gz"
  output_path = "${path.module}/input_data.tar.gz"
  source_dir  = "../src/dispatcher"
}

locals {
  input_data_tarball_name = "cloud-run/input-data.tar.gz"
}

# depends_on to allow notification to exist before the tarball is uploaded
resource "google_storage_bucket_object" "input_data_tarball" {
  name   = local.input_data_tarball_name
  bucket = google_storage_bucket.cloud_run_code.name
  source = data.archive_file.input_data_tarball.output_path
  depends_on = [
    google_storage_notification.input_data_tarball,
    google_cloudbuild_trigger.input_data_build_trigger
  ]
}

resource "google_storage_notification" "input_data_tarball" {
  bucket             = google_storage_bucket.cloud_run_code.name
  payload_format     = "NONE"
  topic              = google_pubsub_topic.new_source.id
  event_types        = ["OBJECT_FINALIZE"]
  object_name_prefix = local.input_data_tarball_name
  depends_on         = [time_sleep.wait_for_iam_propagation]
}

# GCS Notification
data "google_storage_project_service_account" "gcs_service_account" {}

resource "google_pubsub_topic_iam_member" "gcs_pubsub_publisher" {
  for_each = {
    "new-source" = google_pubsub_topic.new_source.id
  }
  topic  = each.value
  role   = "roles/pubsub.publisher"
  member = data.google_storage_project_service_account.gcs_service_account.member
}

# To use GCS CloudEvent triggers, the GCS service account requires the Pub/Sub Publisher (roles/pubsub.publisher) IAM role
resource "google_project_iam_member" "gcs_service_account" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = data.google_storage_project_service_account.gcs_service_account.member
}

# Grant the Cloud Build SA permission to act as the Cloud Run runtime SA.
resource "google_service_account_iam_member" "input_data" {
  service_account_id = google_service_account.input_data_runtime_sa.name
  role               = "roles/iam.serviceAccountUser"
  member             = google_service_account.cloud_build_deployer.member
}

resource "google_pubsub_topic" "new_source" {
  name = "input-data-source-upload${local.random_suffix}"
}

locals {
  # Use first 12 characters of source hash as tag - only changes when source changes
  input_data_computed_image_tag = substr(data.archive_file.input_data_tarball.output_sha256, 0, 12)

  # List of tags to apply to the image
  input_data_image_tags = [
    local.input_data_computed_image_tag,
    "latest"
  ]
  # Generate image URLs for all tags
  input_data_image_urls = formatlist("%s:%s", "${local.image_base_url}/input-data", local.input_data_image_tags)
  input_data_image_url  = local.input_data_image_urls[0]
}

resource "google_cloudbuild_trigger" "input_data_build_trigger" {
  name            = "${local.prefix}input-data-trigger"
  location        = data.google_compute_zones.available.region
  description     = "Triggers a build and deploy to Cloud Run when a new source .tar.gz is uploaded."
  service_account = google_service_account.cloud_build_deployer.id

  pubsub_config {
    topic = google_pubsub_topic.new_source.id
  }

  build {
    source {
      storage_source {
        bucket = google_storage_bucket.cloud_run_code.name
        object = local.input_data_tarball_name
      }
    }
    step {
      name = "gcr.io/cloud-builders/docker"
      args = flatten(["build", [for url in local.input_data_image_urls : ["-t", url]], ["-f", "input_data/Dockerfile", "."]])
    }
    images      = local.input_data_image_urls
    logs_bucket = "${google_storage_bucket.cloud_run_code.name}/build-logs/input-data"
    tags        = ["input-data", "terraform-managed"]
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

resource "google_service_account" "input_data_runtime_sa" {
  account_id   = regex("^(.*?)(?:-)?$", substr("${local.prefix}input-data-runtime", 0, 30))[0]
  display_name = "Input Catalog runtime"
  description  = "Service account used by Input Catalog's Cloud Run service"
}

resource "google_project_iam_member" "input_data" {
  for_each = toset([ # Permissions from input_data README
    "roles/aiplatform.user",
    "roles/bigquery.dataEditor",
    "roles/bigquery.jobUser",
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/storage.objectViewer",
  ])
  project = var.project_id
  role    = each.value
  member  = google_service_account.input_data_runtime_sa.member
}

# Wait for any running Cloud Builds to complete before updating Cloud Run service
module "wait_for_input_data_build" {
  source  = "terraform-google-modules/gcloud/google"
  version = "~> 3.0"

  platform              = "linux"
  create_cmd_entrypoint = "bash"
  create_cmd_body       = "${path.module}/../files/wait_for_build.sh ${google_cloudbuild_trigger.input_data_build_trigger.location} input-data ${local.input_data_image_url} 5"

  destroy_cmd_entrypoint = "echo"
  destroy_cmd_body       = "Build wait completed"

  module_depends_on = [
    google_cloudbuild_trigger.input_data_build_trigger
  ]
}

resource "google_cloud_run_v2_service" "input_data" {
  name                = "${var.environment}-${local.vertex_ai_model_region}-input-data-worker${local.random_suffix}"
  location            = local.vertex_ai_model_region
  deletion_protection = var.cloud_run_service_deletion_protection
  ingress             = "INGRESS_TRAFFIC_INTERNAL_ONLY"

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  template {
    service_account                  = google_service_account.input_data_runtime_sa.email
    max_instance_request_concurrency = 1 # We want to process no more than one request at a time
    containers {
      image = google_cloudbuild_trigger.input_data_build_trigger.build[0].images[0]
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
          BIGQUERY_DATASET   = local.dataset_ids[0],
          VERTEX_AI_PROJECT  = var.project_id,
          VERTEX_AI_LOCATION = local.vertex_ai_model_region,
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
    module.wait_for_input_data_build.wait
  ]
}

resource "google_cloud_run_v2_service_iam_member" "input_data_dispatcher" {
  name     = google_cloud_run_v2_service.input_data.name
  location = google_cloud_run_v2_service.input_data.location
  role     = "roles/run.invoker"
  member   = google_service_account.input_data_dispatcher.member
}
