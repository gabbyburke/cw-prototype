# CCWIS Prototype Deployment Guide

This guide will help you deploy the Child Welfare Information System (CCWIS) prototype to Google Cloud Platform.

## Prerequisites

1. **Google Cloud Project** with billing enabled
2. **gcloud CLI** installed and authenticated
3. **Terraform** >= 1.0 installed
4. **Docker** installed (for local development)

## Quick Start

### 1. Setup Google Cloud Project

```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  firestore.googleapis.com \
  bigquery.googleapis.com \
  pubsub.googleapis.com \
  vpcaccess.googleapis.com \
  compute.googleapis.com
```

### 2. Run Setup Script

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows (PowerShell):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

### 3. Configure Terraform Variables

```bash
cd envs/dev
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your project details:
```hcl
project_id = "your-actual-project-id"
region = "us-central1"
location = "us"
env = "dev"
project_base_name = "ccwis"
unique_id = "a1b2"  # Change this to something unique
docker_repo_path = "us-central1-docker.pkg.dev/your-actual-project-id/ccwis-repo"
```

### 4. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the infrastructure
terraform apply
```

### 5. Build and Deploy Applications

```bash
# Return to project root
cd ../..

# Build all services
gcloud builds submit --config cloudbuild.yaml

# Check deployment status
gcloud run services list --region=us-central1
```

## Accessing the Application

After deployment, get the application URLs:

```bash
cd envs/dev
terraform output application_urls
```

The web UI will be available at the `web_ui` URL. Note that IAP (Identity-Aware Proxy) is enabled, so you'll need to be authenticated with Google Cloud.

## Local Development

### Running APIs Locally

**Core Case Management API:**
```bash
cd src/apis/core_case_mgmt
pip install -r requirements.txt
export PROJECT_ID="your-project-id"
export FIRESTORE_DATABASE="(default)"
python main.py
```

**Referral & Intake API:**
```bash
cd src/apis/referral_intake
pip install -r requirements.txt
export PROJECT_ID="your-project-id"
export FIRESTORE_DATABASE="(default)"
python main.py
```

### Running UI Locally

```bash
cd src/ui
npm install
npm run dev
```

The UI will be available at http://localhost:3000

## Testing the System

### 1. Test API Health Checks

```bash
# Get API URLs from Terraform output
API_URLS=$(cd envs/dev && terraform output -json application_urls)

# Test Core Case Management API
curl "$(echo $API_URLS | jq -r '.core_case_mgmt_api')/health"

# Test Referral Intake API
curl "$(echo $API_URLS | jq -r '.referral_intake_api')/health"
```

### 2. Create a Test Referral

```bash
REFERRAL_API_URL=$(cd envs/dev && terraform output -raw referral_intake_api_url)

curl -X POST "$REFERRAL_API_URL/referrals" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -d '{
    "referral_source": "School",
    "allegation_type": "Neglect",
    "child_name": "Test Child",
    "referrer_name": "Test Teacher",
    "allegation_description": "Child appears malnourished"
  }'
```

### 3. Access the Web UI

Visit the web UI URL from the Terraform output. You'll be prompted to authenticate with Google Cloud IAP.

## Monitoring and Logs

### View Application Logs

```bash
# View Cloud Run service logs
gcloud logs read "resource.type=cloud_run_revision" --limit=50

# View specific service logs
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=ccwisa1b2-dev-ui-crsvc" --limit=20
```

### Monitor Services

```bash
# Check service status
gcloud run services describe ccwisa1b2-dev-ui-crsvc --region=us-central1

# View metrics in Cloud Console
echo "Visit: https://console.cloud.google.com/run?project=$PROJECT_ID"
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   - Ensure Cloud Build service account has necessary permissions
   - Check IAM roles for your user account

2. **Build Failures**
   - Verify Docker images build locally first
   - Check Cloud Build logs: `gcloud builds log [BUILD_ID]`

3. **Terraform Errors**
   - Ensure all required APIs are enabled
   - Check for resource naming conflicts

### Useful Commands

```bash
# View Terraform state
cd envs/dev && terraform show

# Check Cloud Run services
gcloud run services list --region=us-central1

# View Cloud Build history
gcloud builds list --limit=10

# Debug networking
gcloud compute networks list
gcloud compute firewall-rules list
```

## Cleanup

To destroy all resources:

```bash
# Using the cleanup script
./clouddestroy.sh

# Or manually
cd envs/dev
terraform destroy
```

## Next Steps

1. **Customize the UI** - Modify the React components in `src/ui/app/`
2. **Extend APIs** - Add new endpoints to the Flask applications
3. **Add Authentication** - Integrate with your organization's identity provider
4. **Configure Monitoring** - Set up alerts and dashboards
5. **Add Tests** - Implement unit and integration tests

## Support

For issues or questions:
1. Check the main README.md for architecture details
2. Review Google Cloud documentation for specific services
3. Check Terraform provider documentation for configuration options
