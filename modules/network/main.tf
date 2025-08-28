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
  # add hyphen to prefix and suffix if not already present
  prefix = can(regex("^.*-$|^$", var.prefix)) ? var.prefix : "${var.prefix}-"
  suffix = can(regex("^-.*$|^$", var.suffix)) ? var.suffix : "-${var.suffix}"
  labels = merge(
    var.labels,
    {
      "terraform-module" = "network"
    }
  )
  firewall_rules = var.disable_default_firewall_rules ? toset([
    "rdp",
    "ssh",
    "icmp",
    "internal",
  ]) : toset([])
}

data "google_client_config" "current" {}

resource "google_compute_network" "this" {
  name                            = var.network_name == null ? "${local.prefix}main${local.suffix}" : var.network_name
  auto_create_subnetworks         = false
  delete_default_routes_on_create = false
}

resource "google_compute_subnetwork" "subnets" {
  count                    = var.subnetwork_cidr == null ? 0 : 1
  name                     = "${local.prefix}subnetwork${local.suffix}"
  ip_cidr_range            = var.subnetwork_cidr
  region                   = data.google_client_config.current.region
  network                  = google_compute_network.this.id
  private_ip_google_access = true

  dynamic "secondary_ip_range" {
    for_each = var.secondary_subnets
    content {
      range_name    = secondary_ip_range.key
      ip_cidr_range = secondary_ip_range.value
    }
  }
  log_config {
    aggregation_interval = "INTERVAL_10_MIN"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }
}

resource "time_sleep" "wait_x_seconds" {
  count = var.subnetwork_cidr == null ? 0 : 1
  depends_on = [
    google_compute_subnetwork.subnets[0],
  ]
  create_duration = "60s"
}

resource "google_dns_policy" "this" {
  name                      = "${google_compute_network.this.name}-policy"
  enable_inbound_forwarding = true
  enable_logging            = true
  networks {
    network_url = google_compute_network.this.id
  }
}

resource "google_compute_router" "router" {
  count   = var.enable_cloud_nat ? 1 : 0
  name    = "${local.prefix}router${local.suffix}"
  region  = data.google_client_config.current.region
  network = google_compute_network.this.id
}

resource "google_compute_address" "nat" {
  count        = var.enable_cloud_nat ? 1 : 0
  name         = "${local.prefix}nat-ip${local.suffix}"
  address_type = "EXTERNAL"
  region       = data.google_client_config.current.region
  labels       = local.labels
}

resource "google_compute_router_nat" "nat" {
  count                              = var.enable_cloud_nat ? 1 : 0
  name                               = "${local.prefix}router-nat${local.suffix}"
  router                             = google_compute_router.router[0].name
  region                             = google_compute_router.router[0].region
  nat_ip_allocate_option             = "MANUAL_ONLY"
  nat_ips                            = [google_compute_address.nat[0].self_link]
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

resource "google_compute_firewall" "default" {
  for_each = local.firewall_rules
  name     = "default-allow-${each.key}"
  network  = google_compute_network.this.name
  disabled = true

  allow {
    protocol = each.key
  }
}

resource "google_project_iam_audit_config" "all_services" {
  count   = var.enable_all_services_audit_logs ? 1 : 0
  project = var.project_id
  service = "allServices"
  audit_log_config {
    log_type = "ADMIN_READ"
  }
  audit_log_config {
    log_type = "DATA_READ"
  }
  audit_log_config {
    log_type = "DATA_WRITE"
  }
}

resource "google_logging_project_bucket_config" "default" {
  count            = var.enable_all_services_audit_logs ? 1 : 0
  project          = var.project_id
  location         = "global"
  retention_days   = 365
  enable_analytics = true
  bucket_id        = "_Default"
}

resource "random_string" "random" {
  length  = 6
  special = false
  upper   = false
}

resource "google_storage_bucket" "logs" {
  name                        = "${local.prefix}bucket-access-logs-${random_string.random.result}"
  location                    = "US"
  storage_class               = var.logs_storage_class
  force_destroy               = var.force_destroy_logs_buckets
  uniform_bucket_level_access = true
}

# https://cloud.google.com/storage/docs/access-logs
resource "google_storage_bucket_iam_binding" "logs" {
  bucket  = google_storage_bucket.logs.name
  role    = "roles/storage.objectCreator"
  members = ["group:cloud-storage-analytics@google.com"]
}

resource "google_storage_bucket" "logs_archive" {
  name                        = "${local.prefix}logs-archive-${random_string.random.result}"
  location                    = "US"
  storage_class               = var.logs_storage_class
  public_access_prevention    = "enforced"
  force_destroy               = var.force_destroy_logs_buckets
  uniform_bucket_level_access = true
  labels                      = local.labels
  logging {
    log_bucket        = google_storage_bucket.logs.name
    log_object_prefix = "${local.prefix}logs-archive/"
  }
  retention_policy {
    retention_period = var.log_retention_seconds
    is_locked        = var.log_retention_policy_locked
  }
}

resource "google_logging_project_bucket_config" "gcs" {
  count            = var.enable_all_services_audit_logs ? 1 : 0
  project          = var.project_id
  location         = "global"
  retention_days   = var.log_retention_days
  enable_analytics = true
  bucket_id        = google_storage_bucket.logs_archive.id
}

resource "google_logging_project_sink" "all_logs" {
  name                   = "${local.prefix}logs-archive-${random_string.random.result}"
  description            = "Exports all logs for long-term storage"
  destination            = "storage.googleapis.com/${google_storage_bucket.logs_archive.name}"
  unique_writer_identity = true
}

resource "google_project_iam_binding" "all_logs_writer" {
  project = var.project_id
  role    = "roles/storage.objectCreator"
  members = [google_logging_project_sink.all_logs.writer_identity]
}
