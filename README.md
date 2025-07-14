# Child Welfare Information System (CCWIS) Prototype

A comprehensive, modular, serverless-first Child Welfare Information System built for Google Cloud Platform. This prototype demonstrates a modern approach to CCWIS architecture with compliance considerations and scalable design patterns.

## 🏗️ Architecture Overview

This system follows a microservices architecture with the following key components:

### Core Modules
1. **Referral & Intake** - Initial referral processing and screening
2. **Core Case Management** - Case lifecycle management and person records
3. **Web UI** - Next.js-based user interface for caseworkers

### Infrastructure
- **Serverless-First**: Cloud Run services with auto-scaling
- **Data Layer**: Firestore for operational data, BigQuery for analytics
- **Event-Driven**: Pub/Sub for inter-service communication
- **Security**: IAP (Identity-Aware Proxy) for authentication
- **Networking**: VPC with private connectivity

## 📁 Project Structure

```
cw-prototype/
├── envs/                           # Environment-specific configurations
│   └── dev/                        # Development environment
│       ├── backend.tf              # Terraform backend configuration
│       ├── main.tf                 # Main Terraform configuration
│       ├── variables.tf            # Variable definitions
│       ├── outputs.tf              # Output definitions
│       └── versions.tf             # Provider version constraints
├── modules/                        # Reusable Terraform modules
│   ├── templates/
│   │   └── cloud_run_service/      # Cloud Run service template
│   ├── network/                    # VPC and networking resources
│   ├── data/                       # Storage and database resources
│   ├── apis/                       # API services module
│   └── ui/                         # UI application module
├── src/                            # Application source code
│   ├── apis/
│   │   ├── core_case_mgmt/         # Core Case Management API
│   │   └── referral_intake/        # Referral & Intake API
│   └── ui/                         # Next.js web application
├── cloudbuild.yaml                 # Cloud Build configuration
├── setup.sh                        # Setup script (Linux/macOS)
├── setup.ps1                       # Setup script (Windows)
└── clouddestroy.sh                 # Cleanup script
```

## 🚀 Quick Start

### Prerequisites
- Google Cloud Project with billing enabled
- `gcloud` CLI installed and authenticated
- Terraform >= 1.0
- Docker (for local development)

### 1. Initial Setup

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

### 2. Deploy Infrastructure

```bash
cd envs/dev
terraform init
terraform plan
terraform apply
```

### 3. Build and Deploy Applications

```bash
# Build all services
gcloud builds submit --config cloudbuild.yaml

# Or build specific services
gcloud builds submit --config cloudbuild.yaml --substitutions _BUILD_IMAGES="ui,core-case-mgmt"
```

## 🔧 Configuration

### Environment Variables

The system uses the following key environment variables:

- `PROJECT_ID`: Google Cloud Project ID
- `REGION`: Primary GCP region (default: us-central1)
- `ENV`: Environment name (dev, staging, prod)
- `PROJECT_BASE_NAME`: Base name for resources (max 8 chars)
- `UNIQUE_ID`: 4-character unique identifier

### Terraform Variables

Key variables in `envs/dev/terraform.tfvars`:

```hcl
project_id = "your-project-id"
region = "us-central1"
location = "us"
env = "dev"
project_base_name = "ccwis"
unique_id = "a1b2"
docker_repo_path = "us-central1-docker.pkg.dev/your-project-id/ccwis-repo"
```

## 🏛️ System Components

### Referral & Intake API
- **Purpose**: Handle initial referrals and screening decisions
- **Key Features**:
  - Referral creation and management
  - Automated priority assessment
  - Screening workflow
  - Event publishing for case creation

### Core Case Management API
- **Purpose**: Manage cases and person records
- **Key Features**:
  - Case lifecycle management
  - Person record management
  - Case notes and documentation
  - BigQuery integration for analytics

### Web UI
- **Purpose**: User interface for caseworkers
- **Technology**: Next.js with TypeScript and Tailwind CSS
- **Key Features**:
  - Dashboard with system overview
  - Referral management interface
  - Case management interface
  - Responsive design

## 🔒 Security & Compliance

### Authentication & Authorization
- **IAP (Identity-Aware Proxy)**: Controls access to the web UI
- **Service Accounts**: Each service runs with minimal required permissions
- **VPC Security**: Internal-only communication between services

### Data Protection
- **Encryption**: Data encrypted at rest and in transit
- **Access Controls**: Role-based access with principle of least privilege
- **Audit Logging**: Comprehensive logging for compliance

### CCWIS Compliance Considerations
- **Data Standards**: Structured data models for federal reporting
- **Security Requirements**: Implements security controls for sensitive data
- **Audit Trail**: Complete audit trail for all system actions
- **Backup & Recovery**: Point-in-time recovery for Firestore

## 📊 Monitoring & Observability

### Built-in Monitoring
- **Cloud Logging**: Centralized logging for all services
- **Cloud Monitoring**: Metrics and alerting
- **Cloud Trace**: Distributed tracing for performance analysis

### Health Checks
- Each service includes `/health` endpoints
- Automatic health monitoring by Cloud Run

## 🔄 Development Workflow

### Local Development

1. **API Development**:
   ```bash
   cd src/apis/core_case_mgmt
   pip install -r requirements.txt
   python main.py
   ```

2. **UI Development**:
   ```bash
   cd src/ui
   npm install
   npm run dev
   ```

### Deployment

1. **Infrastructure Changes**:
   ```bash
   cd envs/dev
   terraform plan
   terraform apply
   ```

2. **Application Updates**:
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

## 🧪 Testing

### API Testing
```bash
# Health check
curl https://your-api-url/health

# Create referral
curl -X POST https://your-referral-api-url/referrals \
  -H "Content-Type: application/json" \
  -d '{"referral_source": "School", "allegation_type": "Neglect", "child_name": "Test Child"}'
```

### UI Testing
Access the web UI at the URL provided in Terraform outputs.

## 📈 Scaling Considerations

### Current Prototype Limits
- **Cloud Run**: 10 max instances per service
- **Firestore**: Single region deployment
- **BigQuery**: Basic dataset structure

### Production Scaling
- **Multi-region deployment**: For high availability
- **Increased instance limits**: Based on load requirements
- **Advanced BigQuery**: Partitioned tables, materialized views
- **CDN**: For static assets and improved performance

## 🛠️ Troubleshooting

### Common Issues

1. **Permission Errors**:
   - Ensure Cloud Build service account has necessary permissions
   - Check IAM roles for Terraform service account

2. **Build Failures**:
   - Verify Docker images build locally
   - Check Cloud Build logs for specific errors

3. **Terraform Errors**:
   - Ensure APIs are enabled in the project
   - Check resource naming conflicts

### Useful Commands

```bash
# View Cloud Build logs
gcloud builds log [BUILD_ID]

# Check Cloud Run services
gcloud run services list

# View Terraform state
terraform show

# Debug networking
gcloud compute networks list
gcloud compute firewall-rules list
```

## 🧹 Cleanup

To destroy all resources:

```bash
# Using the cleanup script
./clouddestroy.sh

# Or manually
cd envs/dev
terraform destroy
```

## 📚 Additional Resources

- [Google Cloud Architecture Center](https://cloud.google.com/architecture)
- [CCWIS Technical Requirements](https://www.acf.hhs.gov/cb/training-technical-assistance/ccwis)
- [Terraform Google Provider Documentation](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

## 🤝 Contributing

This is a prototype system. For production use, consider:

1. **Enhanced Security**: Additional security controls and compliance measures
2. **Performance Optimization**: Caching, database optimization
3. **Advanced Features**: Workflow engine, reporting capabilities
4. **Testing**: Comprehensive test suite
5. **Documentation**: Detailed API documentation

## 📄 License

This prototype is provided for demonstration purposes. Consult with legal and compliance teams before production use.
