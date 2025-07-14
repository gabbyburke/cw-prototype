# Local values for resource naming
locals {
  service_name = "${var.project_base_name}${var.unique_id}-${var.env}-${var.specific_resource_name}-crsvc"
  service_account_name = "${var.project_base_name}${var.unique_id}-${var.env}-${var.specific_resource_name}-sa"
  service_account_email = "${local.service_account_name}@${var.project_id}.iam.gserviceaccount.com"
  docker_image_name = "${var.project_base_name}${var.unique_id}-${var.env}-${var.specific_resource_name}-dimg"
  docker_image_url = "${var.docker_repo_path}/${local.docker_image_name}:latest"
}

# Create a custom service account for the Cloud Run service
resource "google_service_account" "service_account" {
  account_id   = local.service_account_name
  display_name = "Service Account for ${var.specific_resource_name} Cloud Run Service"
  description  = "Service account for ${local.service_name}"
}

# Bind roles to the service account
resource "google_project_iam_member" "service_account_roles" {
  for_each = toset(var.service_account_roles)
  
  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.service_account.email}"
}

# Cloud Run service
resource "google_cloud_run_v2_service" "service" {
  provider = "google-beta" # ALWAYS USE QUOTES, EVEN IF LINTER SAYS NOT TO
  
  name     = local.service_name
  location = var.region
  project  = var.project_id
  
  launch_stage = "BETA"
  
  ingress = var.ingress
  iap_enabled = var.iap_enabled
  
  template {
    service_account = google_service_account.service_account.email
    
    scaling {
      min_instance_count = var.min_instance_count
      max_instance_count = var.max_instance_count
    }
    
    timeout = var.timeout
    max_instance_request_concurrency = var.concurrency
    
    containers {
      image = local.docker_image_url
      
      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
      }
      
      # Environment variables
      dynamic "env" {
        for_each = var.environment_variables
        content {
          name  = env.key
          value = env.value
        }
      }
    }
    
    # VPC access configuration
    dynamic "vpc_access" {
      for_each = var.vpc_connector != null ? [1] : []
      content {
        connector = var.vpc_connector
        egress    = var.egress
      }
    }
  }
  
  depends_on = [google_service_account.service_account]
}

# IAM policy for invokers
resource "google_cloud_run_v2_service_iam_member" "invokers" {
  for_each = toset(var.invoker_emails)
  
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.service.name
  role     = "roles/run.invoker"
  member   = each.value
}

# If IAM authentication is required but no specific invokers are set,
# allow the service account to invoke itself (for internal calls)
resource "google_cloud_run_v2_service_iam_member" "self_invoke" {
  count = var.require_authentication && length(var.invoker_emails) == 0 ? 1 : 0
  
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.service.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.service_account.email}"
}
