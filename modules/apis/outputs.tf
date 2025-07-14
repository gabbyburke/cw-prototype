# Core Case Management API outputs
output "core_case_mgmt_api_url" {
  description = "The URL of the Core Case Management API"
  value       = module.core_case_mgmt_api.service_url
}

output "core_case_mgmt_service_name" {
  description = "The name of the Core Case Management service"
  value       = module.core_case_mgmt_api.service_name
}

output "core_case_mgmt_service_account_email" {
  description = "The email of the Core Case Management service account"
  value       = module.core_case_mgmt_api.service_account_email
}

# Referral & Intake API outputs
output "referral_intake_api_url" {
  description = "The URL of the Referral & Intake API"
  value       = module.referral_intake_api.service_url
}

output "referral_intake_service_name" {
  description = "The name of the Referral & Intake service"
  value       = module.referral_intake_api.service_name
}

output "referral_intake_service_account_email" {
  description = "The email of the Referral & Intake service account"
  value       = module.referral_intake_api.service_account_email
}

# Pub/Sub outputs
output "referral_events_topic_name" {
  description = "The name of the referral events Pub/Sub topic"
  value       = google_pubsub_topic.referral_events.name
}

output "case_creation_subscription_name" {
  description = "The name of the case creation Pub/Sub subscription"
  value       = google_pubsub_subscription.case_creation.name
}

# Summary outputs
output "api_service_urls" {
  description = "All API service URLs"
  value = {
    core_case_mgmt  = module.core_case_mgmt_api.service_url
    referral_intake = module.referral_intake_api.service_url
  }
}

output "api_service_accounts" {
  description = "All API service account emails"
  value = {
    core_case_mgmt  = module.core_case_mgmt_api.service_account_email
    referral_intake = module.referral_intake_api.service_account_email
  }
}
