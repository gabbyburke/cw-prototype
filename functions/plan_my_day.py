import os
import json
from typing import Dict, List
from datetime import datetime
from google.cloud import bigquery
from flask import jsonify, request
import requests

# Initialize BigQuery client
bigquery_client = bigquery.Client()

# Office location coordinates
OFFICE = {
    "latitude": 41.831694223699785,
    "longitude": -91.83240560132762
}

def get_destinations_from_bigquery(selected_date: datetime.date) -> List[Dict]:
    """
    Fetch visit locations by joining visits with addresses table.
    Returns list of dictionaries containing latitude and longitude.
    """
    query = """
        SELECT
            v.case_id,
            a.street_address,
            a.city,
            a.state,
            a.zipcode,
            CONCAT(a.street_address, ', ', a.city, ', ', a.state, ' ', CAST(a.zipcode AS STRING)) as full_address,
            a.latitude,
            a.longitude
        FROM
            `gb-demos.cw_case_notes.visits` v
        JOIN
            `gb-demos.cw_case_notes.addresses` a ON v.case_id = a.case_id
        WHERE
            v.visit_date = @selected_date
            AND a.latitude IS NOT NULL
            AND a.longitude IS NOT NULL
    """
    try:
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("selected_date", "DATE", selected_date)
            ]
        )
        query_job = bigquery_client.query(query, job_config=job_config)
        rows = query_job.result()
        destinations = []
        for row in rows:
            destinations.append({
                "id": row.case_id,
                "address": row.full_address,
                "notes": "Visit Scheduled",
                "time": "TBD",
                "lastVisit": "2024-08-15",
                "latitude": float(row.latitude),
                "longitude": float(row.longitude)
            })
        return destinations
    except Exception as e:
        print(f"Error fetching destinations from BigQuery: {str(e)}")
        raise

def get_optimized_route(destinations: List[Dict]) -> Dict:
    """
    Get optimized route using Google Maps Routes API.
    """
    api_key = os.environ.get('GOOGLE_MAPS_API_KEY')
    if not api_key:
        raise ValueError("GOOGLE_MAPS_API_KEY environment variable not set")

    request_body = {
        "origin": {"location": {"latLng": {"latitude": OFFICE["latitude"], "longitude": OFFICE["longitude"]}}},
        "destination": {"location": {"latLng": {"latitude": OFFICE["latitude"], "longitude": OFFICE["longitude"]}}},
        "intermediates": [
            {"location": {"latLng": {"latitude": dest["latitude"], "longitude": dest["longitude"]}}}
            for dest in destinations
        ],
        "travelMode": "DRIVE",
        "routingPreference": "TRAFFIC_AWARE",
        "computeAlternativeRoutes": False,
        "languageCode": "en-US",
        "units": "IMPERIAL"
    }
    
    try:
        # FIX: The URL was pointing to the wrong endpoint (:compareRoutes instead of :computeRoutes)
        url = "https://routes.googleapis.com/directions/v2:computeRoutes"
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.optimizedIntermediateWaypointIndex,routes.polyline.encodedPolyline,routes.legs"
        }
        
        response = requests.post(url, json=request_body, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if 'routes' not in data or not data['routes']:
            raise ValueError("No routes found in API response")
        
        route = data['routes'][0]
        
        total_distance = int(route.get('distanceMeters', 0))
        total_duration = int(route.get('duration', '0s').rstrip('s'))
        waypoint_order = route.get('optimizedIntermediateWaypointIndex', list(range(len(destinations))))
        
        return {
            'route': route,
            'overview': {
                'total_distance_meters': total_distance,
                'total_duration_seconds': total_duration,
                'waypoint_order': waypoint_order
            }
        }
    except Exception as e:
        print(f"Error getting optimized route: {str(e)}")
        raise

def get_daily_route(request):
    """
    HTTP Cloud Function to get optimized daily route for SWCM workers.
    """
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if request.method == 'OPTIONS':
        return ('', 204, headers)

    date_str = request.args.get('date')

    if not date_str:
        selected_date = datetime.now().date()
    else:
        try:
            selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return (jsonify({'error': f'Invalid date format. Expected YYYY-MM-DD, got: {date_str}'}), 400, headers)

    try:
        destinations = get_destinations_from_bigquery(selected_date)
        
        if not destinations:
            return (jsonify({'message': 'No destinations found for the selected date'}), 200, headers)
            
        route_data = get_optimized_route(destinations)
        
        return (jsonify({
            'status': 'success',
            'timestamp': datetime.utcnow().isoformat(),
            'office_location': OFFICE,
            'destinations_count': len(destinations),
            'destinations': destinations,
            'route': {
                'waypoint_order': route_data['overview']['waypoint_order'],
                'overview': {
                    'total_distance_meters': route_data['overview']['total_distance_meters'],
                    'total_duration_seconds': route_data['overview']['total_duration_seconds']
                },
                'polyline': route_data['route'].get('polyline', {}).get('encodedPolyline', ''),
                'legs': route_data['route'].get('legs', [])
            }
        }), 200, headers)
        
    except ValueError as e:
        return (jsonify({'error': str(e)}), 400, headers)
    except Exception as e:
        print(f"Unexpected error in main handler: {str(e)}")
        return (jsonify({'error': 'An internal server error occurred'}), 500, headers)