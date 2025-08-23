"""
BigQuery Data Manager for Child Welfare Case Management

This module handles all BigQuery operations for the CCWIS system,
mapping between the BigQuery schema and the application data model.
"""

import os
import logging
from datetime import datetime, date
from typing import Dict, List, Optional, Any
from google.cloud import bigquery
from google.cloud.bigquery import Row

logger = logging.getLogger(__name__)

class BigQueryManager:
    """Handles BigQuery operations for case management."""
    
    def __init__(self):
        self.client = bigquery.Client()
        self.project_id = os.getenv('PROJECT_ID', 'gb-demos')
        self.dataset_id = os.getenv('BIGQUERY_DATASET', 'cw_case_notes')
        
        # Table references
        self.cases_table = f"{self.project_id}.{self.dataset_id}.cases"
        self.people_table = f"{self.project_id}.{self.dataset_id}.people"
        self.case_person_associations_table = f"{self.project_id}.{self.dataset_id}.case_person_associations"
        self.addresses_table = f"{self.project_id}.{self.dataset_id}.addresses"
        self.case_notes_table = f"{self.project_id}.{self.dataset_id}.cw_case_notes"
    
    def get_cases_for_swcm_assignment(self) -> List[Dict[str, Any]]:
        """Get cases that are ready for SWCM assignment (step 4 in workflow)."""
        query = f"""
        SELECT 
            c.case_id,
            c.status,
            c.priority_level,
            c.allegation_type,
            c.allegation_description,
            c.county,
            c.created_date,
            c.last_updated,
            c.created_by,
            -- Get primary child info
            p.first_name as primary_child_first_name,
            p.last_name as primary_child_last_name,
            -- Get case address
            a.street_address,
            a.city,
            a.state,
            a.zipcode
        FROM `{self.cases_table}` c
        LEFT JOIN `{self.case_person_associations_table}` cpa 
            ON c.case_id = cpa.case_id 
            AND cpa.role_in_case = 'child'
            AND cpa.end_date IS NULL
        LEFT JOIN `{self.people_table}` p 
            ON cpa.person_id = p.person_id
        LEFT JOIN `{self.addresses_table}` a 
            ON c.case_id = a.case_id
        WHERE c.status = 'Pending Assignment'
        ORDER BY c.created_date DESC
        """
        
        query_job = self.client.query(query)
        results = query_job.result()
        
        cases = []
        for row in results:
            case_data = self._row_to_case_dict(row)
            cases.append(case_data)
        
        return cases
    
    def get_case_by_id(self, case_id: str) -> Optional[Dict[str, Any]]:
        """Get a complete case with all related data."""
        # Get basic case info
        case_query = f"""
        SELECT 
            c.*,
            a.street_address,
            a.city,
            a.state,
            a.zipcode
        FROM `{self.cases_table}` c
        LEFT JOIN `{self.addresses_table}` a ON c.case_id = a.case_id
        WHERE c.case_id = @case_id
        """
        
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("case_id", "STRING", case_id)
            ]
        )
        
        query_job = self.client.query(case_query, job_config=job_config)
        results = list(query_job.result())
        
        if not results:
            return None
        
        case_row = results[0]
        case_data = self._row_to_case_dict(case_row)
        
        # Get associated persons
        case_data['persons'] = self.get_persons_by_case(case_id)
        
        # Get case notes (timeline events)
        case_data['timeline_events'] = self.get_case_notes_as_timeline(case_id)
        
        # Get case notes in the expected format
        case_data['case_notes'] = self.get_case_notes(case_id)
        
        # Add empty documents array (not implemented in BigQuery schema yet)
        case_data['documents'] = []
        
        return case_data
    
    def get_persons_by_case(self, case_id: str) -> List[Dict[str, Any]]:
        """Get all persons associated with a case."""
        query = f"""
        SELECT 
            p.*,
            cpa.role_in_case,
            cpa.start_date as association_start_date,
            cpa.end_date as association_end_date
        FROM `{self.people_table}` p
        JOIN `{self.case_person_associations_table}` cpa 
            ON p.person_id = cpa.person_id
        WHERE cpa.case_id = @case_id
            AND cpa.end_date IS NULL
        ORDER BY cpa.start_date
        """
        
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("case_id", "STRING", case_id)
            ]
        )
        
        query_job = self.client.query(query, job_config=job_config)
        results = query_job.result()
        
        persons = []
        for row in results:
            person_data = self._row_to_person_dict(row)
            persons.append(person_data)
        
        return persons
    
    def get_case_notes(self, case_id: str) -> List[Dict[str, Any]]:
        """Get case notes for a specific case."""
        query = f"""
        SELECT 
            note,
            note_type,
            visit_date,
            genai_summary,
            version
        FROM `{self.case_notes_table}`
        WHERE case_id = @case_id
        ORDER BY visit_date DESC
        """
        
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("case_id", "STRING", case_id)
            ]
        )
        
        query_job = self.client.query(query, job_config=job_config)
        results = query_job.result()
        
        notes = []
        for row in results:
            note_data = {
                'note_id': f"note_{len(notes) + 1}",  # Generate ID since not in schema
                'text': row.note,
                'created_by': 'System',  # Not in current schema
                'created_date': row.visit_date.isoformat() if row.visit_date else datetime.now().isoformat(),
                'note_type': row.note_type,
                'genai_summary': row.genai_summary
            }
            notes.append(note_data)
        
        return notes
    
    def get_case_notes_as_timeline(self, case_id: str) -> List[Dict[str, Any]]:
        """Convert case notes to timeline events format."""
        query = f"""
        SELECT 
            note,
            note_type,
            visit_date,
            genai_summary
        FROM `{self.case_notes_table}`
        WHERE case_id = @case_id
        ORDER BY visit_date DESC
        """
        
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("case_id", "STRING", case_id)
            ]
        )
        
        query_job = self.client.query(query, job_config=job_config)
        results = query_job.result()
        
        timeline_events = []
        for i, row in enumerate(results):
            event_data = {
                'event_id': f"event_{i + 1}",
                'event_type': 'case_note',
                'title': f"{row.note_type or 'Case Note'}",
                'description': row.note or 'No description available',
                'date': row.visit_date.isoformat() if row.visit_date else datetime.now().isoformat(),
                'created_by': 'System',  # Not in current schema
                'priority': 'medium'
            }
            timeline_events.append(event_data)
        
        return timeline_events
    
    def assign_case_to_swcm(self, case_id: str, assigned_worker: str, assigned_supervisor: str) -> bool:
        """Assign a case to an SWCM worker (step 5 in workflow)."""
        try:
            # Update case status and assignment
            update_query = f"""
            UPDATE `{self.cases_table}`
            SET 
                status = 'Active',
                last_updated = CURRENT_TIMESTAMP()
            WHERE case_id = @case_id
            """
            
            job_config = bigquery.QueryJobConfig(
                query_parameters=[
                    bigquery.ScalarQueryParameter("case_id", "STRING", case_id)
                ]
            )
            
            query_job = self.client.query(update_query, job_config=job_config)
            query_job.result()  # Wait for completion
            
            logger.info(f"Assigned case {case_id} to SWCM {assigned_worker}")
            return True
            
        except Exception as e:
            logger.error(f"Error assigning case {case_id}: {str(e)}")
            return False
    
    def get_cases_by_worker(self, worker_name: str) -> List[Dict[str, Any]]:
        """Get cases assigned to a specific worker."""
        # Note: This requires adding worker assignment fields to the schema
        # For now, return all active cases as a placeholder
        query = f"""
        SELECT 
            c.*,
            a.street_address,
            a.city,
            a.state,
            a.zipcode
        FROM `{self.cases_table}` c
        LEFT JOIN `{self.addresses_table}` a ON c.case_id = a.case_id
        WHERE c.status = 'Active'
        ORDER BY c.created_date DESC
        LIMIT 50
        """
        
        query_job = self.client.query(query)
        results = query_job.result()
        
        cases = []
        for row in results:
            case_data = self._row_to_case_dict(row)
            # Add mock assignment data since not in current schema
            case_data['assigned_worker'] = worker_name
            case_data['assigned_supervisor'] = 'Sarah Williams'
            cases.append(case_data)
        
        return cases
    
    def _row_to_case_dict(self, row: Row) -> Dict[str, Any]:
        """Convert BigQuery row to case dictionary."""
        # Get primary child name
        primary_child = "Unknown Child"
        if hasattr(row, 'primary_child_first_name') and row.primary_child_first_name:
            primary_child = f"{row.primary_child_first_name} {row.primary_child_last_name or ''}".strip()
        
        # Create family name from primary child
        family_name = f"{primary_child.split()[-1] if primary_child != 'Unknown Child' else 'Unknown'} Family"
        
        case_data = {
            'case_id': row.case_id,
            'case_number': f"CASE-{row.case_id}",  # Generate case number from ID
            'status': row.status,
            'priority_level': row.priority_level or 'Medium',
            'primary_child': primary_child,
            'family_name': family_name,
            'allegation_type': row.allegation_type,
            'allegation_description': row.allegation_description,
            'county': row.county,
            'created_date': row.created_date.isoformat() if row.created_date else datetime.now().isoformat(),
            'last_updated': row.last_updated.isoformat() if row.last_updated else datetime.now().isoformat(),
            'created_by': row.created_by or 'System',
            
            # Workflow status - mock data since not in current schema
            'workflow_status': {
                'current_stage': 'swcm_assignment' if row.status == 'Pending Assignment' else 'active_case_management',
                'cpw_reviewed': True,
                'cpw_supervisor_approved': True,
                'swcm_assigned': row.status == 'Active'
            },
            
            # Address info if available
            'address': {
                'street_address': getattr(row, 'street_address', None),
                'city': getattr(row, 'city', None),
                'state': getattr(row, 'state', None),
                'zipcode': getattr(row, 'zipcode', None)
            } if hasattr(row, 'street_address') else None,
            
            # Risk level - mock data since not in current schema
            'risk_level': 'Medium',
            'safety_factors': []
        }
        
        return case_data
    
    def _row_to_person_dict(self, row: Row) -> Dict[str, Any]:
        """Convert BigQuery row to person dictionary."""
        person_data = {
            'person_id': row.person_id,
            'first_name': row.first_name,
            'last_name': row.last_name,
            'date_of_birth': row.date_of_birth.isoformat() if row.date_of_birth else None,
            'role': row.role_in_case if hasattr(row, 'role_in_case') else 'unknown',
            'contact_info': {
                'phone': row.contact_info.phone if row.contact_info and hasattr(row.contact_info, 'phone') else None,
                'email': row.contact_info.email if row.contact_info and hasattr(row.contact_info, 'email') else None,
                'address': row.contact_info.address if row.contact_info and hasattr(row.contact_info, 'address') else None
            },
            'indicators': row.indicators if row.indicators else [],
            'relationship_to_primary_child': self._get_relationship_from_role(row.role_in_case if hasattr(row, 'role_in_case') else 'unknown')
        }
        
        return person_data
    
    def _get_relationship_from_role(self, role: str) -> str:
        """Map role to relationship description."""
        role_mapping = {
            'child': 'Self',
            'parent': 'Parent',
            'caregiver': 'Caregiver',
            'relative': 'Relative',
            'professional': 'Professional'
        }
        return role_mapping.get(role, 'Unknown')
