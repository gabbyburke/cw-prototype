# Configure the Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Local values for resource naming
locals {
  # Common resource naming components
  resource_prefix = "${var.project_base_name}${var.unique_id}-${var.env}"
  
  # Common tags/labels
  common_labels = {
    project     = var.project_base_name
    environment = var.env
    managed_by  = "terraform"
  }
}

# Network module - VPC, subnet, and serverless VPC access connector
module "network" {
  source = "../../modules/network"
  
  project_id        = var.project_id
  region           = var.region
  location         = var.location
  env              = var.env
  project_base_name = var.project_base_name
  unique_id        = var.unique_id
  docker_repo_path = var.docker_repo_path
}

# Data module - Storage buckets, Firestore, BigQuery
module "data" {
  source = "../../modules/data"
  
  project_id        = var.project_id
  region           = var.region
  location         = var.location
  env              = var.env
  project_base_name = var.project_base_name
  unique_id        = var.unique_id
  docker_repo_path = var.docker_repo_path
}

# APIs module - Core Case Management and Referral Intake APIs
module "apis" {
  source = "../../modules/apis"
  
  project_id        = var.project_id
  region           = var.region
  location         = var.location
  env              = var.env
  project_base_name = var.project_base_name
  unique_id        = var.unique_id
  docker_repo_path = var.docker_repo_path
  
  # Dependencies
  vpc_connector_id = module.network.vpc_connector_id
  deploy_bucket_name = module.data.deploy_bucket_name
}

# UI module - Next.js web application
module "ui" {
  source = "../../modules/ui"
  
  project_id        = var.project_id
  region           = var.region
  location         = var.location
  env              = var.env
  project_base_name = var.project_base_name
  unique_id        = var.unique_id
  docker_repo_path = var.docker_repo_path
  
  # Dependencies
  vpc_connector_id = module.network.vpc_connector_id
  
  # API URLs for environment variables
  core_case_mgmt_api_url = module.apis.core_case_mgmt_api_url
  referral_intake_api_url = module.apis.referral_intake_api_url
  
  # Service names for IAM permissions
  core_case_mgmt_service_name = module.apis.core_case_mgmt_service_name
  referral_intake_service_name = module.apis.referral_intake_service_name
}
