# UI Web Application
module "ui_service" {
  source = "../templates/cloud_run_service"
  
  # Common variables
  project_id        = var.project_id
  region           = var.region
  location         = var.location
  env              = var.env
  project_base_name = var.project_base_name
  unique_id        = var.unique_id
  docker_repo_path = var.docker_repo_path
  
  # Service-specific configuration
  specific_resource_name = "ui"
  
  # Resource allocation
  cpu    = "1"
  memory = "2Gi"
  
  # Scaling configuration
  min_instance_count = 0
  max_instance_count = 10
  
  # Network configuration - UI needs public access with IAP
  ingress = "INGRESS_TRAFFIC_ALL"
  require_authentication = false # IAP handles authentication
  iap_enabled = true
  vpc_connector = var.vpc_connector_id
  egress = "ALL_TRAFFIC"
  
  # Environment variables for API endpoints
  environment_variables = {
    ENV = var.env
    PROJECT_ID = var.project_id
    CORE_CASE_MGMT_API_URL = var.core_case_mgmt_api_url
    REFERRAL_INTAKE_API_URL = var.referral_intake_api_url
    NODE_ENV = "production"
  }
  
  # Service account roles - needs to invoke backend APIs
  service_account_roles = [
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/cloudtrace.agent",
    "roles/run.invoker" # To invoke backend APIs
  ]
  
  # No specific invokers needed - IAP handles authentication
  invoker_emails = []
}

# Grant the UI service account permission to invoke backend APIs
resource "google_cloud_run_v2_service_iam_member" "ui_invoke_core_case_mgmt" {
  count = var.core_case_mgmt_service_name != null ? 1 : 0
  
  project  = var.project_id
  location = var.region
  name     = var.core_case_mgmt_service_name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${module.ui_service.service_account_email}"
}

resource "google_cloud_run_v2_service_iam_member" "ui_invoke_referral_intake" {
  count = var.referral_intake_service_name != null ? 1 : 0
  
  project  = var.project_id
  location = var.region
  name     = var.referral_intake_service_name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${module.ui_service.service_account_email}"
}
