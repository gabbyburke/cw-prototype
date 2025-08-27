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

locals {
  prefix                           = length(var.environment) >= 4 ? "${var.environment}-" : "${var.environment}-${data.google_client_config.current.region}-"
  common_labels                    = merge({ environment = var.environment }, var.common_labels)
  dev_env                          = length(regexall("(poc|dev)", var.environment)) > 0
  vertex_ai_models_only_in_regions = ["us-central1", "us-east1", "us-east4", "us-east5", "us-south1", "us-west1", "us-west4"]
  vertex_ai_model_region           = contains(local.vertex_ai_models_only_in_regions, data.google_client_config.current.region) ? data.google_client_config.current.region : "us-central1"
  random_suffix                    = var.add_random_suffix ? "-${random_string.suffix.result}" : ""
}