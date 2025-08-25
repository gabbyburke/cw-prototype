# Common variables (required by all modules)
variable "project_id" {
  description = "The GCP project ID."
  type        = string
}

variable "region" {
  description = "The GCP region for resources."
  type        = string
}

variable "location" {
  description = "The GCP location for resources."
  type        = string
}

variable "env" {
  description = "The deployment environment (e.g., dev, staging, prod)."
  type        = string
}

variable "project_base_name" {
  description = "The base name for all resources, max 8 characters."
  type        = string
}

variable "unique_id" {
  description = "A 4-character unique identifier for resources."
  type        = string
}

variable "docker_repo_path" {
  description = "Path to the Artifact registry repository where Docker images are stored."
  type        = string
}

# Module-specific variables
variable "vpc_connector_id" {
  description = "The ID of the VPC connector for serverless services."
  type        = string
}

variable "deploy_bucket_name" {
  description = "The name of the deployment bucket for Cloud Functions."
  type        = string
}

variable "ui_service_account_email" {
  description = "The email of the UI service account that needs to invoke these APIs."
  type        = string
  default     = null
}

variable "firestore_database" {
  description = "The Firestore database name."
  type        = string
  default     = "(default)"
}
