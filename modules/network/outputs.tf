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

output "network" {
  value       = google_compute_network.this
  description = "VPC network"
}
output "subnetwork" {
  depends_on  = [time_sleep.wait_x_seconds]
  value       = google_compute_subnetwork.subnets
  description = "Subnetwork and secondary subnets"
}
output "router" {
  value       = google_compute_router.router
  description = "GCP Cloud Router"
}
output "router_nat" {
  value       = google_compute_router_nat.nat
  description = "GCP Cloud NAT"
}
output "dns_policy" {
  value       = google_dns_policy.this
  description = "DNS Policy"
}
output "logs_bucket" {
  value       = google_storage_bucket.logs
  description = "Logs bucket"
}