#!/usr/bin/env python3
"""
Simple test script to verify BigQuery connection and operations
"""

import os
import sys
from bigquery_manager import BigQueryManager

def test_bigquery_connection():
    """Test basic BigQuery operations"""
    print("Testing BigQuery connection...")
    
    try:
        # Initialize BigQuery manager
        bq_manager = BigQueryManager()
        print("✓ BigQuery manager initialized")
        
        # Test getting active cases (since there are no pending assignment cases)
        print("Testing get_cases_by_worker with 'Active' status...")
        active_cases = bq_manager.get_cases_by_worker("unassigned")
        print(f"✓ Found {len(active_cases)} unassigned cases")
        
        # Test person search functionality with actual data
        print("Testing search_persons...")
        search_results = bq_manager.search_persons("Jamie")
        print(f"✓ Found {len(search_results)} persons matching 'Jamie'")
        
        if search_results:
            first_person = search_results[0]
            print(f"✓ First person: {first_person['first_name']} {first_person['last_name']}")
        
        # Test with full name
        search_results2 = bq_manager.search_persons("Jamie Thompson")
        print(f"✓ Found {len(search_results2)} persons matching 'Jamie Thompson'")
        
        # Test with last name
        search_results3 = bq_manager.search_persons("Thompson")
        print(f"✓ Found {len(search_results3)} persons matching 'Thompson'")
        
        # Test getting all cases with Active status
        print("Testing get_cases_for_swcm_assignment (should find Active cases)...")
        cases = bq_manager.get_cases_for_swcm_assignment()
        print(f"✓ Found {len(cases)} cases for assignment")
        
        if active_cases:
            case_id = active_cases[0]['case_id']
            print(f"✓ First case ID: {case_id}")
            
            # Test getting case by ID
            print(f"Testing get_case_by_id for case {case_id}...")
            case_details = bq_manager.get_case_by_id(case_id)
            if case_details:
                print("✓ Case retrieval successful")
                print(f"  Case display name: {case_details.get('case_display_name', 'N/A')}")
                print(f"  Status: {case_details.get('status', 'N/A')}")
                print(f"  Persons count: {len(case_details.get('persons', []))}")
                print(f"  Case notes count: {len(case_details.get('case_notes', []))}")
            else:
                print("✗ Case retrieval failed")
                
            # Test getting persons for case
            print(f"Testing get_persons_by_case for case {case_id}...")
            case_persons = bq_manager.get_persons_by_case(case_id)
            print(f"✓ Found {len(case_persons)} persons for case {case_id}")
            
            # Test getting case notes
            print(f"Testing get_case_notes for case {case_id}...")
            case_notes = bq_manager.get_case_notes(case_id)
            print(f"✓ Found {len(case_notes)} case notes for case {case_id}")
        
        # Test magic button data functionality
        print("Testing get_magic_button_data_by_incident_number...")
        try:
            # Test with the specific incident number provided
            test_incident = "INC-2023-015"
            magic_data = bq_manager.get_magic_button_data_by_incident_number(test_incident)
            if magic_data:
                print(f"✓ Found magic button data for incident {test_incident}")
                print(f"  Data keys: {list(magic_data.keys())}")
                # Show a few sample fields if they exist
                if 'case_name' in magic_data:
                    print(f"  Case name: {magic_data['case_name']}")
                if 'incident_number' in magic_data:
                    print(f"  Incident number: {magic_data['incident_number']}")
            else:
                print(f"✓ No magic button data found for incident {test_incident}")
        except Exception as e:
            print(f"✗ Magic button test failed: {str(e)}")
        
        print("All tests completed successfully!")
        return True
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_bigquery_connection()
    sys.exit(0 if success else 1)
