#!/usr/bin/env bash
set -euo pipefail

# Configuration
DEPLOYMENT_PROJECT_ID="${1:-terraform-dev-66677}"
SERVICE_ACCOUNT_NAME="terraform-deployer"
TARGET_PROJECT_ID="${2:-}"  # Optional: create new or use existing

# Enable APIs in deployment project
gcloud services enable \
    cloudresourcemanager.googleapis.com \
    cloudbilling.googleapis.com \
    serviceusage.googleapis.com \
    iam.googleapis.com \
    storage.googleapis.com \
    --project=${DEPLOYMENT_PROJECT_ID}

# Create/configure service account
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${DEPLOYMENT_PROJECT_ID}.iam.gserviceaccount.com"

# If creating new projects, grant org-level permissions
if [ -n "${ORG_ID:-}" ]; then
    gcloud organizations add-iam-policy-binding ${ORG_ID} \
        --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
        --role="roles/resourcemanager.projectCreator"
fi

# Export for Terraform
export GOOGLE_IMPERSONATE_SERVICE_ACCOUNT=${SERVICE_ACCOUNT_EMAIL}
