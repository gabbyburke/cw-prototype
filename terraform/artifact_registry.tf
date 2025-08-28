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

resource "google_artifact_registry_repository" "docker" {
  location               = data.google_compute_zones.available.region
  repository_id          = "${local.prefix}ccwis-case-management"
  description            = "CCWIS Case Management"
  format                 = "DOCKER"
  cleanup_policy_dry_run = false
  cleanup_policies {
    action = "DELETE"
    id     = "Remove old versions"

    condition {
      older_than = "7776000s" # 90 days
      tag_state  = "ANY"
    }
  }
  cleanup_policies {
    action = "KEEP"
    id     = "Keep most recent versions"

    most_recent_versions {
      keep_count = 5
    }
  }
}

locals {
  image_base_url = join(
    "/",
    [
      "${google_artifact_registry_repository.docker.location}-docker.pkg.dev",
      google_project.this.project_id,
      google_artifact_registry_repository.docker.repository_id,
    ]
  )
}
