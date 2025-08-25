# CCWIS Demo Application - Work Preservation Guide

## Project Overview
This is a modern, modular Child Welfare Information System (CCWIS) demo application built with Next.js frontend and Flask backend, integrated with Google BigQuery for data storage.

## Current Status (Updated: August 25, 2025)

### ✅ Completed Features
- **BigQuery Integration**: Fully functional database connection with parameterized queries
- **Frontend-Backend Integration**: Complete API integration between Next.js UI and Flask backend
- **CCWIS Workflow Implementation**: Multi-role dashboard system (SWCM, CPW, Supervisors)
- **Case Management**: Full case lifecycle from intake to active management
- **CSS Fixes**: Resolved modal width inconsistencies in CPW case setup flow
- **Deployment**: Successfully deployed to Firebase Hosting and Cloud Run

### 🏗️ Architecture

#### Frontend (Next.js)
- **Location**: `src/ui/`
- **Framework**: Next.js 14 with TypeScript
- **Styling**: CSS modules with responsive design
- **API Client**: Custom TypeScript client in `src/ui/lib/api.ts`
- **Deployment**: Firebase Hosting at https://cw-vision-prototype.web.app

#### Backend (Flask)
- **Location**: `src/apis/core_case_mgmt/`
- **Framework**: Flask with CORS support
- **Database**: Google BigQuery integration via `bigquery_manager.py`
- **Deployment**: Google Cloud Run
- **Environment Variables**: 
  - `PROJECT_ID=gb-demos`
  - `BIGQUERY_DATASET=cw_case_notes`

#### Infrastructure
- **Cloud Provider**: Google Cloud Platform
- **Database**: BigQuery with `cw_case_notes` dataset
- **Hosting**: Firebase Hosting for frontend, Cloud Run for backend
- **IaC**: Terraform modules in `modules/` directory

### 🔧 Key Technical Fixes Applied

#### 1. BigQuery Integration (RESOLVED)
- **Issue**: Frontend was looking for assigned cases when all cases were unassigned
- **Solution**: Modified frontend to query for `unassigned` cases, matching CCWIS workflow
- **Files Modified**:
  - `src/ui/app/page.tsx`: Changed to `getCasesByWorker('unassigned')`
  - `src/ui/app/cpw/page.tsx`: Changed to `getCasesByWorker('unassigned')`
- **Result**: Successfully loads 13 cases from BigQuery including Thompson Family Case (24601)

#### 2. CSS Modal Width Issues (RESOLVED)
- **Issue**: Width mismatch between 4-step progress banner and modal content in CPW case setup
- **Solution**: Added consistent `max-width: 100%` constraints
- **Files Modified**:
  - `src/ui/app/globals.css`: Updated `.setup-progress` and `.modal-content` classes
- **Result**: Visual consistency across all modal components

#### 3. Data Type Consistency (RESOLVED)
- **Issue**: BigQuery case_id parameter type mismatches
- **Solution**: Ensured all case_id parameters use STRING type consistently
- **Files**: `src/apis/core_case_mgmt/bigquery_manager.py`

### 📊 Current Data Status
- **Cases in BigQuery**: 13 active cases
- **Primary Test Case**: Thompson Family Case (ID: 24601)
- **Case Notes**: 13 notes available for test case
- **Person Search**: Functional (e.g., "Jamie Thompson" returns results)

### 🚀 Local Development Setup

#### Backend Setup
```bash
cd src/apis/core_case_mgmt
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
PROJECT_ID=gb-demos BIGQUERY_DATASET=cw_case_notes python main.py
```

#### Frontend Setup
```bash
cd src/ui
npm install
NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev
```

#### Testing API Endpoints
```bash
# Health check
curl http://localhost:8080/health

# Get unassigned cases
curl http://localhost:8080/cases?assigned_worker=unassigned

# Get specific case
curl http://localhost:8080/cases/24601

# Search persons
curl http://localhost:8080/persons/search?q=Jamie
```

### 🌐 Production Deployment

#### Frontend (Firebase)
```bash
cd src/ui
npm run build
npx firebase deploy
```
**Live URL**: https://cw-vision-prototype.web.app

#### Backend (Cloud Run)
- Deployed via Cloud Build and Terraform
- **Live URL**: https://ccwis-core-case-mgmt-807576987550.us-central1.run.app

### 📁 Key Files and Their Purpose

#### Frontend Core Files
- `src/ui/app/page.tsx` - SWCM worker dashboard (loads unassigned cases)
- `src/ui/app/cpw/page.tsx` - CPW worker dashboard (case setup workflow)
- `src/ui/app/cases/[caseId]/page.tsx` - Individual case detail view
- `src/ui/lib/api.ts` - API client with all backend endpoints
- `src/ui/app/globals.css` - Global styles including modal fixes

#### Backend Core Files
- `src/apis/core_case_mgmt/main.py` - Flask application with all endpoints
- `src/apis/core_case_mgmt/bigquery_manager.py` - BigQuery operations and queries
- `src/apis/core_case_mgmt/requirements.txt` - Python dependencies

#### Infrastructure Files
- `modules/apis/main.tf` - Cloud Run service configuration
- `modules/ui/main.tf` - Firebase hosting configuration
- `envs/dev/main.tf` - Development environment setup

### 🔄 CCWIS Workflow Implementation

#### 1. Intake Process
- **Route**: `/intake`
- **Purpose**: Initial case creation and referral processing

#### 2. CPW (Child Protection Worker) Flow
- **Route**: `/cpw`
- **Purpose**: Case setup, membership verification, initial assessment
- **Modal**: 4-step case setup process with consistent styling

#### 3. SWCM (Social Work Case Manager) Flow
- **Route**: `/` (main dashboard)
- **Purpose**: Active case management, case notes, person management
- **Data**: Loads unassigned cases for assignment and management

#### 4. Supervisor Dashboards
- **Routes**: `/supervisor`, `/cpw-supervisor`, `/swcm-supervisor`
- **Purpose**: Case assignment, approval workflows, oversight

### 🐛 Known Issues & Limitations
- **None currently identified** - All major integration issues have been resolved
- BigQuery integration is fully functional
- CSS styling is consistent across all components
- API endpoints are working correctly

### 🔮 Next Development Priorities
1. **Enhanced Case Notes**: Rich text editing and categorization
2. **Document Management**: File upload and attachment system
3. **Reporting Dashboard**: Analytics and case metrics
4. **User Authentication**: Role-based access control
5. **Real-time Updates**: WebSocket integration for live updates

### 🛠️ Development Commands Quick Reference

```bash
# Start local development
cd src/apis/core_case_mgmt && source venv/bin/activate && PROJECT_ID=gb-demos BIGQUERY_DATASET=cw_case_notes python main.py
cd src/ui && NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev

# Deploy to production
cd src/ui && npm run build && npx firebase deploy

# Test API health
curl http://localhost:8080/health

# Git workflow
git add .
git commit -m "Description of changes"
git push origin main
```

### 📞 Support & Troubleshooting
- **BigQuery Issues**: Verify PROJECT_ID and BIGQUERY_DATASET environment variables
- **CORS Issues**: Ensure Flask-CORS is properly configured in main.py
- **Build Issues**: Clear Next.js cache with `npm run clean` or `rm -rf .next`
- **Firebase Issues**: Check firebase.json configuration and ensure `out` directory exists

---

**Last Updated**: August 25, 2025  
**Status**: ✅ Fully Functional - Ready for Development  
**Next Session**: Continue with enhanced features or new requirements
