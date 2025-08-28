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

# UI Frontend Source Code
data "archive_file" "ui_tarball" {
  type        = "tar.gz"
  output_path = "${path.module}/ui.tar.gz"
  source_dir  = "../src/ui"
}

locals {
  ui_tarball_name = "cloud-run/ui.tar.gz"
}

resource "google_storage_bucket_object" "ui_tarball" {
  name   = local.ui_tarball_name
  bucket = google_storage_bucket.cloud_run_code.name
  source = data.archive_file.ui_tarball.output_path
  depends_on = [
    google_storage_notification.ui_tarball,
    google_cloudbuild_trigger.ui
  ]
}

resource "google_pubsub_topic" "ui_source_upload" {
  name = "ui-source-upload${local.random_suffix}"
}

resource "google_pubsub_topic_iam_member" "ui_gcs_pubsub_publisher" {
  topic  = google_pubsub_topic.ui_source_upload.name
  role   = "roles/pubsub.publisher"
  member = data.google_storage_project_service_account.gcs_service_account.member
}

resource "google_storage_notification" "ui_tarball" {
  bucket             = google_storage_bucket.cloud_run_code.name
  payload_format     = "NONE"
  topic              = google_pubsub_topic.ui_source_upload.id
  event_types        = ["OBJECT_FINALIZE"]
  object_name_prefix = local.ui_tarball_name
  depends_on         = [time_sleep.wait_for_iam_propagation]
}

resource "google_service_account" "ui_runtime_sa" {
  account_id   = regex("^(.*?)(?:-)?$", substr("${local.prefix}ui-runtime", 0, 30))[0]
  display_name = "UI Runtime Service Account"
  description  = "Service account used by the UI Cloud Run service"
}

resource "google_project_iam_member" "ui_runtime_sa" {
  for_each = toset([
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
  ])
  project = google_project.this.project_id
  role    = each.value
  member  = google_service_account.ui_runtime_sa.member
}

resource "google_service_account_iam_member" "ui_runtime_sa" {
  service_account_id = google_service_account.ui_runtime_sa.name
  role               = "roles/iam.serviceAccountUser"
  member             = google_service_account.cloud_build_deployer.member
}

locals {
  ui_computed_image_tag = substr(data.archive_file.ui_tarball.output_sha256, 0, 12)
  ui_image_tags = [
    local.ui_computed_image_tag,
    "latest"
  ]
  ui_image_urls = formatlist("%s:%s", "${local.image_base_url}/ui", local.ui_image_tags)
  ui_image_url  = local.ui_image_urls[0]
}

resource "google_cloudbuild_trigger" "ui" {
  name            = "${local.prefix}ui-trigger"
  location        = data.google_compute_zones.available.region
  description     = "Triggers a build and deploy to Cloud Run when a new UI source .tar.gz is uploaded."
  service_account = google_service_account.cloud_build_deployer.id

  pubsub_config {
    topic = google_pubsub_topic.ui_source_upload.id
  }

  build {
    source {
      storage_source {
        bucket = google_storage_bucket.cloud_run_code.name
        object = local.ui_tarball_name
      }
    }
    step {
      name = "gcr.io/cloud-builders/docker"
      args = ["build", "-t", local.ui_image_url, "."]
    }
    images      = [local.ui_image_url]
    logs_bucket = "${google_storage_bucket.cloud_run_code.name}/build-logs/ui"
    tags        = ["ui", "terraform-managed"]
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

module "wait_for_ui_build" {
  source  = "terraform-google-modules/gcloud/google"
  version = "~> 3.0"

  platform = "linux"

  create_cmd_entrypoint = "${path.module}/files/wait_for_build.sh"
  create_cmd_body       = "${google_cloudbuild_trigger.ui.location} ui ${local.ui_image_url} 20"

  destroy_cmd_entrypoint = "echo"
  destroy_cmd_body       = "Build wait completed"

  module_depends_on = [
    google_cloudbuild_trigger.ui
  ]
}

resource "google_cloud_run_v2_service" "ui" {
  provider            = google-beta
  name                = "${var.environment}-${local.vertex_ai_model_region}-ui${local.random_suffix}"
  location            = local.vertex_ai_model_region
  deletion_protection = var.cloud_run_service_deletion_protection
  ingress             = "INGRESS_TRAFFIC_ALL"
  iap_enabled         = false
  launch_stage        = "GA"
  template {
    service_account = google_service_account.ui_runtime_sa.email
    containers {
      image = google_cloudbuild_trigger.ui.build[0].images[0]
      ports {
        container_port = 3000
      }
      resources {
        limits = {
          cpu    = "2000m"
          memory = "8Gi"
        }
      }
      # Regular environment variables
      dynamic "env" {
        for_each = {
          NEXT_PUBLIC_FIREBASE_API_KEY             = google_firebase_web_app.ccwis_case_management.api_key
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         = google_firebase_web_app.ccwis_case_management.auth_domain
          NEXT_PUBLIC_FIREBASE_PROJECT_ID          = google_project.this.project_id
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      = google_firebase_storage_bucket.ccwis_case_management.bucket_id
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = google_firebase_web_app.ccwis_case_management.messaging_sender_id
          NEXT_PUBLIC_FIREBASE_APP_ID              = google_firebase_web_app.ccwis_case_management.app_id
          NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID      = google_firebase_web_app.ccwis_case_management.measurement_id
          # Add backend URLs here if needed
          # NEXT_PUBLIC_CORE_CASE_MGMT_URL = google_cloud_run_v2_service.core_case_mgmt.uri
          # NEXT_PUBLIC_REFERRAL_INTAKE_URL = google_cloud_run_v2_service.referral_intake.uri
        }
        content {
          name  = env.key
          value = env.value
        }
      }
    }
  }
  depends_on = [
    module.wait_for_ui_build.wait
  ]
}

# Allow unauthenticated access to the Cloud Run service (for public web app)
resource "google_cloud_run_v2_service_iam_member" "ui_noauth" {
  name     = google_cloud_run_v2_service.ui.name
  location = google_cloud_run_v2_service.ui.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
