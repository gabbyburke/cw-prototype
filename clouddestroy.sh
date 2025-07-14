#!/bin/bash

# Child Welfare Information System (CCWIS) Cleanup Script
# This script destroys all resources created by the setup scripts, Cloud Build, and Terraform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${RED}=== Child Welfare Information System (CCWIS) Cleanup ===${NC}"
echo ""

# Load configuration
CONFIG_FILE=".setup_config"
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Configuration file $CONFIG_FILE not found.${NC}"
    echo "Please run setup.sh first or ensure you're in the correct directory."
    exit 1
fi

echo -e "${BLUE}Loading configuration from $CONFIG_FILE...${NC}"
source "$CONFIG_FILE"

echo ""
echo -e "${YELLOW}This will destroy ALL resources created for this project:${NC}"
echo "- Project: $_PROJECT_ID"
echo "- Environment: $_ENV"
echo "- Terraform state bucket: $_TF_STATE_BUCKET_NAME"
echo "- Docker repository: $_DOCKER_REPO_NAME"
echo "- Cloud Build service account: $_CLOUD_BUILD_SA_NAME"
echo "- All Terraform-managed resources"
echo ""

# First confirmation
echo -e "${RED}WARNING: This action cannot be undone!${NC}"
read -p "Are you sure you want to destroy all resources? Type 'Y' to confirm: " confirm1
if [ "$confirm1" != "Y" ]; then
    echo "Cleanup cancelled."
    exit 0
fi

# Second confirmation
echo ""
echo -e "${RED}FINAL WARNING: All data will be permanently lost!${NC}"
read -p "Type 'Y' again to confirm destruction: " confirm2
if [ "$confirm2" != "Y" ]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo ""
echo -e "${BLUE}Starting cleanup process...${NC}"

# Function to safely run commands and continue on error
safe_run() {
    local cmd="$1"
    local description="$2"
    
    echo -e "${BLUE}$description...${NC}"
    if eval "$cmd"; then
        echo -e "${GREEN}✓ $description completed${NC}"
    else
        echo -e "${YELLOW}⚠ $description failed (continuing...)${NC}"
    fi
}

# Destroy Terraform resources first
if [ -d "envs/$_ENV" ]; then
    echo ""
    echo -e "${BLUE}Destroying Terraform resources...${NC}"
    cd "envs/$_ENV"
    
    # Initialize Terraform if needed
    safe_run "terraform init" "Initializing Terraform"
    
    # Destroy all resources
    safe_run "terraform destroy -auto-approve \
        -var=project_id=$_PROJECT_ID \
        -var=region=$_REGION \
        -var=location=$_LOCATION \
        -var=env=$_ENV \
        -var=project_base_name=$_PROJECT_BASE_NAME \
        -var=unique_id=$_UNIQUE_ID \
        -var=docker_repo_path=$_DOCKER_REPO_PATH" "Destroying Terraform resources"
    
    cd ../..
else
    echo -e "${YELLOW}Terraform environment directory not found, skipping...${NC}"
fi

# Remove IAM policy bindings for custom Cloud Build service account
if [ -n "$_CLOUD_BUILD_SA_NAME" ]; then
    echo ""
    echo -e "${BLUE}Removing IAM policy bindings for Cloud Build service account...${NC}"
    
    _CLOUD_BUILD_SA_EMAIL="${_CLOUD_BUILD_SA_NAME}@${_PROJECT_ID}.iam.gserviceaccount.com"
    
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
        safe_run "gcloud projects remove-iam-policy-binding $_PROJECT_ID \
            --member=\"serviceAccount:${_CLOUD_BUILD_SA_EMAIL}\" \
            --role=\"$role\" \
            --quiet" "Removing role $role"
    done
fi

# Remove IAM policy bindings for default Compute Engine service account
echo ""
echo -e "${BLUE}Removing IAM policy bindings for default Compute Engine service account...${NC}"

PROJECT_NUMBER=$(gcloud projects describe "$_PROJECT_ID" --format="value(projectNumber)" 2>/dev/null || echo "")
if [ -n "$PROJECT_NUMBER" ]; then
    DEFAULT_CE_SA_EMAIL="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
    
    ce_roles=(
        "roles/logging.admin"
        "roles/artifactregistry.admin"
        "roles/storage.admin"
    )
    
    for role in "${ce_roles[@]}"; do
        safe_run "gcloud projects remove-iam-policy-binding $_PROJECT_ID \
            --member=\"serviceAccount:${DEFAULT_CE_SA_EMAIL}\" \
            --role=\"$role\" \
            --quiet" "Removing role $role from default CE SA"
    done
fi

# Delete custom Cloud Build service account
if [ -n "$_CLOUD_BUILD_SA_NAME" ]; then
    echo ""
    safe_run "gcloud iam service-accounts delete $_CLOUD_BUILD_SA_EMAIL \
        --project=$_PROJECT_ID \
        --quiet" "Deleting Cloud Build service account"
fi

# Delete Artifact Registry repository
if [ -n "$_DOCKER_REPO_NAME" ]; then
    echo ""
    safe_run "gcloud artifacts repositories delete $_DOCKER_REPO_NAME \
        --location=$_REGION \
        --project=$_PROJECT_ID \
        --quiet" "Deleting Artifact Registry repository"
fi

# Delete Terraform state bucket (this should be last as it contains state)
if [ -n "$_TF_STATE_BUCKET_NAME" ]; then
    echo ""
    echo -e "${BLUE}Deleting Terraform state bucket...${NC}"
    safe_run "gsutil -m rm -r gs://$_TF_STATE_BUCKET_NAME" "Deleting bucket contents"
    safe_run "gsutil rb gs://$_TF_STATE_BUCKET_NAME" "Deleting bucket"
fi

# Clean up local files
echo ""
echo -e "${BLUE}Cleaning up local configuration files...${NC}"
safe_run "rm -f .setup_config" "Removing setup configuration"
safe_run "rm -f envs/$_ENV/terraform.tfstate*" "Removing local Terraform state files"
safe_run "rm -rf envs/$_ENV/.terraform" "Removing Terraform cache"

echo ""
echo -e "${GREEN}=== Cleanup Complete ===${NC}"
echo ""
echo -e "${YELLOW}Summary of actions taken:${NC}"
echo "✓ Destroyed all Terraform-managed resources"
echo "✓ Removed IAM policy bindings"
echo "✓ Deleted Cloud Build service account"
echo "✓ Deleted Artifact Registry repository"
echo "✓ Deleted Terraform state bucket"
echo "✓ Cleaned up local configuration files"
echo ""
echo -e "${BLUE}All resources for project $_PROJECT_ID have been destroyed.${NC}"
echo "You may need to manually disable any APIs that were enabled if desired."
