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

variable "core_case_mgmt_api_url" {
  description = "The URL of the Core Case Management API."
  type        = string
}

variable "referral_intake_api_url" {
  description = "The URL of the Referral & Intake API."
  type        = string
}

variable "core_case_mgmt_service_name" {
  description = "The name of the Core Case Management service (for IAM permissions)."
  type        = string
  default     = null
}

variable "referral_intake_service_name" {
  description = "The name of the Referral & Intake service (for IAM permissions)."
  type        = string
  default     = null
}
