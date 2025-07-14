output "deploy_bucket_name" {
  description = "The name of the deployment bucket"
  value       = google_storage_bucket.deploy_bucket.name
}

output "deploy_bucket_url" {
  description = "The URL of the deployment bucket"
  value       = google_storage_bucket.deploy_bucket.url
}

output "firestore_database_id" {
  description = "The ID of the Firestore database"
  value       = google_firestore_database.database.name
}

output "bigquery_dataset_id" {
  description = "The ID of the BigQuery dataset"
  value       = google_bigquery_dataset.dataset.dataset_id
}

output "bigquery_dataset_location" {
  description = "The location of the BigQuery dataset"
  value       = google_bigquery_dataset.dataset.location
}

output "cases_table_id" {
  description = "The ID of the cases BigQuery table"
  value       = google_bigquery_table.cases_table.table_id
}

output "referrals_table_id" {
  description = "The ID of the referrals BigQuery table"
  value       = google_bigquery_table.referrals_table.table_id
}

output "persons_table_id" {
  description = "The ID of the persons BigQuery table"
  value       = google_bigquery_table.persons_table.table_id
}
