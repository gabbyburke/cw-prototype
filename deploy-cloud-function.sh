#!/bin/bash

# Deploy the Plan My Day Cloud Function
# This script deploys the Python function to Google Cloud Functions

echo "🚀 Deploying Plan My Day Cloud Function..."

# Set the project ID
PROJECT_ID="cw-vision-prototype"

# Deploy the function
gcloud functions deploy get_daily_route \
  --gen2 \
  --runtime=python311 \
  --region=us-central1 \
  --source=./functions \
  --entry-point=get_daily_route \
  --trigger=https \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}" \
  --project=${PROJECT_ID}

if [ $? -eq 0 ]; then
    echo "✅ Cloud Function deployed successfully!"
    echo "🌐 Function URL: https://us-central1-${PROJECT_ID}.cloudfunctions.net/get_daily_route"
    echo ""
    echo "📝 Next steps:"
    echo "1. Set the GOOGLE_MAPS_API_KEY environment variable"
    echo "2. Test the function with a date parameter"
    echo "3. Update the frontend URL in PlanMyDayModal.tsx"
else
    echo "❌ Deployment failed!"
    exit 1
fi
