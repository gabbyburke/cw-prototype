#!/usr/bin/env bash
set -euo pipefail

# Configuration
DEPLOYMENT_PROJECT_ID="${1:-terraform-dev-66677}"
SERVICE_ACCOUNT_NAME="terraform-deployer"
TARGET_PROJECT_ID="${2:-}"  # Optional: create new or use existing

LOGGED_GOOGLE_IMPERSONATE_SERVICE_ACCOUNT=`gcloud config list --format='value(core.account)'`

gcloud projects add-iam-policy-binding [PROJECT_ID] \
    --member="user:${LOGGED_GOOGLE_IMPERSONATE_SERVICE_ACCOUNT}" \
    --role="roles/iam.serviceAccountAdmin"

# Enable APIs in deployment project
gcloud services enable \
    compute.googleapis.com \
    cloudresourcemanager.googleapis.com \
    cloudbilling.googleapis.com \
    serviceusage.googleapis.com \
    iam.googleapis.com \
    storage.googleapis.com \
    --project=${DEPLOYMENT_PROJECT_ID}

# Create/configure service account
#SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${DEPLOYMENT_PROJECT_ID}.iam.gserviceaccount.com"

# If creating new projects, grant org-level permissions
if [ -n "${ORG_ID:-}" ]; then
    gcloud organizations add-iam-policy-binding ${ORG_ID} \
        --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
        --role="roles/resourcemanager.projectCreator"
fi

gcs_bucket="tf-state-${GOOGLE_CLOUD_PROJECT}"
if gcloud storage buckets list | grep -q "gs://${gcs_bucket}/"; then
    echo "GCS bucket ${gcs_bucket} already exists."
else
    gcloud storage buckets create "gs://${gcs_bucket}"
fi

cat > ./config/backend.hcl <<EOF
bucket = "${gcs_bucket}"
prefix = "terraform/state"
EOF

cat > ./config/dev.tfvars <<EOF
# Development environment variables

deployment_project_id = "${DEPLOYMENT_PROJECT_ID}"
project_id = "${TARGET_PROJECT_ID}"
service_account_name="${SERVICE_ACCOUNT_NAME}"
environment = "dev"

# Optional variables
add_random_suffix = false
alert_email_address_list = ["thomazsilva+ccwisnotification@google.com"]

EOF

# Export for Terraform
export GOOGLE_IMPERSONATE_SERVICE_ACCOUNT=${SERVICE_ACCOUNT_EMAIL}
