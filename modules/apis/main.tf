# Core Case Management API
module "core_case_mgmt_api" {
  source = "../templates/cloud_run_service"
  
  # Common variables
  project_id        = var.project_id
  region           = var.region
  location         = var.location
  env              = var.env
  project_base_name = var.project_base_name
  unique_id        = var.unique_id
  docker_repo_path = var.docker_repo_path
  
  # Service-specific configuration
  specific_resource_name = "core-case-mgmt"
  
  # Resource allocation
  cpu    = "1"
  memory = "2Gi"
  
  # Scaling configuration
  min_instance_count = 0
  max_instance_count = 10
  
  # Network configuration
  ingress = "INGRESS_TRAFFIC_INTERNAL_ONLY"
  require_authentication = true
  iap_enabled = false
  vpc_connector = var.vpc_connector_id
  egress = "ALL_TRAFFIC"
  
  # Environment variables
  environment_variables = {
    ENV = var.env
    PROJECT_ID = var.project_id
    FIRESTORE_DATABASE = var.firestore_database
    BIGQUERY_DATASET = "cw_case_notes"
  }
  
  # Service account roles
  service_account_roles = [
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/cloudtrace.agent",
    "roles/datastore.user",
    "roles/bigquery.dataEditor"
  ]
  
  # Allow UI service account to invoke this API
  invoker_emails = var.ui_service_account_email != null ? [
    "serviceAccount:${var.ui_service_account_email}"
  ] : []
}

# Referral & Intake API
module "referral_intake_api" {
  source = "../templates/cloud_run_service"
  
  # Common variables
  project_id        = var.project_id
  region           = var.region
  location         = var.location
  env              = var.env
  project_base_name = var.project_base_name
  unique_id        = var.unique_id
  docker_repo_path = var.docker_repo_path
  
  # Service-specific configuration
  specific_resource_name = "referral-intake"
  
  # Resource allocation
  cpu    = "1"
  memory = "2Gi"
  
  # Scaling configuration
  min_instance_count = 0
  max_instance_count = 10
  
  # Network configuration
  ingress = "INGRESS_TRAFFIC_INTERNAL_ONLY"
  require_authentication = true
  iap_enabled = false
  vpc_connector = var.vpc_connector_id
  egress = "ALL_TRAFFIC"
  
  # Environment variables
  environment_variables = {
    ENV = var.env
    PROJECT_ID = var.project_id
    FIRESTORE_DATABASE = var.firestore_database
    CORE_CASE_MGMT_API_URL = module.core_case_mgmt_api.service_url
  }
  
  # Service account roles
  service_account_roles = [
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/cloudtrace.agent",
    "roles/datastore.user",
    "roles/pubsub.publisher"
  ]
  
  # Allow UI service account to invoke this API
  invoker_emails = var.ui_service_account_email != null ? [
    "serviceAccount:${var.ui_service_account_email}"
  ] : []
}

# Pub/Sub topic for referral events
resource "google_pubsub_topic" "referral_events" {
  name    = "${var.project_base_name}${var.unique_id}-${var.env}-referral-events-topic"
  project = var.project_id
  
  labels = {
    environment = var.env
    project     = var.project_base_name
    managed_by  = "terraform"
  }
}

# Pub/Sub subscription for case creation
resource "google_pubsub_subscription" "case_creation" {
  name    = "${var.project_base_name}${var.unique_id}-${var.env}-case-creation-subscription"
  topic   = google_pubsub_topic.referral_events.name
  project = var.project_id
  
  # Message retention
  message_retention_duration = "604800s" # 7 days
  
  # Acknowledgment deadline
  ack_deadline_seconds = 300
  
  # Retry policy
  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }
  
  labels = {
    environment = var.env
    project     = var.project_base_name
    managed_by  = "terraform"
  }
}

# Grant publish permissions to referral intake API
resource "google_pubsub_topic_iam_member" "referral_intake_publisher" {
  topic   = google_pubsub_topic.referral_events.name
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${module.referral_intake_api.service_account_email}"
  project = var.project_id
}

# Grant subscribe permissions to core case management API
resource "google_pubsub_subscription_iam_member" "core_case_mgmt_subscriber" {
  subscription = google_pubsub_subscription.case_creation.name
  role         = "roles/pubsub.subscriber"
  member       = "serviceAccount:${module.core_case_mgmt_api.service_account_email}"
  project      = var.project_id
}
