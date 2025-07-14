# Child Welfare Information System (CCWIS) Setup Script (PowerShell)
# This script prepares the local environment and GCP for the first Cloud Build run

param(
    [switch]$Force
)

# Error handling
$ErrorActionPreference = "Stop"

Write-Host "=== Child Welfare Information System (CCWIS) Setup ===" -ForegroundColor Blue
Write-Host ""

# Function to prompt for input with default value
function Prompt-WithDefault {
    param(
        [string]$Prompt,
        [string]$Default,
        [string]$VarName
    )
    
    if ($Default) {
        $input = Read-Host "$Prompt [$Default]"
        if ([string]::IsNullOrWhiteSpace($input)) {
            $input = $Default
        }
    } else {
        do {
            $input = Read-Host $Prompt
            if ([string]::IsNullOrWhiteSpace($input)) {
                Write-Host "This field is required." -ForegroundColor Red
            }
        } while ([string]::IsNullOrWhiteSpace($input))
    }
    
    Set-Variable -Name $VarName -Value $input -Scope Script
}

# Function to generate unique ID
function Generate-UniqueId {
    $bytes = New-Object byte[] 2
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    return [System.BitConverter]::ToString($bytes).Replace("-", "").ToLower()
}

# Load existing configuration if it exists
$ConfigFile = ".setup_config"
$config = @{}

if (Test-Path $ConfigFile) {
    Write-Host "Loading existing configuration..." -ForegroundColor Green
    Get-Content $ConfigFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $config[$matches[1]] = $matches[2]
        }
    }
} else {
    Write-Host "No existing configuration found. Creating new setup..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Please provide the following configuration:" -ForegroundColor Blue
Write-Host ""

# Prompt for required inputs
Prompt-WithDefault "GCP Project ID" $config["_PROJECT_ID"] "_PROJECT_ID"
Prompt-WithDefault "GCP Region (e.g., us-central1)" ($config["_REGION"] ?? "us-central1") "_REGION"
Prompt-WithDefault "GCP Location (e.g., us)" ($config["_LOCATION"] ?? "us") "_LOCATION"
Prompt-WithDefault "Environment (DEV, STG, PRD - max 3 chars)" ($config["_ENV"] ?? "DEV") "_ENV"
Prompt-WithDefault "Project base name (max 8 chars)" ($config["_PROJECT_BASE_NAME"] ?? "ccwis") "_PROJECT_BASE_NAME"
Prompt-WithDefault "Docker images to build (ui,core-case-mgmt,referral-intake or 'all' or 'none')" ($config["_BUILD_IMAGES"] ?? "all") "_BUILD_IMAGES"
Prompt-WithDefault "Enable GCP APIs (Y/N)" ($config["_ENABLE_GCP_APIS"] ?? "Y") "_ENABLE_GCP_APIS"
Prompt-WithDefault "Apply roles to custom Cloud Build service account (Y/N)" ($config["_APPLY_CUSTOM_CB_SA_ROLES"] ?? "Y") "_APPLY_CUSTOM_CB_SA_ROLES"
Prompt-WithDefault "Apply roles to default Compute Engine service account (Y/N)" ($config["_APPLY_DEFAULT_CE_SA_ROLES"] ?? "Y") "_APPLY_DEFAULT_CE_SA_ROLES"

# Generate unique ID if not exists
if (-not $config["_UNIQUE_ID"]) {
    $_UNIQUE_ID = Generate-UniqueId
    Write-Host "Generated unique ID: $_UNIQUE_ID" -ForegroundColor Green
} else {
    $_UNIQUE_ID = $config["_UNIQUE_ID"]
}

# Save configuration
$configContent = @"
# CCWIS Configuration - Generated $(Get-Date)
_PROJECT_ID=$_PROJECT_ID
_REGION=$_REGION
_LOCATION=$_LOCATION
_ENV=$_ENV
_PROJECT_BASE_NAME=$_PROJECT_BASE_NAME
_BUILD_IMAGES=$_BUILD_IMAGES
_ENABLE_GCP_APIS=$_ENABLE_GCP_APIS
_APPLY_CUSTOM_CB_SA_ROLES=$_APPLY_CUSTOM_CB_SA_ROLES
_APPLY_DEFAULT_CE_SA_ROLES=$_APPLY_DEFAULT_CE_SA_ROLES
_UNIQUE_ID=$_UNIQUE_ID
"@

$configContent | Out-File -FilePath $ConfigFile -Encoding UTF8
Write-Host ""
Write-Host "Configuration saved to $ConfigFile" -ForegroundColor Green

# Enable GCP APIs if requested
if ($_ENABLE_GCP_APIS -eq "Y") {
    Write-Host ""
    Write-Host "Enabling GCP APIs..." -ForegroundColor Blue
    
    $apis = @(
        "iam.googleapis.com",
        "cloudresourcemanager.googleapis.com",
        "artifactregistry.googleapis.com",
        "cloudbuild.googleapis.com",
        "iap.googleapis.com",
        "run.googleapis.com",
        "eventarc.googleapis.com",
        "pubsub.googleapis.com",
        "cloudfunctions.googleapis.com",
        "secretmanager.googleapis.com",
        "bigquery.googleapis.com",
        "workflows.googleapis.com"
    )
    
    foreach ($api in $apis) {
        Write-Host "Enabling $api..."
        & gcloud services enable $api --project=$_PROJECT_ID
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to enable API: $api"
        }
    }
    
    Write-Host "APIs enabled successfully." -ForegroundColor Green
}

# Create Terraform State GCS Bucket
$_TF_STATE_BUCKET_NAME = "${_PROJECT_BASE_NAME}${_UNIQUE_ID}-tf-state-bkt"
Write-Host ""
Write-Host "Creating Terraform state bucket: $_TF_STATE_BUCKET_NAME" -ForegroundColor Blue

$bucketExists = & gsutil ls -b "gs://$_TF_STATE_BUCKET_NAME" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Bucket $_TF_STATE_BUCKET_NAME already exists." -ForegroundColor Yellow
} else {
    & gsutil mb -p $_PROJECT_ID -c STANDARD -l $_REGION "gs://$_TF_STATE_BUCKET_NAME"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create bucket: $_TF_STATE_BUCKET_NAME"
    }
    
    & gsutil versioning set on "gs://$_TF_STATE_BUCKET_NAME"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to enable versioning on bucket: $_TF_STATE_BUCKET_NAME"
    }
    
    Write-Host "Bucket $_TF_STATE_BUCKET_NAME created successfully." -ForegroundColor Green
    
    # Update backend.tf file
    $backendFile = "envs/$_ENV/backend.tf"
    if (Test-Path $backendFile) {
        (Get-Content $backendFile) -replace 'UPDATE_ME_BY_SETUP_SCRIPT', $_TF_STATE_BUCKET_NAME | Set-Content $backendFile
        Write-Host "Updated backend.tf with bucket name." -ForegroundColor Green
    }
}

# Create Artifact Registry Repository
$_DOCKER_REPO_NAME = "${_PROJECT_BASE_NAME}${_UNIQUE_ID}-docker-repo"
$_DOCKER_REPO_PATH = "${_REGION}-docker.pkg.dev/${_PROJECT_ID}/${_DOCKER_REPO_NAME}"
Write-Host ""
Write-Host "Creating Artifact Registry repository: $_DOCKER_REPO_NAME" -ForegroundColor Blue

$repoExists = & gcloud artifacts repositories describe $_DOCKER_REPO_NAME --location=$_REGION --project=$_PROJECT_ID 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Repository $_DOCKER_REPO_NAME already exists." -ForegroundColor Yellow
} else {
    & gcloud artifacts repositories create $_DOCKER_REPO_NAME --repository-format=docker --location=$_REGION --project=$_PROJECT_ID
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create repository: $_DOCKER_REPO_NAME"
    }
    Write-Host "Repository $_DOCKER_REPO_NAME created successfully." -ForegroundColor Green
}

# Create custom Cloud Build service account
$_CLOUD_BUILD_SA_NAME = "${_PROJECT_BASE_NAME}${_UNIQUE_ID}-cloudbuild-sa"
$_CLOUD_BUILD_SA_EMAIL = "${_CLOUD_BUILD_SA_NAME}@${_PROJECT_ID}.iam.gserviceaccount.com"
Write-Host ""
Write-Host "Creating Cloud Build service account: $_CLOUD_BUILD_SA_NAME" -ForegroundColor Blue

$saExists = & gcloud iam service-accounts describe $_CLOUD_BUILD_SA_EMAIL --project=$_PROJECT_ID 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Service account $_CLOUD_BUILD_SA_NAME already exists." -ForegroundColor Yellow
    $saCreated = $false
} else {
    & gcloud iam service-accounts create $_CLOUD_BUILD_SA_NAME --display-name="CCWIS Cloud Build Service Account" --project=$_PROJECT_ID
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create service account: $_CLOUD_BUILD_SA_NAME"
    }
    Write-Host "Service account $_CLOUD_BUILD_SA_NAME created successfully." -ForegroundColor Green
    $saCreated = $true
}

# Apply roles to custom Cloud Build service account
if ($saCreated -or ($_APPLY_CUSTOM_CB_SA_ROLES -eq "Y")) {
    Write-Host ""
    Write-Host "Applying roles to Cloud Build service account..." -ForegroundColor Blue
    
    $roles = @(
        "roles/serviceusage.serviceUsageAdmin",
        "roles/artifactregistry.admin",
        "roles/storage.admin",
        "roles/run.admin",
        "roles/workflows.admin",
        "roles/eventarc.admin",
        "roles/iam.serviceAccountAdmin",
        "roles/resourcemanager.projectIamAdmin",
        "roles/logging.logWriter",
        "roles/iam.serviceAccountUser",
        "roles/cloudbuild.builds.builder",
        "roles/secretmanager.secretAccessor",
        "roles/bigquery.admin",
        "roles/cloudfunctions.admin"
    )
    
    foreach ($role in $roles) {
        Write-Host "Binding role $role..."
        & gcloud projects add-iam-policy-binding $_PROJECT_ID --member="serviceAccount:$_CLOUD_BUILD_SA_EMAIL" --role=$role --condition=None
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Failed to bind role: $role"
        }
    }
    
    Write-Host "Roles applied successfully." -ForegroundColor Green
}

# Apply roles to default Compute Engine service account
if ($_APPLY_DEFAULT_CE_SA_ROLES -eq "Y") {
    Write-Host ""
    Write-Host "Applying roles to default Compute Engine service account..." -ForegroundColor Blue
    
    # Get project number
    $projectNumber = & gcloud projects describe $_PROJECT_ID --format="value(projectNumber)"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to get project number"
    }
    
    $defaultCeSaEmail = "${projectNumber}-compute@developer.gserviceaccount.com"
    
    $ceRoles = @(
        "roles/logging.admin",
        "roles/artifactregistry.admin",
        "roles/storage.admin"
    )
    
    foreach ($role in $ceRoles) {
        Write-Host "Binding role $role to default CE service account..."
        & gcloud projects add-iam-policy-binding $_PROJECT_ID --member="serviceAccount:$defaultCeSaEmail" --role=$role --condition=None
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Failed to bind role: $role"
        }
    }
    
    Write-Host "Roles applied to default CE service account successfully." -ForegroundColor Green
}

# Create substitutions variable
$_SUBSTITUTIONS = "_PROJECT_ID=$_PROJECT_ID,_REGION=$_REGION,_LOCATION=$_LOCATION,_ENV=$_ENV,_PROJECT_BASE_NAME=$_PROJECT_BASE_NAME,_UNIQUE_ID=$_UNIQUE_ID,_DOCKER_REPO_PATH=$_DOCKER_REPO_PATH,_BUILD_IMAGES=$_BUILD_IMAGES"

# Update configuration file with computed values
$additionalConfig = @"
_TF_STATE_BUCKET_NAME=$_TF_STATE_BUCKET_NAME
_DOCKER_REPO_NAME=$_DOCKER_REPO_NAME
_DOCKER_REPO_PATH=$_DOCKER_REPO_PATH
_CLOUD_BUILD_SA_NAME=$_CLOUD_BUILD_SA_NAME
_SUBSTITUTIONS=$_SUBSTITUTIONS
"@

Add-Content -Path $ConfigFile -Value $additionalConfig

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration Summary:" -ForegroundColor Blue
Write-Host "Project ID: $_PROJECT_ID"
Write-Host "Region: $_REGION"
Write-Host "Location: $_LOCATION"
Write-Host "Environment: $_ENV"
Write-Host "Project Base Name: $_PROJECT_BASE_NAME"
Write-Host "Unique ID: $_UNIQUE_ID"
Write-Host "Build Images: $_BUILD_IMAGES"
Write-Host "TF State Bucket: $_TF_STATE_BUCKET_NAME"
Write-Host "Docker Repo: $_DOCKER_REPO_NAME"
Write-Host "Cloud Build SA: $_CLOUD_BUILD_SA_NAME"
Write-Host ""
Write-Host "To deploy the infrastructure, run:" -ForegroundColor Blue
Write-Host "gcloud builds submit --config ./cloudbuild.yaml --project=`"`$_PROJECT_ID`" --region=`"`$_REGION`" --substitutions=`"`$_SUBSTITUTIONS`""
Write-Host ""
Write-Host "With variables expanded:" -ForegroundColor Blue
Write-Host "gcloud builds submit --config ./cloudbuild.yaml --project=`"$_PROJECT_ID`" --region=`"$_REGION`" --substitutions=`"$_SUBSTITUTIONS`""
