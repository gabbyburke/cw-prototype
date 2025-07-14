output "ui_url" {
  description = "The URL of the web UI"
  value       = module.ui_service.service_url
}

output "ui_service_name" {
  description = "The name of the UI Cloud Run service"
  value       = module.ui_service.service_name
}

output "ui_service_account_email" {
  description = "The email of the UI service account"
  value       = module.ui_service.service_account_email
}

output "ui_docker_image_url" {
  description = "The Docker image URL used by the UI service"
  value       = module.ui_service.docker_image_url
}
