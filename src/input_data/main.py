# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# main.py for input_data Cloud Run service
# This file will contain the logic for parsing university catalog data,
# transforming it, generating embeddings, and storing it in BigQuery.

import sys
import os

from src.backend.input_data.embedding_service import CUSTOM_BIGQUERY_TIMEOUT
from src.backend.utils.logger_config import logger

# Add the project root to Python path for absolute imports
# For local development: go up 3 levels to project root
# For Docker: the backend folder is copied to /app/src/backend, so we need /app
if os.path.exists(os.path.join(os.path.dirname(__file__), '../../..')):
    # Local development - go up to project root
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
else:
    # Docker environment - backend is at /app/src/backend
    project_root = '/app'
sys.path.insert(0, project_root)

import json
from typing import List, Dict, Any

from flask import Flask, request, jsonify
from google.cloud import bigquery, storage
from tenacity import retry, wait_exponential, stop_after_attempt


app = Flask(__name__)

# Initialize Google Cloud clients
bigquery_client = bigquery.Client()
storage_client = storage.Client()

# BigQuery dataset and table IDs (replace with actual values or environment variables)
BIGQUERY_DATASET = os.environ.get("BIGQUERY_DATASET", "cw_case_notes")
BIGQUERY_TABLES = {

}


@app.route("/", methods=["POST"])
def process_input_data():
    """
    Cloud Run entry point for processing university catalog data.
    Triggered by an Eventarc GCS event.
    """
    gcs_event = request.get_json()
    if not gcs_event:
        return jsonify({"status": "error", "message": "No JSON payload received"}), 400

    # Get the bucket and file name directly from the top level of the JSON payload.
    bucket_name = gcs_event.get("bucket")
    file_name = gcs_event.get("name")
    etag = gcs_event.get("etag")
    print(f"***************** Etag: {etag} *****************")

    if not bucket_name or not file_name:
        logger.error(f"Missing bucket or file name in payload: {gcs_event}")
        return jsonify({"status": "error", "message": "Missing bucket or file name in GCS event"}), 400

    logger.info(f"Processing file {file_name} from bucket {bucket_name}")

    try:
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(file_name)
        data = blob.download_as_text()
        json_data = json.loads(data)

        # TODO Add the processing of magic button input

        logger.info(f"Successfully processed {file_name}")
        return jsonify({"status": "success", "message": f"Successfully processed {file_name}"}), 200

    except Exception as e:
        import traceback
        logger.error(f"Error processing file {file_name}: {e}", exc_info=True)
        return jsonify({"status": "error", "message": f"Error processing file: {e}"}), 500

if __name__ == "__main__":
    # For local testing, set environment variables or hardcode values
    # os.environ["BIGQUERY_DATASET"] = "your_dataset_id"
    # os.environ["VERTEX_AI_PROJECT"] = "your_gcp_project_id"
    # os.environ["VERTEX_AI_LOCATION"] = "us-central1"
    # os.environ["VERTEX_AI_MODEL_ID"] = "gemini-embedding-001"

    app.run(debug=False, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
