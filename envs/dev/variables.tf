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
  description = "Path to the Artifact registry repository where Docker images are stored, in the form {REGION}-docker.pkg.dev/{PROJECT_ID}/{DOCKER_REPO_NAME}."
  type        = string
}
