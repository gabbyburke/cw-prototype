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

# Cloud Build Builder
resource "google_service_account" "cloud_build_deployer" {
  account_id   = regex("^(.*?)(?:-)?$", substr("${local.prefix}cloud-build", 0, 30))[0]
  display_name = "Cloud Build builder"
  description  = "Service account used by Cloud Build triggers to deploy Cloud Run services"
}

resource "google_project_iam_member" "cloud_build_deployer" {
  for_each = toset([
    "roles/cloudbuild.builds.builder",
  ])
  project = google_project.this.project_id
  role    = each.value
  member  = google_service_account.cloud_build_deployer.member
}

resource "google_storage_bucket_iam_member" "cloud_build_deployer" {
  bucket = google_storage_bucket.cloud_run_code.name
  role   = "roles/storage.objectAdmin"
  member = google_service_account.cloud_build_deployer.member
}

resource "google_artifact_registry_repository_iam_member" "cloud_build_deployer" {
  repository = google_artifact_registry_repository.docker.name
  role       = "roles/artifactregistry.writer"
  member     = google_service_account.cloud_build_deployer.member
}

# Remove default compute service account from editor role
data "google_compute_default_service_account" "default" {}

resource "google_project_iam_member_remove" "default_compute_service_account" {
  role    = "roles/editor"
  project = google_project.this.project_id
  member  = data.google_compute_default_service_account.default.member
}

resource "google_project_service_identity" "cloudbuild" {
  provider = google-beta
  service  = "cloudbuild.googleapis.com"
  provisioner "local-exec" {
    command = "sleep 60"
  }
}

resource "google_project_iam_member" "cloudbuild_service_agent_role" {
  depends_on = [
    google_project_service.services["cloudbuild.googleapis.com"],
    google_project_service_identity.cloudbuild
  ]
  for_each = toset([
    "roles/cloudbuild.serviceAgent",
    "roles/pubsub.subscriber",
  ])
  project = google_project.this.project_id
  role    = each.value
  member  = google_project_service_identity.cloudbuild.member
}

resource "time_sleep" "wait_for_iam_propagation" {
  create_duration = "30s"

  # This map triggers a re-sleep whenever any of these IAM resources change.
  triggers = {
    gcs_publisher_id                 = values(google_pubsub_topic_iam_member.gcs_pubsub_publisher)[0].id
    eventarc_receiver_id             = values(google_project_iam_member.eventarc_trigger)[0].id
    runtime_sa_perms_id              = values(google_project_iam_member.input_catalog)[0].id
    cloudbuild_service_agent_role_id = values(google_project_iam_member.cloudbuild_service_agent_role)[0].id
    vertex_ai_user_id                = values(google_project_iam_member.vertex_ai_user)[0].id
    task_queue_id                    = google_cloud_tasks_queue_iam_member.input_catalog_dispatcher.id
    dispatcher_sa_perm_id            = values(google_project_iam_member.input_catalog_dispatcher)[0].id
  }
}
