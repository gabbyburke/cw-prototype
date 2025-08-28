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

variable "prefix" {
  type        = string
  default     = ""
  description = "Prefix to be used in naming all applicable resources"
}
variable "suffix" {
  type        = string
  default     = ""
  description = "Suffix to be used in naming all applicable resources"
}
variable "network_name" {
  type        = string
  default     = null
  description = "Name of the network"
}
variable "subnetwork_cidr" {
  type        = string
  default     = null
  description = "CIDR block for the VPC subnetwork"
}
variable "secondary_subnets" {
  type        = map(string)
  default     = {}
  description = "List of secondary subnets to create in the VPC"
}
variable "enable_cloud_nat" {
  type        = bool
  default     = false
  description = "Set to true if you need to enable Cloud NAT for internet connectivity"
}
variable "disable_default_firewall_rules" {
  type        = bool
  default     = true
  description = "Disable default firewall rules in default network"
}
variable "labels" {
  type        = map(any)
  default     = {}
  description = "A map of labels to apply to contained resources"
}
variable "enable_all_services_audit_logs" {
  type        = bool
  default     = true
  description = "Enable all services audit logs"
}
variable "log_retention_days" {
  type        = number
  default     = 365
  description = "Number of days to retain logs in project logging bucket"
}
variable "log_retention_policy_locked" {
  type        = bool
  default     = false
  description = "Whether or not the log retention policy is locked"
}
variable "log_retention_seconds" {
  type        = number
  default     = 220752000 # 7 years
  description = "Number of seconds to retain logs in audit logs archive bucket"
  validation {
    condition     = var.log_retention_seconds < 2147483647
    error_message = "Log retention must be less than 2,147,483,647 seconds"
  }
}
variable "force_destroy_logs_buckets" {
  type        = bool
  default     = false
  description = "Force destroy logs archive and bucket access logs buckets"
}
variable "logs_storage_class" {
  type        = string
  default     = "ARCHIVE"
  description = "Storage class for logs archive and bucket access logs buckets"
}
