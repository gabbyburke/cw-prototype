# Local values for resource naming
locals {
  vpc_name = "${var.project_base_name}${var.unique_id}-${var.env}-vpc"
  subnet_name = "${var.project_base_name}${var.unique_id}-${var.env}-net"
  vpc_connector_name = "${var.project_base_name}${var.unique_id}-${var.env}-vpccon"
}

# VPC Network
resource "google_compute_network" "vpc" {
  name                    = local.vpc_name
  auto_create_subnetworks = false
  project                 = var.project_id
}

# Subnet
resource "google_compute_subnetwork" "subnet" {
  name          = local.subnet_name
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
  project       = var.project_id
  
  # Enable private Google access for serverless services
  private_ip_google_access = true
}

# Serverless VPC Access Connector
resource "google_vpc_access_connector" "connector" {
  name          = local.vpc_connector_name
  project       = var.project_id
  region        = var.region
  ip_cidr_range = "10.0.1.0/28"
  network       = google_compute_network.vpc.name
  
  depends_on = [google_compute_network.vpc]
}

# Firewall rule to allow internal communication
resource "google_compute_firewall" "allow_internal" {
  name    = "${local.vpc_name}-allow-internal"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = ["10.0.0.0/16"]
}

# Firewall rule to allow health checks
resource "google_compute_firewall" "allow_health_checks" {
  name    = "${local.vpc_name}-allow-health-checks"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["8080", "8443"]
  }

  source_ranges = [
    "130.211.0.0/22",
    "35.191.0.0/16"
  ]
  
  target_tags = ["health-check"]
}
