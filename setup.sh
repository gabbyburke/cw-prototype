#!/bin/bash

# Child Welfare Information System (CCWIS) Setup Script
# This script prepares the local environment and GCP for the first Cloud Build run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Child Welfare Information System (CCWIS) Setup ===${NC}"
echo ""

# Function to prompt for input with default value
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " input
        if [ -z "$input" ]; then
            input="$default"
        fi
    else
        read -p "$prompt: " input
        while [ -z "$input" ]; do
            echo -e "${RED}This field is required.${NC}"
            read -p "$prompt: " input
        done
    fi
    
    eval "$var_name='$input'"
}

# Function to generate unique ID
generate_unique_id() {
    echo $(openssl rand -hex 2)
}

# Load existing configuration if it exists
CONFIG_FILE=".setup_config"
if [ -f "$CONFIG_FILE" ]; then
    echo -e "${GREEN}Loading existing configuration...${NC}"
    source "$CONFIG_FILE"
else
    echo -e "${YELLOW}No existing configuration found. Creating new setup...${NC}"
fi

echo ""
echo -e "${BLUE}Please provide the following configuration:${NC}"
echo ""

# Prompt for required inputs
prompt_with_default "GCP Project ID" "${_PROJECT_ID:-}" "_PROJECT_ID"
prompt_with_default "GCP Region (e.g., us-central1)" "${_REGION:-us-central1}" "_REGION"
prompt_with_default "GCP Location (e.g., us)" "${_LOCATION:-us}" "_LOCATION"
prompt_with_default "Environment (DEV, STG, PRD - max 3 chars)" "${_ENV:-DEV}" "_ENV"
prompt_with_default "Project base name (max 8 chars)" "${_PROJECT_BASE_NAME:-ccwis}" "_PROJECT_BASE_NAME"
prompt_with_default "Docker images to build (ui,core-case-mgmt,referral-intake or 'all' or 'none')" "${_BUILD_IMAGES:-all}" "_BUILD_IMAGES"
prompt_with_default "Enable GCP APIs (Y/N)" "${_ENABLE_GCP_APIS:-Y}" "_ENABLE_GCP_APIS"
prompt_with_default "Apply roles to custom Cloud Build service account (Y/N)" "${_APPLY_CUSTOM_CB_SA_ROLES:-Y}" "_APPLY_CUSTOM_CB_SA_ROLES"
prompt_with_default "Apply roles to default Compute Engine service account (Y/N)" "${_APPLY_DEFAULT_CE_SA_ROLES:-Y}" "_APPLY_DEFAULT_CE_SA_ROLES"

# Generate unique ID if not exists
if [ -z "${_UNIQUE_ID:-}" ]; then
    _UNIQUE_ID=$(generate_unique_id)
    echo -e "${GREEN}Generated unique ID: $_UNIQUE_ID${NC}"
fi

# Save configuration
echo "# CCWIS Configuration - Generated $(date)" > "$CONFIG_FILE"
echo "_PROJECT_ID=$_PROJECT_ID" >> "$CONFIG_FILE"
echo "_REGION=$_REGION" >> "$CONFIG_FILE"
echo "_LOCATION=$_LOCATION" >> "$CONFIG_FILE"
echo "_ENV=$_ENV" >> "$CONFIG_FILE"
echo "_PROJECT_BASE_NAME=$_PROJECT_BASE_NAME" >> "$CONFIG_FILE"
echo "_BUILD_IMAGES=$_BUILD_IMAGES" >> "$CONFIG_FILE"
echo "_ENABLE_GCP_APIS=$_ENABLE_GCP_APIS" >> "$CONFIG_FILE"
echo "_APPLY_CUSTOM_CB_SA_ROLES=$_APPLY_CUSTOM_CB_SA_ROLES" >> "$CONFIG_FILE"
echo "_APPLY_DEFAULT_CE_SA_ROLES=$_APPLY_DEFAULT_CE_SA_ROLES" >> "$CONFIG_FILE"
echo "_UNIQUE_ID=$_UNIQUE_ID" >> "$CONFIG_FILE"

echo ""
echo -e "${GREEN}Configuration saved to $CONFIG_FILE${NC}"

# Enable GCP APIs if requested
if [ "$_ENABLE_GCP_APIS" = "Y" ]; then
    echo ""
    echo -e "${BLUE}Enabling GCP APIs...${NC}"
    
    apis=(
        "iam.googleapis.com"
        "cloudresourcemanager.googleapis.com"
        "artifactregistry.googleapis.com"
        "cloudbuild.googleapis.com"
        "iap.googleapis.com"
        "run.googleapis.com"
        "eventarc.googleapis.com"
        "pubsub.googleapis.com"
        "cloudfunctions.googleapis.com"
        "secretmanager.googleapis.com"
        "bigquery.googleapis.com"
        "workflows.googleapis.com"
    )
    
    for api in "${apis[@]}"; do
        echo "Enabling $api..."
        gcloud services enable "$api" --project="$_PROJECT_ID"
    done
    
    echo -e "${GREEN}APIs enabled successfully.${NC}"
fi

# Create Terraform State GCS Bucket
_TF_STATE_BUCKET_NAME="${_PROJECT_BASE_NAME}${_UNIQUE_ID}-tf-state-bkt"
echo ""
echo -e "${BLUE}Creating Terraform state bucket: $_TF_STATE_BUCKET_NAME${NC}"

if gsutil ls -b "gs://$_TF_STATE_BUCKET_NAME" 2>/dev/null; then
    echo -e "${YELLOW}Bucket $_TF_STATE_BUCKET_NAME already exists.${NC}"
else
    gsutil mb -p "$_PROJECT_ID" -c STANDARD -l "$_REGION" "gs://$_TF_STATE_BUCKET_NAME"
    gsutil versioning set on "gs://$_TF_STATE_BUCKET_NAME"
    echo -e "${GREEN}Bucket $_TF_STATE_BUCKET_NAME created successfully.${NC}"
    
    # Update backend.tf file
    sed -i.bak "s/UPDATE_ME_BY_SETUP_SCRIPT/$_TF_STATE_BUCKET_NAME/g" "envs/$_ENV/backend.tf"
    echo -e "${GREEN}Updated backend.tf with bucket name.${NC}"
fi

# Create Artifact Registry Repository
_DOCKER_REPO_NAME="${_PROJECT_BASE_NAME}${_UNIQUE_ID}-docker-repo"
_DOCKER_REPO_PATH="${_REGION}-docker.pkg.dev/${_PROJECT_ID}/${_DOCKER_REPO_NAME}"
echo ""
echo -e "${BLUE}Creating Artifact Registry repository: $_DOCKER_REPO_NAME${NC}"

if gcloud artifacts repositories describe "$_DOCKER_REPO_NAME" --location="$_REGION" --project="$_PROJECT_ID" 2>/dev/null; then
    echo -e "${YELLOW}Repository $_DOCKER_REPO_NAME already exists.${NC}"
else
    gcloud artifacts repositories create "$_DOCKER_REPO_NAME" \
        --repository-format=docker \
        --location="$_REGION" \
        --project="$_PROJECT_ID"
    echo -e "${GREEN}Repository $_DOCKER_REPO_NAME created successfully.${NC}"
fi

# Create custom Cloud Build service account
_CLOUD_BUILD_SA_NAME="${_PROJECT_BASE_NAME}${_UNIQUE_ID}-cloudbuild-sa"
_CLOUD_BUILD_SA_EMAIL="${_CLOUD_BUILD_SA_NAME}@${_PROJECT_ID}.iam.gserviceaccount.com"
echo ""
echo -e "${BLUE}Creating Cloud Build service account: $_CLOUD_BUILD_SA_NAME${NC}"

if gcloud iam service-accounts describe "$_CLOUD_BUILD_SA_EMAIL" --project="$_PROJECT_ID" 2>/dev/null; then
    echo -e "${YELLOW}Service account $_CLOUD_BUILD_SA_NAME already exists.${NC}"
    SA_CREATED=false
else
    gcloud iam service-accounts create "$_CLOUD_BUILD_SA_NAME" \
        --display-name="CCWIS Cloud Build Service Account" \
        --project="$_PROJECT_ID"
    echo -e "${GREEN}Service account $_CLOUD_BUILD_SA_NAME created successfully.${NC}"
    SA_CREATED=true
fi

# Apply roles to custom Cloud Build service account
if [ "$SA_CREATED" = true ] || [ "$_APPLY_CUSTOM_CB_SA_ROLES" = "Y" ]; then
    echo ""
    echo -e "${BLUE}Applying roles to Cloud Build service account...${NC}"
    
    roles=(
        "roles/serviceusage.serviceUsageAdmin"
        "roles/artifactregistry.admin"
        "roles/storage.admin"
        "roles/run.admin"
        "roles/workflows.admin"
        "roles/eventarc.admin"
        "roles/iam.serviceAccountAdmin"
        "roles/resourcemanager.projectIamAdmin"
        "roles/logging.logWriter"
        "roles/iam.serviceAccountUser"
        "roles/cloudbuild.builds.builder"
        "roles/secretmanager.secretAccessor"
        "roles/bigquery.admin"
        "roles/cloudfunctions.admin"
    )
    
    for role in "${roles[@]}"; do
        echo "Binding role $role..."
        gcloud projects add-iam-policy-binding "$_PROJECT_ID" \
            --member="serviceAccount:${_CLOUD_BUILD_SA_EMAIL}" \
            --role="$role" \
            --condition=None
    done
    
    echo -e "${GREEN}Roles applied successfully.${NC}"
fi

# Apply roles to default Compute Engine service account
if [ "$_APPLY_DEFAULT_CE_SA_ROLES" = "Y" ]; then
    echo ""
    echo -e "${BLUE}Applying roles to default Compute Engine service account...${NC}"
    
    # Get project number
    PROJECT_NUMBER=$(gcloud projects describe "$_PROJECT_ID" --format="value(projectNumber)")
    DEFAULT_CE_SA_EMAIL="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
    
    ce_roles=(
        "roles/logging.admin"
        "roles/artifactregistry.admin"
        "roles/storage.admin"
    )
    
    for role in "${ce_roles[@]}"; do
        echo "Binding role $role to default CE service account..."
        gcloud projects add-iam-policy-binding "$_PROJECT_ID" \
            --member="serviceAccount:${DEFAULT_CE_SA_EMAIL}" \
            --role="$role" \
            --condition=None
    done
    
    echo -e "${GREEN}Roles applied to default CE service account successfully.${NC}"
fi

# Create substitutions variable
_SUBSTITUTIONS="_PROJECT_ID=${_PROJECT_ID},_REGION=${_REGION},_LOCATION=${_LOCATION},_ENV=${_ENV},_PROJECT_BASE_NAME=${_PROJECT_BASE_NAME},_UNIQUE_ID=${_UNIQUE_ID},_DOCKER_REPO_PATH=${_DOCKER_REPO_PATH},_BUILD_IMAGES=${_BUILD_IMAGES}"

# Export all variables
export _PROJECT_ID
export _REGION
export _LOCATION
export _ENV
export _PROJECT_BASE_NAME
export _UNIQUE_ID
export _DOCKER_REPO_PATH
export _BUILD_IMAGES
export _SUBSTITUTIONS
export _TF_STATE_BUCKET_NAME
export _DOCKER_REPO_NAME
export _CLOUD_BUILD_SA_NAME

# Update configuration file with computed values
echo "_TF_STATE_BUCKET_NAME=$_TF_STATE_BUCKET_NAME" >> "$CONFIG_FILE"
echo "_DOCKER_REPO_NAME=$_DOCKER_REPO_NAME" >> "$CONFIG_FILE"
echo "_DOCKER_REPO_PATH=$_DOCKER_REPO_PATH" >> "$CONFIG_FILE"
echo "_CLOUD_BUILD_SA_NAME=$_CLOUD_BUILD_SA_NAME" >> "$CONFIG_FILE"
echo "_SUBSTITUTIONS=$_SUBSTITUTIONS" >> "$CONFIG_FILE"

echo ""
echo -e "${GREEN}=== Setup Complete ===${NC}"
echo ""
echo -e "${BLUE}Configuration Summary:${NC}"
echo "Project ID: $_PROJECT_ID"
echo "Region: $_REGION"
echo "Location: $_LOCATION"
echo "Environment: $_ENV"
echo "Project Base Name: $_PROJECT_BASE_NAME"
echo "Unique ID: $_UNIQUE_ID"
echo "Build Images: $_BUILD_IMAGES"
echo "TF State Bucket: $_TF_STATE_BUCKET_NAME"
echo "Docker Repo: $_DOCKER_REPO_NAME"
echo "Cloud Build SA: $_CLOUD_BUILD_SA_NAME"
echo ""
echo -e "${BLUE}To deploy the infrastructure, run:${NC}"
echo "gcloud builds submit --config ./cloudbuild.yaml --project=\"\${_PROJECT_ID}\" --region=\"\${_REGION}\" --substitutions=\"\${_SUBSTITUTIONS}\""
echo ""
echo -e "${BLUE}With variables expanded:${NC}"
echo "gcloud builds submit --config ./cloudbuild.yaml --project=\"$_PROJECT_ID\" --region=\"$_REGION\" --substitutions=\"$_SUBSTITUTIONS\""
