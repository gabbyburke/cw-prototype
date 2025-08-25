#!/bin/bash

# Child Welfare Prototype - Firebase Deployment Script
# This script builds and deploys the prototype with cache-busting

echo "🔨 Building Next.js application with cache busting..."
# Add timestamp to force cache invalidation
export BUILD_ID=$(date +%s)
echo "Build ID: $BUILD_ID"
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Deploying to Firebase..."
    npx firebase deploy
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment successful!"
        echo "🌐 Your app is live at: https://cw-vision-prototype.web.app"
        echo ""
        echo "📝 Note: Cache-busting is configured to avoid caching issues."
        echo "   Each build generates a unique build ID for fresh deployments."
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
