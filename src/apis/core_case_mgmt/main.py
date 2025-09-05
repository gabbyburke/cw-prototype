"""
Core Case Management API

This service provides the foundational APIs for managing cases and persons
in the Child Welfare Information System (CCWIS).
"""

import os
import logging
import json
from datetime import datetime
from typing import Dict, List, Optional, Any, Tuple
from uuid import uuid4

from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from google.cloud import bigquery
from google.cloud.exceptions import GoogleCloudError
import google.auth

from bigquery_manager import BigQueryManager

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Configuration from environment variables
PROJECT_ID = os.getenv('PROJECT_ID')
BIGQUERY_DATASET = os.getenv('BIGQUERY_DATASET')
ENV = os.getenv('ENV', 'development')

if not PROJECT_ID:
    logger.error("PROJECT_ID environment variable is required")
    raise ValueError("PROJECT_ID environment variable is required")

if not BIGQUERY_DATASET:
    logger.error("BIGQUERY_DATASET environment variable is required")
    raise ValueError("BIGQUERY_DATASET environment variable is required")

# Initialize BigQuery manager
try:
    bq_manager = BigQueryManager()
    logger.info("BigQuery manager initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize BigQuery manager: {str(e)}")
    raise


def get_user_id_from_headers() -> str:
    """
    Extract user ID from IAP headers.
    
    Returns:
        str: User email or system default
    """
    return request.headers.get('X-Goog-Authenticated-User-Email', 'system@example.com')


def create_error_response(message: str, status_code: int = 500) -> Tuple[Response, int]:
    """
    Create a standardized error response.
    
    Args:
        message: Error message
        status_code: HTTP status code
        
    Returns:
        Tuple of Flask response and status code
    """
    logger.error(f"Error response: {message} (status: {status_code})")
    return jsonify({'error': message, 'status': status_code}), status_code


def create_success_response(data: Any, message: str = None) -> Response:
    """
    Create a standardized success response.
    
    Args:
        data: Response data
        message: Optional success message
        
    Returns:
        Flask JSON response
    """
    response_data = data if isinstance(data, dict) else {'data': data}
    if message:
        response_data['message'] = message
    return jsonify(response_data)


@app.route('/health', methods=['GET'])
def health_check() -> Response:
    """
    Health check endpoint.
    
    Returns:
        Response: Health status
    """
    return create_success_response({
        'status': 'healthy', 
        'service': 'core-case-mgmt',
        'environment': ENV
    })


@app.route('/swcm/cases/pending-assignment', methods=['GET'])
def get_cases_pending_swcm_assignment() -> Tuple[Response, int]:
    """
    Get cases that are ready for SWCM assignment (step 4 in workflow).
    
    Returns:
        Tuple[Response, int]: JSON response with cases or error
    """
    try:
        logger.info("Retrieving cases pending SWCM assignment")
        cases = bq_manager.get_cases_for_swcm_assignment()
        logger.info(f"Found {len(cases)} cases pending assignment")
        return create_success_response({'cases': cases}), 200
        
    except GoogleCloudError as e:
        return create_error_response(f"BigQuery error: {str(e)}", 503)
    except Exception as e:
        return create_error_response("Failed to retrieve pending cases", 500)


@app.route('/swcm/cases/<case_id>/assign', methods=['POST'])
def assign_case_to_swcm(case_id: str) -> Tuple[Response, int]:
    """
    Assign a case to an SWCM worker (step 5 in workflow).
    
    Args:
        case_id: The case ID to assign
        
    Returns:
        Tuple[Response, int]: Success or error response
    """
    try:
        data = request.get_json()
        
        if not data or 'assigned_worker' not in data:
            return create_error_response('assigned_worker is required', 400)
        
        assigned_worker = data['assigned_worker']
        assigned_supervisor = data.get('assigned_supervisor', 'Sarah Williams')
        user_id = get_user_id_from_headers()
        
        logger.info(f"Assigning case {case_id} to worker {assigned_worker} by user {user_id}")
        
        success = bq_manager.assign_case_to_swcm(case_id, assigned_worker, assigned_supervisor)
        
        if not success:
            return create_error_response('Failed to assign case', 500)
        
        logger.info(f"Successfully assigned case {case_id} to {assigned_worker}")
        return create_success_response({}, 'Case assigned successfully'), 200
        
    except GoogleCloudError as e:
        return create_error_response(f"BigQuery error: {str(e)}", 503)
    except Exception as e:
        return create_error_response("Failed to assign case", 500)


@app.route('/cases/<case_id>', methods=['GET'])
def get_case(case_id: str) -> Tuple[Response, int]:
    """
    Get a specific case with all related data.
    
    Args:
        case_id: The case ID to retrieve
        
    Returns:
        Tuple[Response, int]: Case data or error response
    """
    try:
        logger.info(f"Retrieving case {case_id}")
        case = bq_manager.get_case_by_id(case_id)
        
        if not case:
            return create_error_response('Case not found', 404)
        
        return create_success_response(case), 200
        
    except GoogleCloudError as e:
        return create_error_response(f"BigQuery error: {str(e)}", 503)
    except Exception as e:
        return create_error_response("Failed to retrieve case", 500)


@app.route('/cases', methods=['GET'])
def list_cases() -> Tuple[Response, int]:
    """
    List cases assigned to a worker.
    
    Returns:
        Tuple[Response, int]: Cases list or error response
    """
    try:
        assigned_worker = request.args.get('assigned_worker')
        
        if not assigned_worker:
            return create_error_response('assigned_worker parameter is required', 400)
        
        logger.info(f"Retrieving cases for worker {assigned_worker}")
        cases = bq_manager.get_cases_by_worker(assigned_worker)
        logger.info(f"Found {len(cases)} cases for worker {assigned_worker}")
        
        return create_success_response({'cases': cases}), 200
        
    except GoogleCloudError as e:
        return create_error_response(f"BigQuery error: {str(e)}", 503)
    except Exception as e:
        return create_error_response("Failed to retrieve cases", 500)


@app.route('/cases/<case_id>/persons', methods=['GET'])
def list_case_persons(case_id: str) -> Tuple[Response, int]:
    """
    List all persons associated with a case.
    
    Args:
        case_id: The case ID
        
    Returns:
        Tuple[Response, int]: Persons list or error response
    """
    try:
        logger.info(f"Retrieving persons for case {case_id}")
        persons = bq_manager.get_persons_by_case(case_id)
        logger.info(f"Found {len(persons)} persons for case {case_id}")
        
        return create_success_response({'persons': persons}), 200
        
    except GoogleCloudError as e:
        return create_error_response(f"BigQuery error: {str(e)}", 503)
    except Exception as e:
        return create_error_response("Failed to retrieve persons", 500)


@app.route('/cases/<case_id>/persons', methods=['POST'])
def associate_person_to_case(case_id: str) -> Tuple[Response, int]:
    """
    Associate a person to a case with a specific role.
    
    Args:
        case_id: The case ID to associate the person with
        
    Returns:
        Tuple[Response, int]: Success or error response
    """
    try:
        data = request.get_json()
        
        if not data or 'person_id' not in data:
            return create_error_response('person_id is required', 400)
        
        if 'role' not in data:
            return create_error_response('role is required', 400)
        
        person_id = data['person_id']
        role = data['role']
        user_id = get_user_id_from_headers()
        
        logger.info(f"Associating person {person_id} to case {case_id} with role {role} by user {user_id}")
        
        success = bq_manager.associate_person_to_case(case_id, person_id, role)
        
        if not success:
            return create_error_response('Failed to associate person to case. Person may already be associated.', 400)
        
        logger.info(f"Successfully associated person {person_id} to case {case_id}")
        return create_success_response({}, 'Person associated to case successfully'), 201
        
    except GoogleCloudError as e:
        return create_error_response(f"BigQuery error: {str(e)}", 503)
    except Exception as e:
        return create_error_response("Failed to associate person to case", 500)


@app.route('/cases/<case_id>/notes', methods=['GET'])
def get_case_notes(case_id: str) -> Tuple[Response, int]:
    """
    Get case notes for a specific case.
    
    Args:
        case_id: The case ID
        
    Returns:
        Tuple[Response, int]: Case notes or error response
    """
    try:
        logger.info(f"Retrieving case notes for case {case_id}")
        notes = bq_manager.get_case_notes(case_id)
        logger.info(f"Found {len(notes)} notes for case {case_id}")
        
        return create_success_response({'notes': notes}), 200
        
    except GoogleCloudError as e:
        return create_error_response(f"BigQuery error: {str(e)}", 503)
    except Exception as e:
        return create_error_response("Failed to retrieve case notes", 500)


@app.route('/cases/<case_id>/notes', methods=['POST'])
def add_case_note(case_id: str) -> Tuple[Response, int]:
    """
    Add a new case note to a specific case.
    
    Args:
        case_id: The case ID to add the note to
        
    Returns:
        Tuple[Response, int]: Success or error response
    """
    try:
        data = request.get_json()
        
        if not data or 'note_text' not in data:
            return create_error_response('note_text is required', 400)
        
        note_text = data['note_text']
        note_type = data.get('note_type', 'General')
        user_id = get_user_id_from_headers()
        
        logger.info(f"Adding case note to case {case_id} by user {user_id}")
        
        success = bq_manager.add_case_note(case_id, note_text, note_type, user_id)
        
        if not success:
            return create_error_response('Failed to add case note', 500)
        
        logger.info(f"Successfully added case note to case {case_id}")
        return create_success_response({}, 'Case note added successfully'), 201
        
    except GoogleCloudError as e:
        return create_error_response(f"BigQuery error: {str(e)}", 503)
    except Exception as e:
        return create_error_response("Failed to add case note", 500)


@app.route('/cases/<case_id>', methods=['PUT'])
def update_case(case_id: str) -> Tuple[Response, int]:
    """
    Update case fields.
    
    Args:
        case_id: The case ID to update
        
    Returns:
        Tuple[Response, int]: Success or error response
    """
    try:
        data = request.get_json()
        
        if not data:
            return create_error_response('Request body is required', 400)
        
        user_id = get_user_id_from_headers()
        
        logger.info(f"Updating case {case_id} by user {user_id} with fields: {list(data.keys())}")
        
        success = bq_manager.update_case(case_id, data)
        
        if not success:
            return create_error_response('Failed to update case', 500)
        
        logger.info(f"Successfully updated case {case_id}")
        return create_success_response({}, 'Case updated successfully'), 200
        
    except GoogleCloudError as e:
        return create_error_response(f"BigQuery error: {str(e)}", 503)
    except Exception as e:
        return create_error_response("Failed to update case", 500)


@app.route('/persons/search', methods=['GET'])
def search_persons() -> Tuple[Response, int]:
    """
    Search for persons in the BigQuery persons table.
    
    Returns:
        Tuple[Response, int]: Search results or error response
    """
    try:
        query = request.args.get('q', '').strip()
        
        if not query:
            return create_error_response('Query parameter "q" is required', 400)
        
        if len(query) < 2:
            return create_error_response('Query must be at least 2 characters long', 400)
        
        logger.info(f"Searching persons with query: {query}")
        persons = bq_manager.search_persons(query)
        logger.info(f"Found {len(persons)} persons matching query: {query}")
        
        return create_success_response({'persons': persons}), 200
        
    except GoogleCloudError as e:
        return create_error_response(f"BigQuery error: {str(e)}", 503)
    except Exception as e:
        return create_error_response("Failed to search persons", 500)


@app.route('/incidents/<incident_number>/magic-button-data', methods=['GET'])
def get_magic_button_data_by_incident(incident_number: str) -> Tuple[Response, int]:
    """
    Get magic button data for a specific incident number.
    
    Args:
        incident_number: The incident number to retrieve magic button data for
        
    Returns:
        Tuple[Response, int]: Magic button data or error response
    """
    try:
        logger.info(f"Retrieving magic button data for incident {incident_number}")
        magic_data = bq_manager.get_magic_button_data_by_incident_number(incident_number)
        
        if not magic_data:
            return create_error_response('Magic button data not found for this incident', 404)
        
        logger.info(f"Successfully retrieved magic button data for incident {incident_number}")
        return create_success_response(magic_data), 200
        
    except GoogleCloudError as e:
        return create_error_response(f"BigQuery error: {str(e)}", 503)
    except Exception as e:
        return create_error_response("Failed to retrieve magic button data", 500)


@app.route('/incidents/drafts', methods=['GET'])
def get_all_draft_incidents() -> Tuple[Response, int]:
    """
    Get all magic button incidents for draft cases.
    
    Returns:
        Tuple[Response, int]: List of draft incidents or error response
    """
    try:
        logger.info("Retrieving all magic button incidents for draft cases")
        incidents = bq_manager.get_all_magic_button_incidents()
        logger.info(f"Successfully retrieved {len(incidents)} draft incidents")
        
        return create_success_response({'incidents': incidents}), 200
        
    except GoogleCloudError as e:
        return create_error_response(f"BigQuery error: {str(e)}", 503)
    except Exception as e:
        return create_error_response("Failed to retrieve draft incidents", 500)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
