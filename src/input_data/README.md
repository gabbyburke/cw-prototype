# Input Catalog Service

This Cloud Run service processes university catalog data (courses, programs, and academic pathways) by transforming them into BigQuery-compatible format with embeddings for semantic search capabilities.

## Package Structure

```
src/backend/input_data/
├── README.md                    # This documentation
├── Dockerfile                   # Container configuration for Cloud Run deployment
├── requirements.txt             # Python dependencies
├── main.py                      # Flask application entry point
├── __init__.py                  # Python package marker
├── course_transformer.py       # Course data transformation logic
├── program_transformer.py      # Program data transformation logic
├── academic_plan_transformer.py # Academic plan transformation logic
└── embedding_service.py         # Embedding generation utilities
```

## Project Dependencies

This service depends on shared utilities located in the project structure:

```
src/
├── backend/
│   ├── input_data/          # This service
│   └── utils/
│       └── genai.py            # Shared Gemini AI client
└── ...
```

## Import Path Resolution

### Local Development

The service uses a sys.path modification in `main.py` to resolve absolute imports:

```python
import sys
import os
# Add the project root to Python path for absolute imports
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
sys.path.insert(0, project_root)
```

This allows imports like:
```python
from src.backend.utils.genai import GeminiClient
```

### Cloud Run Deployment

The Dockerfile is configured to:
1. Copy only the `src/backend/` directory structure to `/app/src/backend/`
2. Set `PYTHONPATH=/wheels:/app` to include both dependencies and project root
3. Run the application from `/app/src/backend/input_data/`

## Local Development Setup

### Prerequisites

1. **Python 3.11** installed
2. **Google Cloud SDK** configured with appropriate credentials
3. **Environment variables** set for Vertex AI:
   ```bash
   export VERTEX_AI_PROJECT="your-gcp-project-id"
   export VERTEX_AI_LOCATION="us-central1"
   ```

### Running Locally

1. **Navigate to the input_data directory:**
   ```bash
   cd src/backend/input_data
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set required environment variables:**
   ```bash
   # Required for BigQuery
   export BIGQUERY_DATASET="university_catalog"
   export BIGQUERY_TABLE_COURSES="courses"
   export BIGQUERY_TABLE_PROGRAMS="programs"
   export BIGQUERY_TABLE_PROGRAM_REQUIREMENTS="program_requirements"
   export BIGQUERY_TABLE_ACADEMIC_PLANS="academic_plans"
   export BIGQUERY_TABLE_SEMESTER_PLANS="semester_plans"
   export BIGQUERY_TABLE_COURSE_GENERATED_SKILLS="course_generated_skills"
   
   # Required for Vertex AI
   export VERTEX_AI_PROJECT="your-gcp-project-id"
   export VERTEX_AI_LOCATION="us-central1"
   ```

4. **Run the application:**
   ```bash
   python main.py
   ```

The service will start on `http://localhost:8080`.

## Cloud Run Deployment via Terraform

### Terraform Configuration

This service is deployed using the project's Terraform infrastructure. The relevant configuration is in:

- **Terraform Module**: `modules/backend/input_data.tf`
- **Source Code**: `src/backend/input_data/`
- **Docker Image**: Built and pushed via `cloudbuild.yaml`

### Deployment Process

1. **Build and Deploy via Cloud Build:**
   ```bash
   # From project root
   gcloud builds submit --config ./cloudbuild.yaml \
     --project="${PROJECT_ID}" \
     --region="${REGION}" \
     --substitutions="${SUBSTITUTIONS}"
   ```

2. **Terraform manages:**
   - Cloud Run service creation
   - IAM service account with appropriate permissions
   - Environment variable configuration
   - VPC connector setup
   - BigQuery dataset and table creation

### Resource Naming Convention

Following the project's naming convention:
- **Service Name**: `{project_base_name}{unique_id}-{env}-input-data-crsvc`
- **Docker Image**: `{project_base_name}{unique_id}-{env}-input-data-dimg`
- **Service Account**: `{project_base_name}{unique_id}-{env}-input-data-sa`

## API Endpoints

### POST /
Processes university catalog data triggered by Cloud Storage events.

**Request Body** (Pub/Sub message):
```json
{
  "message": {
    "data": {
      "bucket": "your-bucket-name",
      "name": "path/to/data-file.json"
    }
  }
}
```

**Supported File Types:**
- **courses**: Files containing course data
- **programs**: Files containing program data
- **pathways**: Files containing academic pathway data

**Response:**
```json
{
  "status": "success|error|skipped",
  "message": "Processing result description"
}
```

## Data Processing Flow

1. **File Detection**: Service receives Pub/Sub message from Cloud Storage trigger
2. **Data Download**: Downloads JSON file from Cloud Storage
3. **Transformation**: Applies appropriate transformer based on file type
4. **Embedding Generation**: Creates vector embeddings for semantic search
5. **BigQuery Upsert**: Stores transformed data in BigQuery tables

## Troubleshooting

### Import Errors

**Problem**: `ModuleNotFoundError: No module named 'src.backend.utils'`

**Solutions:**
1. **Local Development**: Ensure you're running from the `input_data` directory
2. **Check sys.path**: Verify the project root path resolution in `main.py`
3. **Environment**: Confirm you're in the correct Python environment

### Docker Build Issues

**Problem**: Docker build fails to find source files

**Solutions:**
1. **Build Context**: Ensure Docker build is run from the project root
2. **File Paths**: Verify the COPY commands in Dockerfile match your project structure
3. **Build Command**: Use the correct build context:
   ```bash
   # From project root
   docker build -f src/backend/input_data/Dockerfile -t input-data .
   ```

### Cloud Run Deployment Issues

**Problem**: Service fails to start in Cloud Run

**Solutions:**
1. **Environment Variables**: Verify all required environment variables are set in Terraform
2. **Permissions**: Check that the service account has necessary BigQuery and Vertex AI permissions
3. **Logs**: Review Cloud Run logs for specific error messages
4. **Timeout**: Ensure Cloud Run timeout is set to accommodate large data processing (60 minutes recommended)

## Performance Considerations

### Gemini API Calls
- **Current Implementation**: Sequential processing of program descriptions
- **Recommendation**: Implement batch processing or parallel execution for large datasets
- **Timeout**: Increase Cloud Run timeout for processing large program catalogs

### BigQuery Operations
- **Batch Size**: Default 100 rows per batch, configurable
- **Retry Logic**: Exponential backoff with 4 retry attempts
- **Temporary Tables**: Used for MERGE operations to ensure data consistency

## Security

### Service Account Permissions
The Terraform-managed service account requires:
- `roles/bigquery.dataEditor`
- `roles/storage.objectViewer`
- `roles/aiplatform.user`
- `roles/logging.logWriter`

### Network Security
- **VPC Connector**: Service runs in private VPC
- **Ingress**: Internal traffic only
- **Authentication**: Requires IAM authentication for API calls

## Monitoring and Logging

### Cloud Logging
All processing steps are logged with structured messages including:
- File processing status
- Batch processing progress
- Error details with stack traces
- BigQuery operation results

### Metrics
Monitor these key metrics:
- **Request latency**: Processing time per file
- **Error rate**: Failed processing attempts
- **BigQuery operations**: Insert/update success rates
- **Memory usage**: Container resource utilization

## Future Enhancements

1. **Parallel Processing**: Implement concurrent Gemini API calls
2. **Streaming**: Support for large file processing via streaming
3. **Validation**: Add data validation before BigQuery insertion
4. **Caching**: Implement embedding caching for repeated content
5. **Monitoring**: Add custom metrics and alerting