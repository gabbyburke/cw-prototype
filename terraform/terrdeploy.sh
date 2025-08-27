#!/bin/bash

set -e

# Set up a service account that will be used to deploy Terraform
echo "This script will create a service account that can be used to deploy Terraform."
echo "Make sure that you have selected the correct project via the 'gcloud config set project PROJECT_NAME' command."
echo "Be sure to run this command in the folder that contains Terraform scripts."
echo "Hit Ctrl-C if you do NOT want to continue."
echo

# Prompt for confirmation to continue
#read -p "Hit any key to continue: " -n 1 -s

# Set the name for the SA to be created
SERVICE_ACCOUNT_NAME="terraform-deployer"
LOCATION="US"
# BUCKET_NAME="facultytwin_terraform_bucket_77766"

# Enable basic Required APIs
gcloud services enable "cloudbuild.googleapis.com"
gcloud services enable "run.googleapis.com"
gcloud services enable "artifactregistry.googleapis.com"
gcloud services enable "logging.googleapis.com"
gcloud services enable "iam.googleapis.com"
gcloud services enable "storage.googleapis.com"
gcloud services enable "aiplatform.googleapis.com"
gcloud services enable "cloudresourcemanager.googleapis.com"


# Get the current project ID and number
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
CURRENT_USER_EMAIL=$(gcloud config get-value account)
echo "PROJECT_ID: " ${PROJECT_ID}
echo "PROJECT_NUMBER: " ${PROJECT_NUMBER}
echo "CURRENT_USER_EMAIL: " ${CURRENT_USER_EMAIL}

# # create the service account
# gcloud iam service-accounts create "$SERVICE_ACCOUNT_NAME" \
#   --display-name="Used for Terraform deployment" \
#   --project="$PROJECT_ID"

SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"
export SERVICE_ACCOUNT_EMAIL=${SERVICE_ACCOUNT_EMAIL}

COMPUTE_SERVICE_ACCOUNT_EMAIL="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
echo "COMPUTE_SERVICE_ACCOUNT_EMAIL: " ${COMPUTE_SERVICE_ACCOUNT_EMAIL}

# Check if the service account exists
if ! gcloud iam service-accounts describe "$SERVICE_ACCOUNT_EMAIL" --project="$PROJECT_ID" > /dev/null 2>&1; then
  echo "Service account $SERVICE_ACCOUNT_EMAIL does not exist. Creating..."
  # create the service account
  gcloud iam service-accounts create "$SERVICE_ACCOUNT_NAME" \
    --display-name="Used for Terraform deployment" \
    --project="$PROJECT_ID"
else
  echo "Service account $SERVICE_ACCOUNT_EMAIL already exists. Skipping creation."
fi

# Specific permissions for cloud build
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/cloudbuild.builds.editor"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
 --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
 --role="roles/editor"

#  # Grant the service account permission to get access tokens
# gcloud projects add-iam-policy-binding "$PROJECT_ID" \
#   --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
#   --role="roles/iam.serviceAccountTokenCreator"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
 --member="serviceAccount:$COMPUTE_SERVICE_ACCOUNT_EMAIL" \
 --role="roles/editor"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
 --member="serviceAccount:$COMPUTE_SERVICE_ACCOUNT_EMAIL" \
 --role="roles/iam.serviceAccountTokenCreator"

# Grant permission to impersonate the service account for your user and the cloudshell compute default for the project
CURRENT_USER_EMAIL=$(gcloud config get-value account)
if [ -z "$CURRENT_USER_EMAIL" ]; then
  echo "Error: CURRENT_USER_EMAIL is empty. Please configure your gcloud credentials."
  echo "Run 'gcloud auth login' to set up your credentials."
  exit 1
fi
echo "CURRENT_USER_EMAIL: [${CURRENT_USER_EMAIL}]"

# echo "Granting permission to impersonate the service account to [$CURRENT_USER_EMAIL] and [${COMPUTE_SERVICE_ACCOUNT_EMAIL}]"
# gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT_EMAIL} \
#   --member="user:${CURRENT_USER_EMAIL}" \
#   --role="roles/iam.serviceAccountTokenCreator"
# gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT_EMAIL} \
#   --member="user:${CURRENT_USER_EMAIL}" \
#   --role="roles/iam.serviceAccountUser"
gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT_EMAIL} \
  --member="serviceAccount:${COMPUTE_SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

# Grant the compute service account permission to read and write to the bucket
STAGING_BUCKET="${PROJECT_ID}-twin-professor-dev"
# LOG_BUCKET="${STAGING_BUCKET}/cloudbuild-logs"

# echo "Checking if bucket gs://${STAGING_BUCKET} exists..."
# if ! gcloud storage buckets describe "gs://${STAGING_BUCKET}" > /dev/null 2>&1; then
#   echo "Bucket gs://${STAGING_BUCKET} does not exist. Creating..."
#   gcloud storage buckets create "gs://${STAGING_BUCKET}" --location=${LOCATION}
# else  
#   echo "Bucket gs://${STAGING_BUCKET} already exists. Skipping creation."
# fi

# echo "Granting storage permission to ${COMPUTE_SERVICE_ACCOUNT_EMAIL} for buckets ${STAGING_BUCKET}"
# gcloud storage buckets add-iam-policy-binding gs://${STAGING_BUCKET} \
#   --member="serviceAccount:${COMPUTE_SERVICE_ACCOUNT_EMAIL}" \
#   --role="roles/storage.objectAdmin"
# gcloud storage buckets add-iam-policy-binding gs://${STAGING_BUCKET} \
#   --member="serviceAccount:${COMPUTE_SERVICE_ACCOUNT_EMAIL}" \
#   --role="roles/storage.objectAdmin"
# echo "Granting storage permission to $COMPUTE_SERVICE_ACCOUNT_EMAIL for buckets $LOG_BUCKET"
# gcloud storage buckets add-iam-policy-binding gs://$LOG_BUCKET \
#   --member="serviceAccount:$COMPUTE_SERVICE_ACCOUNT_EMAIL" \
#   --role="roles/storage.objectAdmin"

# Export the service account to an env variable
export GOOGLE_IMPERSONATE_SERVICE_ACCOUNT=${SERVICE_ACCOUNT_EMAIL}
echo "Impersonating the service account: [${GOOGLE_IMPERSONATE_SERVICE_ACCOUNT}]"

#echo "Review that the current user was granted permission to roles/serviceAccountUser role"
#gcloud iam service-accounts get-iam-policy terraform-deployer@${PROJECT_ID}.iam.gserviceaccount.com

echo "Permissions granted. You can now use the service account $SERVICE_ACCOUNT_EMAIL for Terraform deployments."

# Configure docker
sudo apt-get install -y google-cloud-cli-docker-credential-gcr
# gcloud components install docker-credential-gcr # this was failing and the above command was 
gcloud auth configure-docker us-central1-docker.pkg.dev
docker-credential-gcr configure-docker us-central1-docker.pkg.dev
gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://us-central1-docker.pkg.dev

# read -p "Terraform users configured, press any key to continue: " -n 1 -s

# terraform init
# terraform validate
# terraform plan -var-file=conf/dev.tfvars
# terraform apply -var-file=conf/dev.tfvars -auto-approve
