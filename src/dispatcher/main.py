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

import os
import json
from flask import Flask, request, Response
from google.cloud import tasks_v2

app = Flask(__name__)

# Initialize the Cloud Tasks client
tasks_client = tasks_v2.CloudTasksClient()

# Set environment variables
PROJECT_ID = os.environ.get('GCP_PROJECT')
LOCATION = os.environ.get('GCP_LOCATION')
TASK_QUEUE = os.environ.get('TASK_QUEUE')
WORKER_SERVICE_URL = os.environ.get('WORKER_SERVICE_URL') 
DISPATCHER_SA_EMAIL = os.environ.get('DISPATCHER_SA_EMAIL')

@app.route("/", methods=["POST"])
def dispatch_gcs_event():
    """
    Receives an event from Eventarc, creates a Cloud Task to delegate the work,
    and immediately returns a 204 response to acknowledge the event.
    """
    print("Dispatcher service invoked by an event.")
    
    event_data = request.get_json()
    if not event_data or "bucket" not in event_data or "name" not in event_data:
        print(f"Invalid payload received: {event_data}. Aborting.")
        # Still return 2xx so Eventarc doesn't retry a bad request
        return Response(status=204)

    file_name = event_data.get('name')
    etag = event_data.get('etag')

    print(f"Received event for file: {file_name} (etag: {etag}). Creating Cloud Task.")

    # Construct the full path to the Cloud Tasks queue
    parent = tasks_client.queue_path(PROJECT_ID, LOCATION, TASK_QUEUE)
    # Construct the task payload
    task = {
        "http_request": {
            "http_method": tasks_v2.HttpMethod.POST,
            "url": WORKER_SERVICE_URL,
            "headers": {"Content-Type": "application/json"},
            # The body must be bytes. We pass the original event data directly.
            "body": json.dumps(event_data).encode(),
            "oidc_token": {
                "service_account_email": DISPATCHER_SA_EMAIL
            }
        }
    }
    try:
        # Use the client to create and queue the task
        tasks_client.create_task(parent=parent, task=task)
        print("Successfully created a task in Cloud Tasks.")

    except Exception as e:
        print(f"Error creating task: {e}")
        # Return a 500 error so Eventarc might retry delivering the event
        return Response(status=500)

    # Return 204 NO CONTENT to acknowledge the event to Eventarc immediately.
    return Response(status=204)

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))