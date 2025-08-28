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

resource "google_firebase_project" "this" {
  provider = google-beta
  project  = google_project.this.project_id
}

resource "google_firebase_web_app" "ccwis_case_management" {
  depends_on = [
    google_firebase_project.this
  ]
  provider        = google-beta
  project         = google_project.this.project_id
  display_name    = var.add_random_suffix ? "CCWIS Case Management - ${random_string.suffix.result}" : "CCWIS Case Management"
  deletion_policy = "ABANDON"
}

resource "google_firebase_storage_bucket" "ccwis_case_management" {
  provider  = google-beta
  bucket_id = google_storage_bucket.firebase_storage.id
}

# Data source to retrieve Firebase web app configuration
data "google_firebase_web_app_config" "ccwis_case_management" {
  provider   = google-beta
  project    = google_project.this.project_id
  web_app_id = google_firebase_web_app.ccwis_case_management.app_id
}

resource "google_identity_platform_config" "this" {
  project = google_project.this.project_id
  authorized_domains = concat([
    "localhost",
    "${google_project.this.project_id}.firebaseapp.com",
    "${google_project.this.project_id}.web.app",
    ], [for url in google_cloud_run_v2_service.ui.urls : trimprefix(url, "https://")],
    var.custom_domain_list,
  )
  autodelete_anonymous_users = false
  client {
    permissions {
      disabled_user_deletion = false
      disabled_user_signup   = false
    }
  }
  mfa {
    enabled_providers = []
    state             = "DISABLED"
  }
  monitoring {
    request_logging {
      enabled = true
    }
  }
  multi_tenant {
    allow_tenants = false
  }
  sign_in {
    allow_duplicate_emails = false
    email {
      enabled           = true
      password_required = true
    }
    phone_number {
      enabled            = false
      test_phone_numbers = {}
    }
  }
}
