# Local values for resource naming
locals {
  deploy_bucket_name = "${var.project_base_name}${var.unique_id}-${var.env}-deploy-bkt"
  bigquery_dataset_id = "${var.project_base_name}${var.unique_id}_${var.env}_ccwis"
  firestore_database_id = "(default)"
}

# Google Cloud Storage bucket for Cloud Function deployments
resource "google_storage_bucket" "deploy_bucket" {
  name     = local.deploy_bucket_name
  location = var.region
  project  = var.project_id
  
  # Enable versioning for deployment artifacts
  versioning {
    enabled = true
  }
  
  # Lifecycle management to clean up old versions
  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }
  
  # Uniform bucket-level access
  uniform_bucket_level_access = true
}

# Firestore database (using default database)
resource "google_firestore_database" "database" {
  project     = var.project_id
  name        = local.firestore_database_id
  location_id = var.region
  type        = "FIRESTORE_NATIVE"
  
  # Enable point-in-time recovery
  point_in_time_recovery_enablement = "POINT_IN_TIME_RECOVERY_ENABLED"
  
  # Enable delete protection
  delete_protection_state = "DELETE_PROTECTION_ENABLED"
}

# BigQuery dataset for analytics and reporting
resource "google_bigquery_dataset" "dataset" {
  dataset_id  = local.bigquery_dataset_id
  project     = var.project_id
  location    = var.location
  
  friendly_name   = "CCWIS Analytics Dataset"
  description     = "Dataset for Child Welfare Information System analytics and reporting"
  
  # Data retention
  default_table_expiration_ms = null # No expiration by default
  
  # Access control
  access {
    role          = "OWNER"
    user_by_email = "serviceAccount:${var.project_id}@appspot.gserviceaccount.com"
  }
  
  labels = {
    environment = var.env
    project     = var.project_base_name
    managed_by  = "terraform"
  }
}

# BigQuery tables for core entities
resource "google_bigquery_table" "cases_table" {
  dataset_id = google_bigquery_dataset.dataset.dataset_id
  table_id   = "cases"
  project    = var.project_id
  
  description = "Cases data from Firestore"
  
  schema = jsonencode([
    {
      name = "case_id"
      type = "STRING"
      mode = "REQUIRED"
      description = "Unique identifier for the case"
    },
    {
      name = "case_number"
      type = "STRING"
      mode = "NULLABLE"
      description = "Human-readable case number"
    },
    {
      name = "status"
      type = "STRING"
      mode = "NULLABLE"
      description = "Current status of the case"
    },
    {
      name = "created_date"
      type = "TIMESTAMP"
      mode = "NULLABLE"
      description = "Date the case was created"
    },
    {
      name = "assigned_worker"
      type = "STRING"
      mode = "NULLABLE"
      description = "Email of the assigned caseworker"
    },
    {
      name = "priority_level"
      type = "STRING"
      mode = "NULLABLE"
      description = "Priority level of the case"
    },
    {
      name = "last_updated"
      type = "TIMESTAMP"
      mode = "NULLABLE"
      description = "Last update timestamp"
    }
  ])
  
  labels = {
    environment = var.env
    project     = var.project_base_name
    managed_by  = "terraform"
  }
}

resource "google_bigquery_table" "referrals_table" {
  dataset_id = google_bigquery_dataset.dataset.dataset_id
  table_id   = "referrals"
  project    = var.project_id
  
  description = "Referrals data from Firestore"
  
  schema = jsonencode([
    {
      name = "referral_id"
      type = "STRING"
      mode = "REQUIRED"
      description = "Unique identifier for the referral"
    },
    {
      name = "referral_date"
      type = "TIMESTAMP"
      mode = "NULLABLE"
      description = "Date the referral was received"
    },
    {
      name = "referral_source"
      type = "STRING"
      mode = "NULLABLE"
      description = "Source of the referral"
    },
    {
      name = "allegation_type"
      type = "STRING"
      mode = "NULLABLE"
      description = "Type of alleged maltreatment"
    },
    {
      name = "screening_decision"
      type = "STRING"
      mode = "NULLABLE"
      description = "Decision from initial screening"
    },
    {
      name = "assigned_worker"
      type = "STRING"
      mode = "NULLABLE"
      description = "Email of the assigned worker"
    },
    {
      name = "case_id"
      type = "STRING"
      mode = "NULLABLE"
      description = "Associated case ID if promoted to case"
    }
  ])
  
  labels = {
    environment = var.env
    project     = var.project_base_name
    managed_by  = "terraform"
  }
}

resource "google_bigquery_table" "persons_table" {
  dataset_id = google_bigquery_dataset.dataset.dataset_id
  table_id   = "persons"
  project    = var.project_id
  
  description = "Persons data from Firestore"
  
  schema = jsonencode([
    {
      name = "person_id"
      type = "STRING"
      mode = "REQUIRED"
      description = "Unique identifier for the person"
    },
    {
      name = "first_name"
      type = "STRING"
      mode = "NULLABLE"
      description = "First name"
    },
    {
      name = "last_name"
      type = "STRING"
      mode = "NULLABLE"
      description = "Last name"
    },
    {
      name = "date_of_birth"
      type = "DATE"
      mode = "NULLABLE"
      description = "Date of birth"
    },
    {
      name = "role"
      type = "STRING"
      mode = "NULLABLE"
      description = "Role in the case (child, parent, caregiver, etc.)"
    },
    {
      name = "case_id"
      type = "STRING"
      mode = "NULLABLE"
      description = "Associated case ID"
    }
  ])
  
  labels = {
    environment = var.env
    project     = var.project_base_name
    managed_by  = "terraform"
  }
}
