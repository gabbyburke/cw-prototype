# Network outputs
output "vpc_id" {
  description = "The ID of the VPC network"
  value       = module.network.vpc_id
}

output "subnet_id" {
  description = "The ID of the subnet"
  value       = module.network.subnet_id
}

output "vpc_connector_id" {
  description = "The ID of the VPC connector"
  value       = module.network.vpc_connector_id
}

# Data outputs
output "deploy_bucket_name" {
  description = "The name of the deployment bucket"
  value       = module.data.deploy_bucket_name
}

output "firestore_database_id" {
  description = "The ID of the Firestore database"
  value       = module.data.firestore_database_id
}

output "bigquery_dataset_id" {
  description = "The ID of the BigQuery dataset"
  value       = module.data.bigquery_dataset_id
}

# API outputs
output "core_case_mgmt_api_url" {
  description = "The URL of the Core Case Management API"
  value       = module.apis.core_case_mgmt_api_url
}

output "referral_intake_api_url" {
  description = "The URL of the Referral Intake API"
  value       = module.apis.referral_intake_api_url
}

# UI outputs
output "ui_url" {
  description = "The URL of the web UI"
  value       = module.ui.ui_url
}

output "ui_service_name" {
  description = "The name of the UI Cloud Run service"
  value       = module.ui.ui_service_name
}

# Summary output for easy reference
output "application_urls" {
  description = "All application URLs"
  value = {
    web_ui                = module.ui.ui_url
    core_case_mgmt_api   = module.apis.core_case_mgmt_api_url
    referral_intake_api  = module.apis.referral_intake_api_url
  }
}
