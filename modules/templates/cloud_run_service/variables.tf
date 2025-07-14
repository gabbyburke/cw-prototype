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

# Cloud Run service specific variables
variable "specific_resource_name" {
  description = "The specific resource name for the Cloud Run service (e.g., 'core-case-mgmt', 'referral-intake')."
  type        = string
}

variable "cpu" {
  description = "CPU allocation for the Cloud Run service."
  type        = string
  default     = "1"
}

variable "memory" {
  description = "Memory allocation for the Cloud Run service."
  type        = string
  default     = "2Gi"
}

variable "environment_variables" {
  description = "Environment variables for the Cloud Run service."
  type        = map(string)
  default     = {}
}

variable "min_instance_count" {
  description = "Minimum number of instances."
  type        = number
  default     = 0
}

variable "max_instance_count" {
  description = "Maximum number of instances."
  type        = number
  default     = 10
}

variable "timeout" {
  description = "Request timeout in seconds."
  type        = string
  default     = "300s"
}

variable "concurrency" {
  description = "Maximum number of concurrent requests per instance."
  type        = number
  default     = 80
}

variable "ingress" {
  description = "Ingress settings for the service."
  type        = string
  default     = "INGRESS_TRAFFIC_INTERNAL_ONLY"
  
  validation {
    condition = contains([
      "INGRESS_TRAFFIC_ALL",
      "INGRESS_TRAFFIC_INTERNAL_ONLY",
      "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"
    ], var.ingress)
    error_message = "Ingress must be one of: INGRESS_TRAFFIC_ALL, INGRESS_TRAFFIC_INTERNAL_ONLY, INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER."
  }
}

variable "require_authentication" {
  description = "Whether to require IAM authentication."
  type        = bool
  default     = true
}

variable "iap_enabled" {
  description = "Whether to enable Identity-Aware Proxy."
  type        = bool
  default     = false
}

variable "vpc_connector" {
  description = "VPC connector for the service."
  type        = string
  default     = null
}

variable "egress" {
  description = "Egress settings for VPC access."
  type        = string
  default     = "ALL_TRAFFIC"
  
  validation {
    condition = contains([
      "ALL_TRAFFIC",
      "PRIVATE_RANGES_ONLY"
    ], var.egress)
    error_message = "Egress must be one of: ALL_TRAFFIC, PRIVATE_RANGES_ONLY."
  }
}

variable "service_account_roles" {
  description = "List of IAM roles to bind to the service account."
  type        = list(string)
  default = [
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/cloudtrace.agent"
  ]
}

variable "invoker_emails" {
  description = "List of emails that can invoke the Cloud Run service."
  type        = list(string)
  default     = []
}
