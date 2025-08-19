# Child Welfare Prototype - Firebase Deployment Guide

## 🌐 Live Application
Your prototype is deployed and accessible at: **https://cw-vision-prototype.web.app**

## 🚀 Quick Deployment

For future iterations, simply run:
```bash
./deploy.sh
```

This script will:
1. Build the Next.js application with static export
2. Deploy to Firebase hosting
3. Apply cache-busting configuration

## 📋 Manual Deployment Steps

If you prefer manual deployment:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase:**
   ```bash
   npx firebase deploy
   ```

## 🔧 Cache-Busting Configuration

To avoid caching issues during iterative development, the following configurations are in place:

### Next.js Configuration (`next.config.js`)
- **Static Export**: Configured for Firebase hosting compatibility
- **Dynamic Build ID**: Each build generates a unique timestamp-based ID
- **Image Optimization**: Disabled for static export compatibility

### Firebase Hosting Configuration (`firebase.json`)
- **No-Cache Headers**: Applied to JS, CSS, and HTML files
- **Short Cache**: 5-minute cache for images
- **Public Directory**: Points to `out` folder (Next.js static export output)

## 🏗️ Project Structure

```
src/ui/
├── app/                    # Next.js App Router pages
│   ├── cases/             # Case management pages
│   ├── supervisor/        # Supervisor dashboard
│   └── layout.tsx         # Root layout
├── lib/                   # Utilities and mock data
├── firebase.json          # Firebase hosting config
├── next.config.js         # Next.js configuration
├── deploy.sh             # Deployment script
└── out/                  # Build output (generated)
```

## 🔄 Development Workflow

1. **Make changes** to your prototype
2. **Test locally** with `npm run dev`
3. **Deploy** with `./deploy.sh`
4. **Access** your updated prototype at the live URL

## 🛠️ Firebase Project Details

- **Project ID**: `cw-vision-prototype`
- **Project Name**: `cw-vision-prototype`
- **Console**: https://console.firebase.google.com/project/cw-vision-prototype/overview
- **Hosting URL**: https://cw-vision-prototype.web.app

## 📝 Notes

- Each deployment creates a fresh build with cache-busting
- Static export ensures compatibility with Firebase hosting
- All dynamic routes are pre-generated for the mock case data
- The prototype includes comprehensive child welfare case management features

## 🔍 Features Deployed

- ✅ Caseworker caseload view with filtering
- ✅ Supervisor assignment dashboard
- ✅ Detailed case view with tabbed interface
- ✅ Mock data system for realistic demonstration
- ✅ Responsive design with professional styling
- ✅ Navigation between all major views
