"""
Core Case Management API

This service provides the foundational APIs for managing cases and persons
in the Child Welfare Information System (CCWIS).
"""

import os
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from uuid import uuid4

from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import bigquery
import google.auth

from bigquery_manager import BigQueryManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Initialize BigQuery manager
bq_manager = BigQueryManager()

# Configuration
PROJECT_ID = os.getenv('PROJECT_ID', 'gb-demos')
BIGQUERY_DATASET = os.getenv('BIGQUERY_DATASET', 'cw_case_notes')


# Remove old Firestore-based managers since we're using BigQuery now


def get_user_id_from_headers() -> str:
    """Extract user ID from IAP headers."""
    # In a real implementation, this would extract from X-Goog-Authenticated-User-Email
    return request.headers.get('X-Goog-Authenticated-User-Email', 'system@example.com')


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'service': 'core-case-mgmt'}), 200


# SWCM-specific endpoints for case assignment workflow
@app.route('/swcm/cases/pending-assignment', methods=['GET'])
def get_cases_pending_swcm_assignment():
    """Get cases that are ready for SWCM assignment (step 4 in workflow)."""
    try:
        cases = bq_manager.get_cases_for_swcm_assignment()
        return jsonify({'cases': cases}), 200
        
    except Exception as e:
        logger.error(f"Error retrieving cases pending SWCM assignment: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/swcm/cases/<case_id>/assign', methods=['POST'])
def assign_case_to_swcm():
    """Assign a case to an SWCM worker (step 5 in workflow)."""
    try:
        case_id = request.view_args['case_id']
        data = request.get_json()
        
        if not data or 'assigned_worker' not in data:
            return jsonify({'error': 'assigned_worker is required'}), 400
        
        assigned_worker = data['assigned_worker']
        assigned_supervisor = data.get('assigned_supervisor', 'Sarah Williams')
        
        success = bq_manager.assign_case_to_swcm(case_id, assigned_worker, assigned_supervisor)
        
        if not success:
            return jsonify({'error': 'Failed to assign case'}), 500
        
        return jsonify({'message': 'Case assigned successfully'}), 200
        
    except Exception as e:
        logger.error(f"Error assigning case: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/cases/<case_id>', methods=['GET'])
def get_case(case_id: str):
    """Get a specific case with all related data."""
    try:
        case = bq_manager.get_case_by_id(case_id)
        
        if not case:
            return jsonify({'error': 'Case not found'}), 404
        
        return jsonify(case), 200
        
    except Exception as e:
        logger.error(f"Error retrieving case {case_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/cases', methods=['GET'])
def list_cases():
    """List cases assigned to a worker."""
    try:
        assigned_worker = request.args.get('assigned_worker')
        
        if not assigned_worker:
            return jsonify({'error': 'assigned_worker parameter is required'}), 400
        
        cases = bq_manager.get_cases_by_worker(assigned_worker)
        return jsonify({'cases': cases}), 200
        
    except Exception as e:
        logger.error(f"Error listing cases: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/cases/<case_id>/persons', methods=['GET'])
def list_case_persons(case_id: str):
    """List all persons associated with a case."""
    try:
        persons = bq_manager.get_persons_by_case(case_id)
        return jsonify({'persons': persons}), 200
        
    except Exception as e:
        logger.error(f"Error listing persons for case {case_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/cases/<case_id>/notes', methods=['GET'])
def get_case_notes(case_id: str):
    """Get case notes for a specific case."""
    try:
        notes = bq_manager.get_case_notes(case_id)
        return jsonify({'notes': notes}), 200
        
    except Exception as e:
        logger.error(f"Error retrieving case notes for {case_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
