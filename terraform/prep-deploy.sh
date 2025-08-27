#!/usr/bin/env bash

set -euo pipefail

export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/terraform-dev-66677-0b607c2c8c57.json"
SERVICE_ACCOUNT_NAME="terragrunt-deploy-sa"
BACKEND_PROJECT_ID="terraform-dev-66677"

#gcloud projects create ${BACKEND_PROJECT_ID}
gcloud config set project ${BACKEND_PROJECT_ID}

SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${BACKEND_PROJECT_ID}.iam.gserviceaccount.com"

gcloud services enable \
    cloudbuild.googleapis.com \
    cloudresourcemanager.googleapis.com \
    cloudscheduler.googleapis.com \
    firebase.googleapis.com \
    iam.googleapis.com \
    identitytoolkit.googleapis.com \
    orgpolicy.googleapis.com \
    storage.googleapis.com \
    run.googleapis.com \
    cloudbilling.googleapis.com \
    --project=${BACKEND_PROJECT_ID}

gcloud projects add-iam-policy-binding "${BACKEND_PROJECT_ID}" \
 --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
 --role="roles/editor"

gcloud projects add-iam-policy-binding "${BACKEND_PROJECT_ID}" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding "${BACKEND_PROJECT_ID}" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/firebase.admin"

# terragrunt init -upgrade

