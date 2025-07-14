"""
Referral & Intake API

This service handles the initial intake of referrals and screening process
in the Child Welfare Information System (CCWIS).
"""

import os
import logging
import json
from datetime import datetime
from typing import Dict, List, Optional, Any
from uuid import uuid4

from flask import Flask, request, jsonify
from google.cloud import firestore
from google.cloud import pubsub_v1
import google.auth
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Initialize Google Cloud clients
db = firestore.Client(database=os.getenv('FIRESTORE_DATABASE', '(default)'))
publisher = pubsub_v1.PublisherClient()

# Configuration
PROJECT_ID = os.getenv('PROJECT_ID')
CORE_CASE_MGMT_API_URL = os.getenv('CORE_CASE_MGMT_API_URL')


class ReferralManager:
    """Handles referral-related operations."""
    
    def __init__(self):
        self.referrals_collection = db.collection('referrals')
    
    def create_referral(self, referral_data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Create a new referral."""
        referral_id = str(uuid4())
        
        referral_doc = {
            'referral_id': referral_id,
            'referral_date': datetime.utcnow(),
            'referral_source': referral_data.get('referral_source'),
            'referrer_name': referral_data.get('referrer_name'),
            'referrer_contact': referral_data.get('referrer_contact'),
            'allegation_type': referral_data.get('allegation_type'),
            'allegation_description': referral_data.get('allegation_description'),
            'child_name': referral_data.get('child_name'),
            'child_age': referral_data.get('child_age'),
            'child_address': referral_data.get('child_address'),
            'parent_guardian_name': referral_data.get('parent_guardian_name'),
            'parent_guardian_contact': referral_data.get('parent_guardian_contact'),
            'screening_decision': 'Pending',  # Initial status
            'priority_level': self._assess_priority(referral_data),
            'assigned_worker': referral_data.get('assigned_worker'),
            'created_by': user_id,
            'created_date': datetime.utcnow(),
            'last_updated': datetime.utcnow(),
            'case_id': None,  # Will be set if promoted to case
            'screening_notes': []
        }
        
        # Save to Firestore
        self.referrals_collection.document(referral_id).set(referral_doc)
        
        logger.info(f"Created referral {referral_id}")
        return referral_doc
    
    def get_referral(self, referral_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a referral by ID."""
        doc = self.referrals_collection.document(referral_id).get()
        if doc.exists:
            referral_data = doc.to_dict()
            referral_data['referral_id'] = doc.id
            return referral_data
        return None
    
    def update_referral(self, referral_id: str, updates: Dict[str, Any], user_id: str) -> bool:
        """Update an existing referral."""
        referral_ref = self.referrals_collection.document(referral_id)
        
        # Check if referral exists
        if not referral_ref.get().exists:
            return False
        
        # Add metadata to updates
        updates['last_updated'] = datetime.utcnow()
        updates['updated_by'] = user_id
        
        # Update the document
        referral_ref.update(updates)
        
        logger.info(f"Updated referral {referral_id}")
        return True
    
    def list_referrals(self, assigned_worker: Optional[str] = None, 
                      screening_decision: Optional[str] = None, 
                      limit: int = 50) -> List[Dict[str, Any]]:
        """List referrals with optional filters."""
        query = self.referrals_collection
        
        if assigned_worker:
            query = query.where('assigned_worker', '==', assigned_worker)
        
        if screening_decision:
            query = query.where('screening_decision', '==', screening_decision)
        
        query = query.order_by('referral_date', direction=firestore.Query.DESCENDING).limit(limit)
        
        referrals = []
        for doc in query.stream():
            referral_data = doc.to_dict()
            referral_data['referral_id'] = doc.id
            referrals.append(referral_data)
        
        return referrals
    
    def screen_referral(self, referral_id: str, decision: str, notes: str, user_id: str) -> bool:
        """Make a screening decision on a referral."""
        referral_ref = self.referrals_collection.document(referral_id)
        
        # Check if referral exists
        referral_doc = referral_ref.get()
        if not referral_doc.exists:
            return False
        
        screening_note = {
            'note_id': str(uuid4()),
            'decision': decision,
            'notes': notes,
            'screened_by': user_id,
            'screening_date': datetime.utcnow()
        }
        
        # Update referral with screening decision
        referral_ref.update({
            'screening_decision': decision,
            'screening_notes': firestore.ArrayUnion([screening_note]),
            'last_updated': datetime.utcnow(),
            'screened_by': user_id,
            'screening_date': datetime.utcnow()
        })
        
        # If accepted for investigation, publish event to create case
        if decision.lower() == 'accept':
            self._publish_referral_accepted_event(referral_id)
        
        logger.info(f"Screened referral {referral_id} with decision: {decision}")
        return True
    
    def _assess_priority(self, referral_data: Dict[str, Any]) -> str:
        """Assess the priority level of a referral based on allegation type."""
        allegation_type = referral_data.get('allegation_type', '').lower()
        
        # Simple priority assessment - in production, this would be more sophisticated
        high_priority_types = ['physical abuse', 'sexual abuse', 'severe neglect']
        medium_priority_types = ['neglect', 'emotional abuse']
        
        if any(priority_type in allegation_type for priority_type in high_priority_types):
            return 'High'
        elif any(priority_type in allegation_type for priority_type in medium_priority_types):
            return 'Medium'
        else:
            return 'Low'
    
    def _publish_referral_accepted_event(self, referral_id: str):
        """Publish an event when a referral is accepted for investigation."""
        try:
            topic_path = publisher.topic_path(PROJECT_ID, f"{os.getenv('PROJECT_BASE_NAME', 'ccwis')}{os.getenv('UNIQUE_ID', '')}-{os.getenv('ENV', 'dev')}-referral-events")
            
            event_data = {
                'event_type': 'referral_accepted',
                'referral_id': referral_id,
                'timestamp': datetime.utcnow().isoformat()
            }
            
            # Publish the message
            future = publisher.publish(topic_path, json.dumps(event_data).encode('utf-8'))
            message_id = future.result()
            
            logger.info(f"Published referral accepted event for {referral_id}, message ID: {message_id}")
            
        except Exception as e:
            logger.error(f"Failed to publish referral accepted event: {str(e)}")


# Initialize manager
referral_manager = ReferralManager()


def get_user_id_from_headers() -> str:
    """Extract user ID from IAP headers."""
    # In a real implementation, this would extract from X-Goog-Authenticated-User-Email
    return request.headers.get('X-Goog-Authenticated-User-Email', 'system@example.com')


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'service': 'referral-intake'}), 200


@app.route('/referrals', methods=['POST'])
def create_referral():
    """Create a new referral."""
    try:
        user_id = get_user_id_from_headers()
        referral_data = request.get_json()
        
        if not referral_data:
            return jsonify({'error': 'No referral data provided'}), 400
        
        # Validate required fields
        required_fields = ['referral_source', 'allegation_type', 'child_name']
        for field in required_fields:
            if not referral_data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        referral = referral_manager.create_referral(referral_data, user_id)
        
        # Convert datetime objects to strings for JSON serialization
        referral['referral_date'] = referral['referral_date'].isoformat()
        referral['created_date'] = referral['created_date'].isoformat()
        referral['last_updated'] = referral['last_updated'].isoformat()
        
        return jsonify(referral), 201
        
    except Exception as e:
        logger.error(f"Error creating referral: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/referrals/<referral_id>', methods=['GET'])
def get_referral(referral_id: str):
    """Get a specific referral."""
    try:
        referral = referral_manager.get_referral(referral_id)
        
        if not referral:
            return jsonify({'error': 'Referral not found'}), 404
        
        # Convert datetime objects to strings for JSON serialization
        if 'referral_date' in referral:
            referral['referral_date'] = referral['referral_date'].isoformat()
        if 'created_date' in referral:
            referral['created_date'] = referral['created_date'].isoformat()
        if 'last_updated' in referral:
            referral['last_updated'] = referral['last_updated'].isoformat()
        if 'screening_date' in referral and referral['screening_date']:
            referral['screening_date'] = referral['screening_date'].isoformat()
        
        return jsonify(referral), 200
        
    except Exception as e:
        logger.error(f"Error retrieving referral {referral_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/referrals', methods=['GET'])
def list_referrals():
    """List referrals with optional filters."""
    try:
        assigned_worker = request.args.get('assigned_worker')
        screening_decision = request.args.get('screening_decision')
        limit = int(request.args.get('limit', 50))
        
        referrals = referral_manager.list_referrals(assigned_worker, screening_decision, limit)
        
        # Convert datetime objects to strings for JSON serialization
        for referral in referrals:
            if 'referral_date' in referral:
                referral['referral_date'] = referral['referral_date'].isoformat()
            if 'created_date' in referral:
                referral['created_date'] = referral['created_date'].isoformat()
            if 'last_updated' in referral:
                referral['last_updated'] = referral['last_updated'].isoformat()
            if 'screening_date' in referral and referral['screening_date']:
                referral['screening_date'] = referral['screening_date'].isoformat()
        
        return jsonify({'referrals': referrals}), 200
        
    except Exception as e:
        logger.error(f"Error listing referrals: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/referrals/<referral_id>/screen', methods=['POST'])
def screen_referral(referral_id: str):
    """Make a screening decision on a referral."""
    try:
        user_id = get_user_id_from_headers()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No screening data provided'}), 400
        
        decision = data.get('decision')
        notes = data.get('notes', '')
        
        if not decision:
            return jsonify({'error': 'Screening decision is required'}), 400
        
        # Validate decision values
        valid_decisions = ['Accept', 'Reject', 'Information Only']
        if decision not in valid_decisions:
            return jsonify({'error': f'Invalid decision. Must be one of: {valid_decisions}'}), 400
        
        success = referral_manager.screen_referral(referral_id, decision, notes, user_id)
        
        if not success:
            return jsonify({'error': 'Referral not found'}), 404
        
        return jsonify({'message': 'Referral screened successfully', 'decision': decision}), 200
        
    except Exception as e:
        logger.error(f"Error screening referral {referral_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/referrals/<referral_id>/assign', methods=['POST'])
def assign_referral(referral_id: str):
    """Assign a referral to a worker."""
    try:
        user_id = get_user_id_from_headers()
        data = request.get_json()
        
        if not data or 'assigned_worker' not in data:
            return jsonify({'error': 'Assigned worker is required'}), 400
        
        updates = {
            'assigned_worker': data['assigned_worker']
        }
        
        success = referral_manager.update_referral(referral_id, updates, user_id)
        
        if not success:
            return jsonify({'error': 'Referral not found'}), 404
        
        return jsonify({'message': 'Referral assigned successfully'}), 200
        
    except Exception as e:
        logger.error(f"Error assigning referral {referral_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
