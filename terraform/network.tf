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

module "network" {
  depends_on = [
    time_sleep.wait_for_iam_propagation
  ]
  source                         = "../modules/network"
  project_id                     = google_project.this.project_id
  prefix                         = local.prefix
  enable_cloud_nat               = true
  disable_default_firewall_rules = true
  enable_all_services_audit_logs = false # Set this to true to enable audit logs and log retention
  force_destroy_logs_buckets     = var.environment == "prod" ? false : true
  log_retention_seconds          = 31536000 # 1 year
  logs_storage_class             = var.environment == "prod" ? "ARCHIVE" : "STANDARD"
}

resource "random_string" "suffix" {
  length  = 4
  special = false
  upper   = false
}
