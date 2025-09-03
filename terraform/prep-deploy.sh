#!/usr/bin/env bash
set -euo pipefail

if [ -z "${GOOGLE_CLOUD_PROJECT}" ]; then
    echo "ERROR: The GOOGLE_CLOUD_PROJECT environment variable is not set."
    echo "Please set it to your Google Cloud project ID and re-run this script."
    exit 1
fi

#gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} \
#    --member="user:${LOGGED_GOOGLE_IMPERSONATE_SERVICE_ACCOUNT}" \
#    --role="roles/iam.serviceAccountAdmin"

# Enable APIs in deployment project
gcloud services enable \
    compute.googleapis.com \
    cloudresourcemanager.googleapis.com \
    cloudbilling.googleapis.com \
    serviceusage.googleapis.com \
    iam.googleapis.com \
    storage.googleapis.com \
    --project=${GOOGLE_CLOUD_PROJECT}

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

project_id = "${GOOGLE_CLOUD_PROJECT}"
environment = "dev"

# Optional variables
add_random_suffix = false
alert_email_address_list = ["thomazsilva+ccwisnotification@google.com"]

EOF

# Export for Terraform
#export GOOGLE_IMPERSONATE_SERVICE_ACCOUNT=${SERVICE_ACCOUNT_EMAIL}
