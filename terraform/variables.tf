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

variable "region" {
  type        = string
  default     = "us-central1"
  description = "Region where resources will be created by default. Required Vertex AI Models are only available in us-central1, us-east1, us-east4, us-east5, us-south1, us-west1, us-west4. If you plan to use a custom domain mapping, then you will need to be in us-central1, us-east1, us-east4, or us-west1."
}

variable "project_id" {
  type        = string
  description = "Project where the environment will be created."
}

variable "environment" {
  type        = string
  description = "Environment where resources will be created (e.g. dev/uat/prod). This is also used as a prefix for resource names."
}

variable "common_labels" {
  type        = map(string)
  default     = {}
  description = "Map of generic labels to assign to all resources that accept labels."
}

variable "lightcast_client_id" {
  type        = string
  description = "Lightcast client ID."
}

variable "lightcast_client_secret" {
  type        = string
  description = "Lightcast client secret."
}

variable "add_random_suffix" {
  type        = bool
  default     = false
  description = "Add a random suffix to the resource names. This is useful for testing and development environments to avoid conflicts with existing resources."
}

variable "custom_domain_list" {
  type        = list(string)
  default     = []
  description = "List of custom domains to use to be used along with the default Cloud Run service URLs."
}

variable "cloud_run_service_deletion_protection" {
  type        = bool
  default     = false
  description = "Whether to enable deletion protection for Cloud Run services. This is useful to prevent accidental deletion of services in a production environment."
}

variable "alert_email_address_list" {
  type        = list(string)
  default     = []
  description = "List of email addresses to send alerts to."
}