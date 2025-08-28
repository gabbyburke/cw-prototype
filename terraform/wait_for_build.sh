#!/bin/bash

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

set -e

# Read variables from command-line arguments
BUILD_LOCATION=$1
BUILD_TAG=$2
IMAGE_URL=$3
MAX_TIME_MINS=$4

# Check if the image already exists in the registry
if gcloud container images describe "${IMAGE_URL}" --quiet 2>/dev/null; then
  echo "SUCCESS: Image already exists. Skipping build wait."
  exit 0
fi

# If image doesn't exist, proceed with waiting for the build
echo "Waiting for build with tag '${BUILD_TAG}' in location '${BUILD_LOCATION}'..."
sleep 15

# Find most recent build
recent_build_id=$(gcloud builds list --region=${BUILD_LOCATION} --limit=1 --filter="tags:${BUILD_TAG}" --format="value(id)" 2>/dev/null || echo "")

if [ -z "$recent_build_id" ]; then
  echo "ERROR: Build was not triggered. No recent builds found for tag '${BUILD_TAG}'."
  exit 1
fi

echo "Build found: ${recent_build_id}. Waiting for completion (max ${MAX_TIME_MINS} minutes)..."

# Wait for the build to complete
gcloud builds log --stream "${recent_build_id}" --region="${BUILD_LOCATION}"

# Final status check after log streaming
final_status=$(gcloud builds describe "${recent_build_id}" --region="${BUILD_LOCATION}" --format="value(status)")

if [ "${final_status}" != "SUCCESS" ]; then
  echo "ERROR: Build failed or was cancelled with final status: ${final_status}"
  exit 1
fi

echo "Build successful, now confirming image is in registry: ${IMAGE_URL}"

# Final check for the image to appear in the registry
end_time=$(($(date +%s) + 60))
while [ $(date +%s) -lt ${end_time} ]; do
  if gcloud container images describe "${IMAGE_URL}" --quiet 2>/dev/null; then
    echo "SUCCESS: Image found in registry."
    exit 0
  fi
  sleep 5
done

echo "ERROR: Timed out waiting for image to appear in registry."
exit 1