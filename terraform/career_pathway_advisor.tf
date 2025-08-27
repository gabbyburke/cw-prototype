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

# Front end Source Code
data "archive_file" "ccwis_case_management_tarball" {
  type        = "tar.gz"
  output_path = "${path.module}/ccwis-case-management.tar.gz"
  source_dir  = "${path.module}/ccwis-case-management"
  excludes    = ["src/backend"]
}

locals {
  ccwis_case_management_tarball_name = "cloud-run/ccwis-case-management.tar.gz"
}

resource "google_storage_bucket_object" "ccwis_case_management_tarball" {
  name   = local.ccwis_case_management_tarball_name
  bucket = google_storage_bucket.cloud_run_code.name
  source = data.archive_file.ccwis_case_management_tarball.output_path
  depends_on = [
    google_storage_notification.ccwis_case_management_tarball,
    google_cloudbuild_trigger.ccwis_case_management
  ]
}

resource "google_pubsub_topic" "ccwis_case_management_source_upload" {
  name = "ccwis-case-management-source-upload${local.random_suffix}"
}

resource "google_pubsub_topic_iam_member" "cpa_gcs_pubsub_publisher" {
  topic  = google_pubsub_topic.ccwis_case_management_source_upload.name
  role   = "roles/pubsub.publisher"
  member = data.google_storage_project_service_account.gcs_service_account.member
}

resource "google_storage_notification" "ccwis_case_management_tarball" {
  bucket             = google_storage_bucket.cloud_run_code.name
  payload_format     = "NONE"
  topic              = google_pubsub_topic.ccwis_case_management_source_upload.id
  event_types        = ["OBJECT_FINALIZE"]
  object_name_prefix = local.ccwis_case_management_tarball_name
  depends_on         = [time_sleep.wait_for_iam_propagation]
}

resource "google_service_account" "ccwis_case_management_runtime_sa" {
  # regex removes trailing dash if it exists
  account_id   = regex("^(.*?)(?:-)?$", substr("${local.prefix}cpa-runtime", 0, 30))[0]
  display_name = "ccwis case management runtime"
  description  = "Service account used by ccwis case management's Cloud Run service"
}

resource "google_project_iam_member" "ccwis_case_management" {
  for_each = toset([
    "roles/bigquery.dataViewer",
    "roles/storage.objectViewer",
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/bigquery.jobUser",
    "roles/aiplatform.user",
  ])
  project = data.google_project.current.project_id
  role    = each.value
  member  = google_service_account.ccwis_case_management_runtime_sa.member
}

resource "google_bigquery_connection_iam_member" "ccwis_case_management" {
  location      = google_bigquery_connection.this.location
  connection_id = google_bigquery_connection.this.connection_id
  role          = "roles/bigquery.connectionUser"
  member        = google_service_account.ccwis_case_management_runtime_sa.member
}

resource "google_service_account_iam_member" "ccwis_case_management" {
  service_account_id = google_service_account.ccwis_case_management_runtime_sa.name
  role               = "roles/iam.serviceAccountUser"
  member             = google_service_account.cloud_build_deployer.member
}

locals {
  # Use first 12 characters of source hash as tag - only changes when source changes
  cpa_computed_image_tag = substr(data.archive_file.ccwis_case_management_tarball.output_sha256, 0, 12)

  # List of tags to apply to the image
  cpa_image_tags = [
    local.cpa_computed_image_tag,
    "latest"
  ]
  # Generate image URLs for all tags
  cpa_image_urls = formatlist("%s:%s", "${local.image_base_url}/ccwis-case-management", local.cpa_image_tags)
  cpa_image_url  = local.cpa_image_urls[0]
}

resource "google_cloudbuild_trigger" "ccwis_case_management" {
  name            = "${local.prefix}cpa-trigger"
  location        = data.google_compute_zones.available.region
  description     = "Triggers a build and deploy to Cloud Run when a new source .tar.gz is uploaded."
  service_account = google_service_account.cloud_build_deployer.id

  pubsub_config {
    topic = google_pubsub_topic.ccwis_case_management_source_upload.id
  }

  build {
    source {
      storage_source {
        bucket = google_storage_bucket.cloud_run_code.name
        object = local.ccwis_case_management_tarball_name
      }
    }
    step {
      name       = "node:18"
      entrypoint = "yarn"
      args       = ["install", "--frozen-lockfile"]
    }
    step {
      name       = "node:18"
      entrypoint = "yarn"
      args       = ["build", ]
      env = [
        "VERTEX_AI_PROJECT=${data.google_project.current.project_id}",
        "GCP_PROJECT_ID=${data.google_project.current.project_id}",
        "GCP_LOCATION=${local.vertex_ai_model_region}",
        "NEXT_PUBLIC_FIREBASE_API_KEY=${data.google_firebase_web_app_config.ccwis_case_management.api_key}",
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${data.google_firebase_web_app_config.ccwis_case_management.auth_domain}",
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID=${data.google_project.current.project_id}",
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${google_firebase_storage_bucket.ccwis_case_management.bucket_id}", # does this need to be the bucket in the data source? Due to manually creating Firebase project?
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${data.google_firebase_web_app_config.ccwis_case_management.messaging_sender_id}",
        "NEXT_PUBLIC_FIREBASE_APP_ID=${data.google_firebase_web_app_config.ccwis_case_management.web_app_id}",
        "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${data.google_firebase_web_app_config.ccwis_case_management.measurement_id}",
      ]
    }
    step {
      # https://cloud.google.com/docs/buildpacks/build-application#local_builds
      name = "buildpacksio/pack:latest"
      args = [
        "build",
        local.cpa_image_urls[0],
        "--builder",
        "gcr.io/buildpacks/builder:google-22",
        "--path",
        ".",
      ]
    }
    step {
      name = "gcr.io/cloud-builders/docker"
      args = ["tag", local.cpa_image_urls[0], local.cpa_image_urls[1]]
    }
    images      = local.cpa_image_urls
    logs_bucket = "${google_storage_bucket.cloud_run_code.name}/build-logs/ccwis-case-management"
    tags        = ["ccwis-case-management", "terraform-managed"]
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

# Wait for any running Cloud Builds to complete before updating Cloud Run service
module "wait_for_cpa_build" {
  source  = "terraform-google-modules/gcloud/google"
  version = "~> 3.0"

  platform = "linux"

  create_cmd_entrypoint = "${path.module}/files/wait_for_build.sh"
  create_cmd_body       = "${google_cloudbuild_trigger.ccwis_case_management.location} ccwis-case-management ${local.cpa_image_url} 20"

  destroy_cmd_entrypoint = "echo"
  destroy_cmd_body       = "Build wait completed"

  module_depends_on = [
    google_cloudbuild_trigger.ccwis_case_management
  ]
}
locals {
  secret_manager_secrets = {
    lightcast-client-secret = var.lightcast_client_secret
  }
}

resource "google_secret_manager_secret" "ccwis_case_management" {
  for_each  = local.secret_manager_secrets
  secret_id = "${local.prefix}${each.key}"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "ccwis_case_management" {
  for_each    = local.secret_manager_secrets
  secret      = google_secret_manager_secret.ccwis_case_management[each.key].id
  secret_data = each.value
}

resource "google_secret_manager_secret_iam_member" "ccwis_case_management" {
  for_each  = local.secret_manager_secrets
  secret_id = google_secret_manager_secret.ccwis_case_management[each.key].secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = google_service_account.ccwis_case_management_runtime_sa.member
}

resource "google_cloud_run_v2_service" "ccwis_case_management" {
  provider            = google-beta
  name                = "${var.environment}-${local.vertex_ai_model_region}-ccwis-case-management${local.random_suffix}"
  location            = local.vertex_ai_model_region
  deletion_protection = var.cloud_run_service_deletion_protection
  ingress             = "INGRESS_TRAFFIC_ALL"
  iap_enabled         = false
  launch_stage        = "GA"
  template {
    service_account = google_service_account.ccwis_case_management_runtime_sa.email
    containers {
      image = google_cloudbuild_trigger.ccwis_case_management.build[0].images[0]
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
          NEXT_PUBLIC_FIREBASE_API_KEY             = data.google_firebase_web_app_config.ccwis_case_management.api_key
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         = data.google_firebase_web_app_config.ccwis_case_management.auth_domain
          NEXT_PUBLIC_FIREBASE_PROJECT_ID          = data.google_project.current.project_id
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      = google_firebase_storage_bucket.ccwis_case_management.bucket_id
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = data.google_firebase_web_app_config.ccwis_case_management.messaging_sender_id
          NEXT_PUBLIC_FIREBASE_APP_ID              = data.google_firebase_web_app_config.ccwis_case_management.web_app_id
          NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID      = data.google_firebase_web_app_config.ccwis_case_management.measurement_id
          NEXT_PUBLIC_DEFAULT_LIGHTCAST_CLIENT_ID  = var.lightcast_client_id
          GCP_PROJECT_ID                           = data.google_project.current.project_id
          GCP_LOCATION                             = local.vertex_ai_model_region
          VERTEX_AI_PROJECT                        = data.google_project.current.project_id
        }
        content {
          name  = env.key
          value = env.value
        }
      }
      # Secret environment variables
      dynamic "env" {
        for_each = {
          NEXT_PUBLIC_DEFAULT_LIGHTCAST_CLIENT_SECRET = {
            secret_id = google_secret_manager_secret.ccwis_case_management["lightcast-client-secret"].secret_id
            version   = google_secret_manager_secret_version.ccwis_case_management["lightcast-client-secret"].version
          }
        }
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = env.value.secret_id
              version = env.value.version
            }
          }
        }
      }
    }
  }
  depends_on = [
    module.wait_for_cpa_build.wait
  ]
}

# Allow unauthenticated access to the Cloud Run service (for public web app)
resource "google_cloud_run_v2_service_iam_member" "ccwis_case_management_noauth" {
  name     = google_cloud_run_v2_service.ccwis_case_management.name
  location = google_cloud_run_v2_service.ccwis_case_management.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
