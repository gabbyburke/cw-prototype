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
from google.cloud import firestore
from google.cloud import bigquery
import google.auth

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Initialize Google Cloud clients
db = firestore.Client(database=os.getenv('FIRESTORE_DATABASE', '(default)'))
bq_client = bigquery.Client()

# Configuration
PROJECT_ID = os.getenv('PROJECT_ID')
BIGQUERY_DATASET = os.getenv('BIGQUERY_DATASET')


class CaseManager:
    """Handles case-related operations."""
    
    def __init__(self):
        self.cases_collection = db.collection('cases')
        self.persons_collection = db.collection('persons')
    
    def create_case(self, case_data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Create a new case."""
        case_id = str(uuid4())
        case_number = self._generate_case_number()
        
        case_doc = {
            'case_id': case_id,
            'case_number': case_number,
            'status': case_data.get('status', 'Open'),
            'priority_level': case_data.get('priority_level', 'Medium'),
            'assigned_worker': case_data.get('assigned_worker', user_id),
            'created_date': datetime.utcnow(),
            'last_updated': datetime.utcnow(),
            'created_by': user_id,
            'referral_id': case_data.get('referral_id'),
            'allegation_type': case_data.get('allegation_type'),
            'case_notes': case_data.get('case_notes', []),
            'involved_persons': case_data.get('involved_persons', [])
        }
        
        # Save to Firestore
        self.cases_collection.document(case_id).set(case_doc)
        
        logger.info(f"Created case {case_number} with ID {case_id}")
        return case_doc
    
    def get_case(self, case_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a case by ID."""
        doc = self.cases_collection.document(case_id).get()
        if doc.exists:
            case_data = doc.to_dict()
            case_data['case_id'] = doc.id
            return case_data
        return None
    
    def update_case(self, case_id: str, updates: Dict[str, Any], user_id: str) -> bool:
        """Update an existing case."""
        case_ref = self.cases_collection.document(case_id)
        
        # Check if case exists
        if not case_ref.get().exists:
            return False
        
        # Add metadata to updates
        updates['last_updated'] = datetime.utcnow()
        updates['updated_by'] = user_id
        
        # Update the document
        case_ref.update(updates)
        
        logger.info(f"Updated case {case_id}")
        return True
    
    def list_cases(self, assigned_worker: Optional[str] = None, 
                   status: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """List cases with optional filters."""
        query = self.cases_collection
        
        if assigned_worker:
            query = query.where('assigned_worker', '==', assigned_worker)
        
        if status:
            query = query.where('status', '==', status)
        
        query = query.order_by('created_date', direction=firestore.Query.DESCENDING).limit(limit)
        
        cases = []
        for doc in query.stream():
            case_data = doc.to_dict()
            case_data['case_id'] = doc.id
            cases.append(case_data)
        
        return cases
    
    def add_case_note(self, case_id: str, note_text: str, user_id: str) -> bool:
        """Add a note to a case."""
        case_ref = self.cases_collection.document(case_id)
        
        # Check if case exists
        case_doc = case_ref.get()
        if not case_doc.exists:
            return False
        
        note = {
            'note_id': str(uuid4()),
            'text': note_text,
            'created_by': user_id,
            'created_date': datetime.utcnow()
        }
        
        # Add note to the case
        case_ref.update({
            'case_notes': firestore.ArrayUnion([note]),
            'last_updated': datetime.utcnow()
        })
        
        logger.info(f"Added note to case {case_id}")
        return True
    
    def _generate_case_number(self) -> str:
        """Generate a unique case number."""
        # Simple implementation - in production, this would follow agency standards
        timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        return f"CASE-{timestamp}"


class PersonManager:
    """Handles person-related operations."""
    
    def __init__(self):
        self.persons_collection = db.collection('persons')
    
    def create_person(self, person_data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Create a new person record."""
        person_id = str(uuid4())
        
        person_doc = {
            'person_id': person_id,
            'first_name': person_data.get('first_name'),
            'last_name': person_data.get('last_name'),
            'date_of_birth': person_data.get('date_of_birth'),
            'role': person_data.get('role'),  # child, parent, caregiver, etc.
            'case_id': person_data.get('case_id'),
            'contact_info': person_data.get('contact_info', {}),
            'created_date': datetime.utcnow(),
            'created_by': user_id,
            'last_updated': datetime.utcnow()
        }
        
        # Save to Firestore
        self.persons_collection.document(person_id).set(person_doc)
        
        logger.info(f"Created person {person_id}")
        return person_doc
    
    def get_person(self, person_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a person by ID."""
        doc = self.persons_collection.document(person_id).get()
        if doc.exists:
            person_data = doc.to_dict()
            person_data['person_id'] = doc.id
            return person_data
        return None
    
    def list_persons_by_case(self, case_id: str) -> List[Dict[str, Any]]:
        """List all persons associated with a case."""
        query = self.persons_collection.where('case_id', '==', case_id)
        
        persons = []
        for doc in query.stream():
            person_data = doc.to_dict()
            person_data['person_id'] = doc.id
            persons.append(person_data)
        
        return persons


# Initialize managers
case_manager = CaseManager()
person_manager = PersonManager()


def get_user_id_from_headers() -> str:
    """Extract user ID from IAP headers."""
    # In a real implementation, this would extract from X-Goog-Authenticated-User-Email
    return request.headers.get('X-Goog-Authenticated-User-Email', 'system@example.com')


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'service': 'core-case-mgmt'}), 200


@app.route('/cases', methods=['POST'])
def create_case():
    """Create a new case."""
    try:
        user_id = get_user_id_from_headers()
        case_data = request.get_json()
        
        if not case_data:
            return jsonify({'error': 'No case data provided'}), 400
        
        case = case_manager.create_case(case_data, user_id)
        
        # Convert datetime objects to strings for JSON serialization
        case['created_date'] = case['created_date'].isoformat()
        case['last_updated'] = case['last_updated'].isoformat()
        
        return jsonify(case), 201
        
    except Exception as e:
        logger.error(f"Error creating case: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/cases/<case_id>', methods=['GET'])
def get_case(case_id: str):
    """Get a specific case."""
    try:
        case = case_manager.get_case(case_id)
        
        if not case:
            return jsonify({'error': 'Case not found'}), 404
        
        # Convert datetime objects to strings for JSON serialization
        if 'created_date' in case:
            case['created_date'] = case['created_date'].isoformat()
        if 'last_updated' in case:
            case['last_updated'] = case['last_updated'].isoformat()
        
        return jsonify(case), 200
        
    except Exception as e:
        logger.error(f"Error retrieving case {case_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/cases', methods=['GET'])
def list_cases():
    """List cases with optional filters."""
    try:
        assigned_worker = request.args.get('assigned_worker')
        status = request.args.get('status')
        limit = int(request.args.get('limit', 50))
        
        cases = case_manager.list_cases(assigned_worker, status, limit)
        
        # Convert datetime objects to strings for JSON serialization
        for case in cases:
            if 'created_date' in case:
                case['created_date'] = case['created_date'].isoformat()
            if 'last_updated' in case:
                case['last_updated'] = case['last_updated'].isoformat()
        
        return jsonify({'cases': cases}), 200
        
    except Exception as e:
        logger.error(f"Error listing cases: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/cases/<case_id>/notes', methods=['POST'])
def add_case_note(case_id: str):
    """Add a note to a case."""
    try:
        user_id = get_user_id_from_headers()
        data = request.get_json()
        
        if not data or 'note_text' not in data:
            return jsonify({'error': 'Note text is required'}), 400
        
        success = case_manager.add_case_note(case_id, data['note_text'], user_id)
        
        if not success:
            return jsonify({'error': 'Case not found'}), 404
        
        return jsonify({'message': 'Note added successfully'}), 201
        
    except Exception as e:
        logger.error(f"Error adding note to case {case_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/persons', methods=['POST'])
def create_person():
    """Create a new person."""
    try:
        user_id = get_user_id_from_headers()
        person_data = request.get_json()
        
        if not person_data:
            return jsonify({'error': 'No person data provided'}), 400
        
        person = person_manager.create_person(person_data, user_id)
        
        # Convert datetime objects to strings for JSON serialization
        person['created_date'] = person['created_date'].isoformat()
        person['last_updated'] = person['last_updated'].isoformat()
        
        return jsonify(person), 201
        
    except Exception as e:
        logger.error(f"Error creating person: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/persons/<person_id>', methods=['GET'])
def get_person(person_id: str):
    """Get a specific person."""
    try:
        person = person_manager.get_person(person_id)
        
        if not person:
            return jsonify({'error': 'Person not found'}), 404
        
        # Convert datetime objects to strings for JSON serialization
        if 'created_date' in person:
            person['created_date'] = person['created_date'].isoformat()
        if 'last_updated' in person:
            person['last_updated'] = person['last_updated'].isoformat()
        
        return jsonify(person), 200
        
    except Exception as e:
        logger.error(f"Error retrieving person {person_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/cases/<case_id>/persons', methods=['GET'])
def list_case_persons(case_id: str):
    """List all persons associated with a case."""
    try:
        persons = person_manager.list_persons_by_case(case_id)
        
        # Convert datetime objects to strings for JSON serialization
        for person in persons:
            if 'created_date' in person:
                person['created_date'] = person['created_date'].isoformat()
            if 'last_updated' in person:
                person['last_updated'] = person['last_updated'].isoformat()
        
        return jsonify({'persons': persons}), 200
        
    except Exception as e:
        logger.error(f"Error listing persons for case {case_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
