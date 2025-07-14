output "service_name" {
  description = "The name of the Cloud Run service"
  value       = google_cloud_run_v2_service.service.name
}

output "service_url" {
  description = "The URL of the Cloud Run service"
  value       = google_cloud_run_v2_service.service.uri
}

output "service_account_email" {
  description = "The email of the service account"
  value       = google_service_account.service_account.email
}

output "service_account_name" {
  description = "The name of the service account"
  value       = google_service_account.service_account.name
}

output "docker_image_url" {
  description = "The Docker image URL used by the service"
  value       = local.docker_image_url
}

output "service_id" {
  description = "The full resource ID of the Cloud Run service"
  value       = google_cloud_run_v2_service.service.id
}
