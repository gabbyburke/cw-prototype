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

data "archive_file" "input_catalog_dispatcher_tarball" {
  type        = "tar.gz"
  output_path = "${path.module}/input_catalog_dispatcher.tar.gz"
  source_dir  = "../src/dispatcher"
}

locals {
  input_catalog_dispatcher_tarball_name = "cloud-run/input-catalog-dispatcher.tar.gz"
}

resource "google_storage_bucket_object" "input_catalog_dispatcher_tarball" {
  name   = local.input_catalog_dispatcher_tarball_name
  bucket = google_storage_bucket.cloud_run_code.name
  source = data.archive_file.input_catalog_dispatcher_tarball.output_path
  depends_on = [
    google_storage_notification.input_catalog_dispatcher_tarball,
    google_cloudbuild_trigger.input_catalog_dispatcher_build_trigger
  ]
}

resource "google_storage_notification" "input_catalog_dispatcher_tarball" {
  bucket             = google_storage_bucket.cloud_run_code.name
  payload_format     = "NONE"
  topic              = google_pubsub_topic.input_catalog_dispatcher_source_upload.id
  event_types        = ["OBJECT_FINALIZE"]
  object_name_prefix = local.input_catalog_dispatcher_tarball_name
  depends_on         = [time_sleep.wait_for_iam_propagation]
}

resource "google_cloud_tasks_queue" "input_catalog_dispatcher" {
  depends_on = [
    google_project_service.services["cloudtasks.googleapis.com"]
  ]
  name     = "input-catalog-dispatch"
  location = data.google_compute_zones.available.region
  rate_limits {
    max_concurrent_dispatches = 1
    max_dispatches_per_second = 1
  }
  retry_config {
    max_attempts       = 100
    min_backoff        = "10s"  # "3600s"
    max_backoff        = "900s" # "7200s"
    max_doublings      = 16
    max_retry_duration = "86400s"
  }
}

resource "google_service_account" "input_catalog_dispatcher" {
  account_id   = regex("^(.*?)(?:-)?$", substr("${local.prefix}dispatcher", 0, 30))[0]
  display_name = "Service Account for Input Catalog Dispatcher"
  description  = "Service account used by the input catalog dispatcher"
}

resource "google_cloud_tasks_queue_iam_member" "input_catalog_dispatcher" {
  location = google_cloud_tasks_queue.input_catalog_dispatcher.location
  name     = google_cloud_tasks_queue.input_catalog_dispatcher.name
  role     = "roles/cloudtasks.enqueuer"
  member   = google_service_account.input_catalog_dispatcher.member
}

resource "google_project_iam_member" "input_catalog_dispatcher" {
  for_each = toset([
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
  ])
  project = google_project.this.project_id
  role    = each.value
  member  = google_service_account.input_catalog_dispatcher.member
}

resource "google_service_account_iam_member" "input_catalog_dispatcher" {
  service_account_id = google_service_account.input_catalog_dispatcher.name
  role               = "roles/iam.serviceAccountUser"
  member             = google_service_account.cloud_build_deployer.member
}

resource "google_pubsub_topic" "input_catalog_dispatcher_source_upload" {
  name = "input-catalog-dispatcher-source-upload${local.random_suffix}"
}

resource "google_pubsub_topic_iam_member" "input_catalog_dispatcher_gcs_pubsub_publisher" {
  topic  = google_pubsub_topic.input_catalog_dispatcher_source_upload.name
  role   = "roles/pubsub.publisher"
  member = data.google_storage_project_service_account.gcs_service_account.member
}

locals {
  # Use first 12 characters of source hash as tag - only changes when source changes
  input_catalog_dispatcher_computed_image_tag = substr(data.archive_file.input_catalog_dispatcher_tarball.output_sha256, 0, 12)

  # List of tags to apply to the image
  input_catalog_dispatcher_image_tags = [
    local.input_catalog_dispatcher_computed_image_tag,
    "latest"
  ]
  # Generate image URLs for all tags
  input_catalog_dispatcher_image_urls = formatlist("%s:%s", "${local.image_base_url}/input-catalog-dispatcher", local.input_catalog_dispatcher_image_tags)
  input_catalog_dispatcher_image_url  = local.input_catalog_dispatcher_image_urls[0]
}

resource "google_cloudbuild_trigger" "input_catalog_dispatcher_build_trigger" {
  name            = "${local.prefix}input-catalog-dispatcher-trigger"
  location        = data.google_compute_zones.available.region
  description     = "Triggers a build and deploy to Cloud Run when a new source .tar.gz is uploaded."
  service_account = google_service_account.cloud_build_deployer.id

  pubsub_config {
    topic = google_pubsub_topic.input_catalog_dispatcher_source_upload.id
  }

  build {
    source {
      storage_source {
        bucket = google_storage_bucket.cloud_run_code.name
        object = local.input_catalog_dispatcher_tarball_name
      }
    }
    step {
      name = "gcr.io/cloud-builders/docker"
      args = flatten(["build", [for url in local.input_catalog_dispatcher_image_urls : ["-t", url]], ["-f", "Dockerfile", "."]])
    }
    images      = local.input_catalog_dispatcher_image_urls
    logs_bucket = "${google_storage_bucket.cloud_run_code.name}/build-logs/input-catalog-dispatcher"
    tags        = ["input-catalog-dispatcher", "terraform-managed"]
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

module "wait_for_input_catalog_dispatcher_build" {
  source  = "terraform-google-modules/gcloud/google"
  version = "~> 3.0"

  platform              = "linux"
  create_cmd_entrypoint = "bash"
  create_cmd_body       = "${path.module}/../files/wait_for_build.sh ${google_cloudbuild_trigger.input_catalog_dispatcher_build_trigger.location} input-catalog-dispatcher ${local.input_catalog_dispatcher_image_url} 5"

  destroy_cmd_entrypoint = "echo"
  destroy_cmd_body       = "Build wait completed"

  module_depends_on = [
    google_cloudbuild_trigger.input_catalog_dispatcher_build_trigger
  ]
}

resource "google_cloud_run_v2_service" "input_catalog_dispatcher" {
  name                = "${local.prefix}input-catalog-dispatcher${local.random_suffix}"
  location            = data.google_compute_zones.available.region
  deletion_protection = var.cloud_run_service_deletion_protection
  ingress             = "INGRESS_TRAFFIC_INTERNAL_ONLY"

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  template {
    service_account = google_service_account.input_catalog_dispatcher.email
    containers {
      image = google_cloudbuild_trigger.input_catalog_dispatcher_build_trigger.build[0].images[0]
      resources {
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
      }
      dynamic "env" {
        for_each = {
          GCP_PROJECT         = google_project.this.project_id
          GCP_LOCATION        = data.google_compute_zones.available.region
          TASK_QUEUE          = google_cloud_tasks_queue.input_catalog_dispatcher.name
          WORKER_SERVICE_URL  = google_cloud_run_v2_service.input_catalog.uri
          DISPATCHER_SA_EMAIL = google_service_account.input_catalog_dispatcher.email
        }
        content {
          name  = env.key
          value = env.value
        }
      }
    }
  }
  depends_on = [
    module.wait_for_input_catalog_dispatcher_build.wait
  ]
}

resource "google_cloud_run_v2_service_iam_member" "eventarc_trigger" {
  name     = google_cloud_run_v2_service.input_catalog_dispatcher.name
  location = google_cloud_run_v2_service.input_catalog_dispatcher.location
  role     = "roles/run.invoker"
  member   = google_service_account.eventarc_trigger.member
}

resource "google_project_service_identity" "cloudtasks" {
  provider = google-beta
  service  = "cloudtasks.googleapis.com"
  provisioner "local-exec" {
    command = "sleep 30"
  }
}

resource "google_project_iam_member" "tasks_run_invoker" {
  project = google_project.this.project_id
  role    = "roles/run.invoker"
  member  = google_project_service_identity.cloudtasks.member
}

# Allow the Cloud Tasks service agent to impersonate the dispatcher SA for authentication to Input Catalog
resource "google_service_account_iam_member" "cloud_tasks_dispatcher_sa_user" {
  service_account_id = google_service_account.input_catalog_dispatcher.name
  role               = "roles/iam.serviceAccountUser"
  member             = google_project_service_identity.cloudtasks.member
}

# yes it needs to impersonate itself
resource "google_service_account_iam_member" "dispatcher_self_impersonation" {
  service_account_id = google_service_account.input_catalog_dispatcher.name
  role               = "roles/iam.serviceAccountUser"
  member             = google_service_account.input_catalog_dispatcher.member
}

# Eventarc Resources
resource "google_project_service_identity" "eventarc" {
  provider = google-beta
  service  = "eventarc.googleapis.com"
  provisioner "local-exec" {
    command = "sleep 30"
  }
}

resource "google_service_account" "eventarc_trigger" {
  account_id   = regex("^(.*?)(?:-)?$", substr("${local.prefix}eventarc", 0, 30))[0]
  display_name = "Service Account for Eventarc Trigger"
  description  = "Service account used by the eventarc trigger"
}

resource "google_project_iam_member" "eventarc_trigger" {
  for_each = toset([
    "roles/eventarc.eventReceiver",
  ])
  project = google_project.this.project_id
  role    = each.value
  member  = google_service_account.eventarc_trigger.member
}

resource "google_project_iam_member" "eventarc_service_agent_role" {
  project = google_project.this.project_id
  role    = "roles/eventarc.serviceAgent"
  member  = google_project_service_identity.eventarc.member
  provisioner "local-exec" {
    command = "sleep 30"
  }
}

resource "google_service_account_iam_member" "eventarc_sa_user" {
  service_account_id = google_service_account.eventarc_trigger.name
  role               = "roles/iam.serviceAccountUser"
  member             = google_project_service_identity.eventarc.member
}

resource "google_project_service_identity" "pubsub" {
  provider = google-beta
  service  = "pubsub.googleapis.com"
  provisioner "local-exec" {
    command = "sleep 30"
  }
}

# Cloud Pub/Sub needs the role roles/iam.serviceAccountTokenCreator granted to service account service-457787118516@gcp-sa-pubsub.iam.gserviceaccount.com on this project to create identity tokens.
resource "google_service_account_iam_member" "pubsub_sa_user" {
  service_account_id = google_service_account.eventarc_trigger.name
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = google_project_service_identity.pubsub.member
}

resource "google_eventarc_trigger" "new_input_catalog_upload" {
  name     = "${local.prefix}new-input-catalog-upload"
  location = lower(google_storage_bucket.course_catalog.location) # This API only takes lower case "us"

  matching_criteria {
    attribute = "type"
    value     = "google.cloud.storage.object.v1.finalized"
  }
  matching_criteria {
    attribute = "bucket"
    value     = google_storage_bucket.course_catalog.name
  }
  destination {
    cloud_run_service {
      service = google_cloud_run_v2_service.input_catalog_dispatcher.name
      region  = google_cloud_run_v2_service.input_catalog_dispatcher.location
      path    = "/"
    }
  }
  service_account = google_service_account.eventarc_trigger.email
  depends_on = [
    google_project_iam_member.eventarc_service_agent_role,
    google_project_iam_member.gcs_service_account,
  ]
}
