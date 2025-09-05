"""
Court Document Processor API

AI-powered court document processing using Google Gemini 2.5 Flash.
Extracts structured data from court documents for child welfare cases.
"""

import os
import base64
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
import tempfile
import uuid
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize Gemini client
def get_gemini_client():
    """Initialize and return Gemini client."""
    try:
        client = genai.Client(
            vertexai=True,
            project=os.getenv('PROJECT_ID', 'gb-demos'),
            location="global",
        )
        return client
    except Exception as e:
        logger.error(f"Failed to initialize Gemini client: {str(e)}")
        raise

# System instruction for court document processing
COURT_EXTRACTION_PROMPT = """You are an expert data extractor who works in the child welfare system as it relates to courts. When prompted by the user, you review court documentation and pull relevant fields into structured JSON format like the following example: {
 "caseId": "YYYYMM999999",
 "courtDetails": {
  "caseMembers": [
   {
    "name": "Child One Name",
    "courtType": "CINA",
    "docketNumber": "JVJV243715",
    "initialCourtOrderUrl": null
   },
   {
    "name": "Child Two Name",
    "courtType": "CINA",
    "docketNumber": "JVJV243716",
    "initialCourtOrderUrl": null
   }
  ]
 },
 "courtProfessionals": {
  "judge": {
   "name": "Korie Talkington",
   "title": "District Associate Judge"
  },
  "countyAttorney": {
   "name": "Elizabeth Cervantes",
   "title": "Assistant County Attorney"
  },
  "attorneys": [
   {
    "name": "Jennifer Olsen",
    "represents": "Mother"
   },
   {
    "name": "Barbara Maness",
    "represents": "Father"
   }
  ],
  "guardianAdLitem": {
   "name": "Patricia Rolfstad"
  },
  "intervenors": [],
  "casas": []
 },
 "courtHearingOrder": {
  "hearingDateTime": "2020-10-14T11:22:00Z",
  "location": "Iowa District Court, Scott County (via GoToMeeting)",
  "hearingType": "Removal Order",
  "reasonsForAdjudication": [
   "Inadequate Nutrition",
   "Neglect",
   "Parental Substance Abuse"
  ],
  "dispositionModification": "N/A",
  "permanencyGoal": null,
  "legalStatus": "Temporary Custody",
  "legalCustody": "Department of Human Services",
  "underAppeal": false,
  "abilityToGiveConsent": null,
  "guardianship": null
 },
 "upcomingCourtHearings": [
  {
   "nextCourtDate": null,
   "nextHearingType": null,
   "location": null,
   "startTime": null,
   "endTime": null,
   "duration": null
  }
 ]
}

Please extract all available information from the court document and return it in this exact JSON format. If a field is not available in the document, set it to null. Ensure all dates are in ISO 8601 format."""

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'court-document-processor',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/process-court-document', methods=['POST'])
def process_court_document():
    """
    Process uploaded court document using Gemini AI.
    
    Expects multipart/form-data with:
    - file: Court document (PDF, image, etc.)
    - case_id: Optional case ID for context
    
    Returns:
    - Structured JSON with extracted court information
    - Processing metadata including confidence scores
    """
    try:
        # Validate request
        if 'file' not in request.files:
            return jsonify({
                'error': 'No file provided',
                'message': 'Please upload a court document file'
            }), 400
        
        file = request.files['file']
        case_id = request.form.get('case_id', None)
        
        if file.filename == '':
            return jsonify({
                'error': 'No file selected',
                'message': 'Please select a file to upload'
            }), 400
        
        # Validate file type
        allowed_extensions = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif'}
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            return jsonify({
                'error': 'Invalid file type',
                'message': f'Supported formats: {", ".join(allowed_extensions)}',
                'received': file_ext
            }), 400
        
        # Read and encode file
        file_content = file.read()
        file_base64 = base64.b64encode(file_content).decode('utf-8')
        
        # Determine MIME type
        mime_type_map = {
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.tiff': 'image/tiff',
            '.bmp': 'image/bmp',
            '.gif': 'image/gif'
        }
        mime_type = mime_type_map.get(file_ext, 'application/octet-stream')
        
        logger.info(f"Processing court document: {file.filename} ({len(file_content)} bytes)")
        
        # Process with Gemini
        extracted_data = process_with_gemini(file_base64, mime_type, case_id)
        
        # Generate processing metadata
        processing_id = str(uuid.uuid4())
        metadata = {
            'processing_id': processing_id,
            'filename': file.filename,
            'file_size': len(file_content),
            'mime_type': mime_type,
            'processed_at': datetime.utcnow().isoformat(),
            'case_id': case_id,
            'ai_model': 'gemini-2.5-flash'
        }
        
        return jsonify({
            'success': True,
            'data': extracted_data,
            'metadata': metadata,
            'message': 'Court document processed successfully'
        })
        
    except Exception as e:
        logger.error(f"Error processing court document: {str(e)}")
        return jsonify({
            'error': 'Processing failed',
            'message': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

def process_with_gemini(file_base64: str, mime_type: str, case_id: str = None):
    """
    Process document with Gemini AI.
    
    Args:
        file_base64: Base64 encoded file content
        mime_type: MIME type of the file
        case_id: Optional case ID for context
    
    Returns:
        Extracted court data as dictionary
    """
    try:
        client = get_gemini_client()
        
        # Prepare content for Gemini
        parts = [
            types.Part.from_text(text="Please extract court information from this document and return it in the specified JSON format."),
            types.Part.from_bytes(data=base64.b64decode(file_base64), mime_type=mime_type)
        ]
        
        # Add case context if provided
        if case_id:
            parts.insert(1, types.Part.from_text(text=f"This document is for case ID: {case_id}"))
        
        contents = [
            types.Content(
                role="user",
                parts=parts
            )
        ]
        
        # Configure generation
        generate_content_config = types.GenerateContentConfig(
            temperature=0.1,  # Low temperature for consistent extraction
            top_p=0.8,
            max_output_tokens=8192,
            safety_settings=[
                types.SafetySetting(
                    category="HARM_CATEGORY_HATE_SPEECH",
                    threshold="OFF"
                ),
                types.SafetySetting(
                    category="HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold="OFF"
                ),
                types.SafetySetting(
                    category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold="OFF"
                ),
                types.SafetySetting(
                    category="HARM_CATEGORY_HARASSMENT",
                    threshold="OFF"
                )
            ],
            system_instruction=[types.Part.from_text(text=COURT_EXTRACTION_PROMPT)]
        )
        
        # Generate content
        logger.info("Sending document to Gemini for processing...")
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=generate_content_config
        )
        
        # Extract and parse response
        response_text = response.text.strip()
        logger.info(f"Received response from Gemini: {len(response_text)} characters")
        
        # Try to extract JSON from response
        try:
            # Look for JSON in the response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_text = response_text[json_start:json_end]
                extracted_data = json.loads(json_text)
                
                # Add confidence scoring based on completeness
                confidence_score = calculate_confidence_score(extracted_data)
                extracted_data['_metadata'] = {
                    'confidence_score': confidence_score,
                    'extraction_method': 'gemini-ai',
                    'raw_response_length': len(response_text)
                }
                
                return extracted_data
            else:
                raise ValueError("No valid JSON found in response")
                
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {str(e)}")
            logger.error(f"Response text: {response_text[:500]}...")
            raise ValueError(f"Invalid JSON response from AI: {str(e)}")
        
    except Exception as e:
        logger.error(f"Gemini processing failed: {str(e)}")
        raise

def calculate_confidence_score(data: dict) -> float:
    """
    Calculate confidence score based on data completeness.
    
    Args:
        data: Extracted court data
    
    Returns:
        Confidence score between 0.0 and 1.0
    """
    try:
        total_fields = 0
        filled_fields = 0
        
        def count_fields(obj, path=""):
            nonlocal total_fields, filled_fields
            
            if isinstance(obj, dict):
                for key, value in obj.items():
                    if key.startswith('_'):  # Skip metadata fields
                        continue
                    total_fields += 1
                    if value is not None and value != "" and value != []:
                        filled_fields += 1
                        if isinstance(value, (dict, list)):
                            count_fields(value, f"{path}.{key}")
            elif isinstance(obj, list):
                for item in obj:
                    if isinstance(item, (dict, list)):
                        count_fields(item, path)
        
        count_fields(data)
        
        if total_fields == 0:
            return 0.0
        
        base_score = filled_fields / total_fields
        
        # Boost score for critical fields
        critical_fields = [
            'courtDetails.caseMembers',
            'courtProfessionals.judge',
            'courtHearingOrder.hearingDateTime',
            'courtHearingOrder.hearingType'
        ]
        
        critical_bonus = 0.0
        for field_path in critical_fields:
            if has_nested_value(data, field_path):
                critical_bonus += 0.05
        
        final_score = min(1.0, base_score + critical_bonus)
        return round(final_score, 2)
        
    except Exception as e:
        logger.error(f"Error calculating confidence score: {str(e)}")
        return 0.5  # Default moderate confidence

def has_nested_value(obj: dict, path: str) -> bool:
    """Check if nested path has a non-null value."""
    try:
        keys = path.split('.')
        current = obj
        for key in keys:
            if isinstance(current, dict) and key in current:
                current = current[key]
            else:
                return False
        return current is not None and current != "" and current != []
    except:
        return False

@app.errorhandler(413)
def file_too_large(error):
    """Handle file too large errors."""
    return jsonify({
        'error': 'File too large',
        'message': 'Please upload a file smaller than 10MB',
        'max_size': '10MB'
    }), 413

@app.errorhandler(500)
def internal_error(error):
    """Handle internal server errors."""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred while processing your request',
        'timestamp': datetime.utcnow().isoformat()
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
