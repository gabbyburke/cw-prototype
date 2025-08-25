"""
BigQuery Data Manager for Child Welfare Case Management

Simple, focused BigQuery operations for the CCWIS system.
"""

import os
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from google.cloud import bigquery
from google.cloud.exceptions import GoogleCloudError

logger = logging.getLogger(__name__)

class BigQueryManager:
    """Simple BigQuery operations for case management."""
    
    def __init__(self):
        """Initialize BigQuery manager."""
        self.project_id = os.getenv('PROJECT_ID')
        self.dataset_id = os.getenv('BIGQUERY_DATASET')
        
        if not self.project_id:
            raise ValueError("PROJECT_ID environment variable is required")
        if not self.dataset_id:
            raise ValueError("BIGQUERY_DATASET environment variable is required")
        
        try:
            self.client = bigquery.Client(project=self.project_id)
            logger.info(f"BigQuery client initialized for project {self.project_id}")
        except Exception as e:
            logger.error(f"Failed to initialize BigQuery client: {str(e)}")
            raise GoogleCloudError(f"BigQuery initialization failed: {str(e)}")
        
        # Table references - constructed dynamically from environment variables
        self.cases_table = f"{self.project_id}.{self.dataset_id}.cases"
        self.people_table = f"{self.project_id}.{self.dataset_id}.people"
        self.case_person_associations_table = f"{self.project_id}.{self.dataset_id}.case_person_associations"
        self.addresses_table = f"{self.project_id}.{self.dataset_id}.addresses"
        self.case_notes_table = f"{self.project_id}.{self.dataset_id}.case_notes"
    
    def _get_case_with_related_data(self, case_id: str) -> Optional[Dict[str, Any]]:
        """Private helper: Get case with all related data using efficient JOINs."""
        # First get the basic case data
        case_query = f"""
        SELECT 
            c.case_id,
            c.case_display_name,
            c.status,
            c.priority_level,
            c.allegation_type,
            c.allegation_description,
            c.county,
            c.created_date,
            c.last_updated,
            c.created_by,
            c.swcm,
            c.swcm_supervisor
        FROM `{self.cases_table}` c
        WHERE c.case_id = @case_id
        """
        
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("case_id", "STRING", str(case_id))
            ]
        )
        
        query_job = self.client.query(case_query, job_config=job_config)
        case_results = list(query_job.result())
        
        if not case_results:
            return None
        
        case_row = case_results[0]
        
        # Build the base case data structure
        case_data = self._build_case_data_structure(case_row)
        
        # Get all related data in two efficient queries
        case_data['persons'] = self._get_persons_for_case_optimized(case_id)
        case_data['timeline_events'], case_data['case_notes'] = self._get_case_notes_optimized(case_id)
        case_data['documents'] = []
        
        return case_data
    
    def _build_case_data_structure(self, case_row, include_workflow_status: bool = True) -> Dict[str, Any]:
        """Private helper: Build standardized case data structure."""
        case_data = {
            'case_id': case_row.case_id,
            'case_number': f"CASE-{case_row.case_id}",
            'case_display_name': case_row.case_display_name or f"Case {case_row.case_id}",
            'status': case_row.status,
            'priority_level': case_row.priority_level or 'Medium',
            'allegation_type': case_row.allegation_type,
            'allegation_description': case_row.allegation_description,
            'county': case_row.county,
            'created_date': case_row.created_date.isoformat() if case_row.created_date else datetime.now().isoformat(),
            'last_updated': case_row.last_updated.isoformat() if case_row.last_updated else datetime.now().isoformat(),
            'created_by': case_row.created_by or 'System',
            'assigned_worker': case_row.swcm,
            'assigned_supervisor': case_row.swcm_supervisor
        }
        
        if include_workflow_status:
            case_data['workflow_status'] = {
                'current_stage': 'swcm_assignment' if case_row.status == 'Pending Assignment' else 'active_case_management',
                'cpw_reviewed': True,
                'cpw_supervisor_approved': True,
                'swcm_assigned': case_row.status == 'Active'
            }
        
        return case_data
    
    def _get_persons_for_case_optimized(self, case_id: str) -> List[Dict[str, Any]]:
        """Private helper: Get persons for a case with optimized query."""
        query = f"""
        SELECT 
            p.person_id,
            p.first_name,
            p.last_name,
            p.date_of_birth,
            cpa.role_in_case
        FROM `{self.people_table}` p
        JOIN `{self.case_person_associations_table}` cpa 
            ON p.person_id = cpa.person_id
        WHERE cpa.case_id = @case_id
            AND cpa.end_date IS NULL
        ORDER BY cpa.start_date
        """
        
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("case_id", "STRING", str(case_id))
            ]
        )
        
        try:
            query_job = self.client.query(query, job_config=job_config)
            results = query_job.result()
            
            persons = []
            for row in results:
                person_data = {
                    'person_id': row.person_id,
                    'first_name': row.first_name,
                    'last_name': row.last_name,
                    'date_of_birth': row.date_of_birth.isoformat() if row.date_of_birth else None,
                    'role': row.role_in_case,
                    'contact_info': {},
                    'indicators': [],
                    'relationship_to_primary_child': row.role_in_case
                }
                persons.append(person_data)
            
            return persons
            
        except Exception as e:
            logger.error(f"Failed to retrieve persons for case {case_id}: {str(e)}")
            return []
    
    def _get_case_notes_optimized(self, case_id: str) -> tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """Private helper: Get case notes and timeline events in one query."""
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
                bigquery.ScalarQueryParameter("case_id", "STRING", str(case_id))
            ]
        )
        
        try:
            query_job = self.client.query(query, job_config=job_config)
            results = query_job.result()
            
            timeline_events = []
            case_notes = []
            
            for i, row in enumerate(results):
                # Build timeline event
                event_data = {
                    'event_id': f"event_{i + 1}",
                    'event_type': 'case_note',
                    'title': f"{row.note_type or 'Case Note'}",
                    'description': row.note or 'No description available',
                    'date': row.visit_date.isoformat() if row.visit_date else datetime.now().isoformat(),
                    'created_by': 'System',
                    'priority': 'medium'
                }
                timeline_events.append(event_data)
                
                # Build case note
                note_data = {
                    'note_id': f"note_{i + 1}",
                    'text': row.note,
                    'created_by': 'System',
                    'created_date': row.visit_date.isoformat() if row.visit_date else datetime.now().isoformat(),
                    'note_type': row.note_type,
                    'genai_summary': row.genai_summary
                }
                case_notes.append(note_data)
            
            return timeline_events, case_notes
            
        except Exception as e:
            logger.error(f"Failed to retrieve case notes for case {case_id}: {str(e)}")
            return [], []
    
    def get_cases_for_swcm_assignment(self) -> List[Dict[str, Any]]:
        """Get cases pending SWCM assignment."""
        query = f"""
        SELECT 
            c.case_id,
            c.case_display_name,
            c.status,
            c.priority_level,
            c.allegation_type,
            c.allegation_description,
            c.county,
            c.created_date,
            c.last_updated,
            c.created_by,
            c.swcm,
            c.swcm_supervisor
        FROM `{self.cases_table}` c
        WHERE c.status = 'Pending Assignment'
        ORDER BY c.created_date DESC
        """
        
        try:
            query_job = self.client.query(query)
            results = query_job.result()
            
            cases = []
            for row in results:
                case_data = self._build_case_data_structure(row)
                # Override workflow status for SWCM assignment cases
                case_data['workflow_status']['current_stage'] = 'swcm_assignment'
                case_data['workflow_status']['swcm_assigned'] = False
                cases.append(case_data)
            
            logger.info(f"Retrieved {len(cases)} cases for SWCM assignment")
            return cases
            
        except Exception as e:
            logger.error(f"Failed to retrieve cases for SWCM assignment: {str(e)}")
            raise GoogleCloudError(f"Query failed: {str(e)}")
    
    def get_case_by_id(self, case_id: str) -> Optional[Dict[str, Any]]:
        """Get a case by ID with all related data in optimized queries."""
        try:
            # Get case data with all related information in one efficient query
            case_data = self._get_case_with_related_data(case_id)
            
            if not case_data:
                logger.warning(f"Case not found: {case_id}")
                return None
            
            logger.info(f"Retrieved case: {case_id}")
            return case_data
            
        except Exception as e:
            logger.error(f"Failed to retrieve case {case_id}: {str(e)}")
            raise GoogleCloudError(f"Query failed: {str(e)}")
    
    def get_cases_by_worker(self, worker_name: str) -> List[Dict[str, Any]]:
        """Get cases assigned to a worker."""
        query = f"""
        SELECT 
            c.case_id,
            c.case_display_name,
            c.status,
            c.priority_level,
            c.allegation_type,
            c.allegation_description,
            c.county,
            c.created_date,
            c.last_updated,
            c.created_by,
            c.swcm,
            c.swcm_supervisor
        FROM `{self.cases_table}` c
        WHERE c.swcm = @worker_name OR (c.swcm IS NULL AND @worker_name = 'unassigned')
        ORDER BY c.created_date DESC
        """
        
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("worker_name", "STRING", worker_name)
            ]
        )
        
        try:
            query_job = self.client.query(query, job_config=job_config)
            results = query_job.result()
            
            cases = []
            for row in results:
                case_data = self._build_case_data_structure(row)
                cases.append(case_data)
            
            logger.info(f"Retrieved {len(cases)} cases for worker: {worker_name}")
            return cases
            
        except Exception as e:
            logger.error(f"Failed to retrieve cases for worker {worker_name}: {str(e)}")
            raise GoogleCloudError(f"Query failed: {str(e)}")
    
    def get_persons_by_case(self, case_id: str) -> List[Dict[str, Any]]:
        """Get persons associated with a case."""
        query = f"""
        SELECT 
            p.person_id,
            p.first_name,
            p.last_name,
            p.date_of_birth,
            cpa.role_in_case
        FROM `{self.people_table}` p
        JOIN `{self.case_person_associations_table}` cpa 
            ON p.person_id = cpa.person_id
        WHERE cpa.case_id = @case_id
            AND cpa.end_date IS NULL
        ORDER BY cpa.start_date
        """
        
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("case_id", "STRING", str(case_id))
            ]
        )
        
        try:
            query_job = self.client.query(query, job_config=job_config)
            results = query_job.result()
            
            persons = []
            for row in results:
                person_data = {
                    'person_id': row.person_id,
                    'first_name': row.first_name,
                    'last_name': row.last_name,
                    'date_of_birth': row.date_of_birth.isoformat() if row.date_of_birth else None,
                    'role': row.role_in_case,
                    'contact_info': {},
                    'indicators': [],
                    'relationship_to_primary_child': row.role_in_case
                }
                persons.append(person_data)
            
            logger.info(f"Retrieved {len(persons)} persons for case: {case_id}")
            return persons
            
        except Exception as e:
            logger.error(f"Failed to retrieve persons for case {case_id}: {str(e)}")
            return []
    
    def search_persons(self, query: str) -> List[Dict[str, Any]]:
        """Search for persons by name."""
        search_query = f"""
        SELECT 
            person_id,
            first_name,
            last_name,
            date_of_birth
        FROM `{self.people_table}`
        WHERE LOWER(first_name) LIKE LOWER(@query_pattern)
           OR LOWER(last_name) LIKE LOWER(@query_pattern)
           OR LOWER(CONCAT(first_name, ' ', last_name)) LIKE LOWER(@query_pattern)
        ORDER BY last_name, first_name
        LIMIT 50
        """
        
        query_pattern = f"%{query}%"
        
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("query_pattern", "STRING", query_pattern)
            ]
        )
        
        try:
            query_job = self.client.query(search_query, job_config=job_config)
            results = query_job.result()
            
            persons = []
            for row in results:
                person_data = {
                    'person_id': row.person_id,
                    'first_name': row.first_name,
                    'last_name': row.last_name,
                    'date_of_birth': row.date_of_birth.isoformat() if row.date_of_birth else None,
                    'contact_info': {},
                    'indicators': [],
                    'role': '',
                    'relationship_to_primary_child': ''
                }
                persons.append(person_data)
            
            logger.info(f"Found {len(persons)} persons matching query: {query}")
            return persons
            
        except Exception as e:
            logger.error(f"Failed to search persons with query '{query}': {str(e)}")
            raise GoogleCloudError(f"Search query failed: {str(e)}")
    
    def assign_case_to_swcm(self, case_id: str, assigned_worker: str, assigned_supervisor: str) -> bool:
        """Assign a case to an SWCM worker."""
        try:
            update_query = f"""
            UPDATE `{self.cases_table}`
            SET 
                status = 'Active',
                swcm = @assigned_worker,
                swcm_supervisor = @assigned_supervisor,
                last_updated = CURRENT_TIMESTAMP()
            WHERE case_id = @case_id
            """
            
            job_config = bigquery.QueryJobConfig(
                query_parameters=[
                    bigquery.ScalarQueryParameter("case_id", "STRING", case_id),
                    bigquery.ScalarQueryParameter("assigned_worker", "STRING", assigned_worker),
                    bigquery.ScalarQueryParameter("assigned_supervisor", "STRING", assigned_supervisor)
                ]
            )
            
            query_job = self.client.query(update_query, job_config=job_config)
            query_job.result()
            
            logger.info(f"Assigned case {case_id} to SWCM {assigned_worker}")
            return True
            
        except Exception as e:
            logger.error(f"Error assigning case {case_id}: {str(e)}")
            return False
    
    def update_case(self, case_id: str, updates: Dict[str, Any]) -> bool:
        """Update case fields."""
        allowed_fields = {
            'case_display_name': 'STRING',
            'status': 'STRING',
            'priority_level': 'STRING',
            'allegation_type': 'STRING',
            'allegation_description': 'STRING',
            'county': 'STRING',
            'swcm': 'STRING',
            'swcm_supervisor': 'STRING'
        }
        
        filtered_updates = {k: v for k, v in updates.items() if k in allowed_fields}
        
        if not filtered_updates:
            return False
        
        try:
            set_clauses = []
            query_parameters = [bigquery.ScalarQueryParameter("case_id", "STRING", case_id)]
            
            for field, value in filtered_updates.items():
                param_name = f"param_{field}"
                set_clauses.append(f"{field} = @{param_name}")
                query_parameters.append(
                    bigquery.ScalarQueryParameter(param_name, allowed_fields[field], value)
                )
            
            set_clauses.append("last_updated = CURRENT_TIMESTAMP()")
            
            update_query = f"""
            UPDATE `{self.cases_table}`
            SET {', '.join(set_clauses)}
            WHERE case_id = @case_id
            """
            
            job_config = bigquery.QueryJobConfig(query_parameters=query_parameters)
            query_job = self.client.query(update_query, job_config=job_config)
            query_job.result()
            
            logger.info(f"Updated case {case_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update case {case_id}: {str(e)}")
            return False
    
    def get_case_notes(self, case_id: str) -> List[Dict[str, Any]]:
        """Get case notes for a case."""
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
        
        try:
            query_job = self.client.query(query, job_config=job_config)
            results = query_job.result()
            
            notes = []
            for i, row in enumerate(results):
                note_data = {
                    'note_id': f"note_{i + 1}",
                    'text': row.note,
                    'created_by': 'System',
                    'created_date': row.visit_date.isoformat() if row.visit_date else datetime.now().isoformat(),
                    'note_type': row.note_type,
                    'genai_summary': row.genai_summary
                }
                notes.append(note_data)
            
            logger.info(f"Retrieved {len(notes)} case notes for case: {case_id}")
            return notes
            
        except Exception as e:
            logger.error(f"Failed to retrieve case notes for case {case_id}: {str(e)}")
            return []
    
    def get_case_notes_as_timeline(self, case_id: str) -> List[Dict[str, Any]]:
        """Get case notes as timeline events."""
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
        
        try:
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
                    'created_by': 'System',
                    'priority': 'medium'
                }
                timeline_events.append(event_data)
            
            logger.info(f"Retrieved {len(timeline_events)} timeline events for case: {case_id}")
            return timeline_events
            
        except Exception as e:
            logger.error(f"Failed to retrieve timeline events for case {case_id}: {str(e)}")
            return []
    
    def add_case_note(self, case_id: str, note_text: str, note_type: str, created_by: str) -> bool:
        """Add a case note."""
        try:
            insert_query = f"""
            INSERT INTO `{self.case_notes_table}` 
            (case_id, note, note_type, visit_date, version)
            VALUES (@case_id, @note_text, @note_type, CURRENT_TIMESTAMP(), 1)
            """
            
            job_config = bigquery.QueryJobConfig(
                query_parameters=[
                    bigquery.ScalarQueryParameter("case_id", "STRING", case_id),
                    bigquery.ScalarQueryParameter("note_text", "STRING", note_text),
                    bigquery.ScalarQueryParameter("note_type", "STRING", note_type)
                ]
            )
            
            query_job = self.client.query(insert_query, job_config=job_config)
            query_job.result()
            
            logger.info(f"Successfully added case note for case {case_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add case note for case {case_id}: {str(e)}")
            return False
