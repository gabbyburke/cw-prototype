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

resource "google_firestore_database" "this" {
  depends_on = [
    google_project_service.services["firestore.googleapis.com"]
  ]
  name        = var.add_random_suffix ? "ccwis-case-management${local.random_suffix}" : "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"
  # database_edition                  = local.dev_env ? "STANDARD" : "ENTERPRISE" # Firestore enterprise requires a named database
  # concurrency_mode                  = local.dev_env ? "OPTIMISTIC" : "PESSIMISTIC"
  database_edition                  = "STANDARD"
  concurrency_mode                  = "OPTIMISTIC"
  app_engine_integration_mode       = "DISABLED"
  point_in_time_recovery_enablement = "POINT_IN_TIME_RECOVERY_ENABLED"
  delete_protection_state           = local.dev_env ? "DELETE_PROTECTION_DISABLED" : "DELETE_PROTECTION_ENABLED"
  deletion_policy                   = "DELETE"
}

resource "google_firestore_index" "this" {
  database   = google_firestore_database.this.name
  collection = "userPathways"

  fields {
    field_path = "userId"
    order      = "ASCENDING"
  }

  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }

  fields {
    field_path = "__name__"
    order      = "DESCENDING"
  }
}

resource "google_firebaserules_ruleset" "firestore" {
  depends_on = [
    google_project_service.services["firebaserules.googleapis.com"]
  ]
  source {
    files {
      content = file("../files/firestore.rules")
      name    = "firestore.rules"
    }
  }
}

resource "google_firebaserules_release" "firestore" {
  name         = "cloud.firestore"
  ruleset_name = google_firebaserules_ruleset.firestore.name
}

resource "google_firestore_backup_schedule" "daily" {
  database  = google_firestore_database.this.name
  retention = "1209600s" # 14 days
  daily_recurrence {}
}

resource "google_firestore_backup_schedule" "weekly" {
  database  = google_firestore_database.this.name
  retention = local.dev_env ? "2419200s" : "8467200s" # 28 days: 98 days
  weekly_recurrence {
    day = "SATURDAY"
  }
  # Depends on daily backup, otherwise there can be a concurrent access error during terraform apply
  depends_on = [google_firestore_backup_schedule.daily]
}
