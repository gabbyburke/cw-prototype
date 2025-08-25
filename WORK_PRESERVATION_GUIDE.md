# Work Preservation Guide - CCWIS Prototype

## 🔒 **HOW TO PRESERVE YOUR WORK**

### **1. Git Commit & Push (CRITICAL)**
```bash
# Navigate to your project root
cd /home/gabbyburke/cw-prototype

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Fixed BigQuery integration and CSS modal width issues

- Fixed frontend to load 'unassigned' cases instead of specific worker names
- Updated src/ui/app/page.tsx and src/ui/app/cpw/page.tsx to use getCasesByWorker('unassigned')
- Fixed CSS width mismatch in CPW case setup modal between progress banner and modal content
- Added max-width: 100% constraints to .setup-progress and .modal-content in globals.css
- Verified BigQuery API working correctly with 13 cases and complete case data
- All API endpoints tested and functional: health, cases, person search, individual case retrieval
- Local testing completed successfully with both backend and frontend running"

# Push to remote repository
git push origin main
```

### **2. Current Running Services**
- **Flask API**: Running on http://localhost:5000 with BigQuery integration
- **Next.js Dev Server**: Running on http://localhost:3000
- **Status**: BigQuery integration working, CSS fixes applied, ready for deployment
- **Environment Variables**: PROJECT_ID=gb-demos, BIGQUERY_DATASET=cw_case_notes
- **To Stop**: Ctrl+C in terminals running the services
- **To Restart Tomorrow**: 
  - Backend: `cd src/apis/core_case_mgmt && source venv/bin/activate && PROJECT_ID=gb-demos BIGQUERY_DATASET=cw_case_notes python main.py`
  - Frontend: `cd src/ui && npm run dev`

### **3. Key Files to Verify Are Saved**
✅ **src/ui/app/page.tsx** - Fixed to load unassigned cases for SWCM dashboard
✅ **src/ui/app/cpw/page.tsx** - Fixed to load unassigned cases for CPW dashboard  
✅ **src/ui/app/globals.css** - Fixed width mismatch in CPW modal with max-width constraints
✅ **src/apis/core_case_mgmt/bigquery_manager.py** - Complete BigQuery integration with STRING case_id parameters
✅ **src/apis/core_case_mgmt/main.py** - Flask API with all endpoints working correctly
✅ **src/ui/lib/api.ts** - API client for frontend-backend communication
✅ **All workflow pages** - intake, cpw, cpw-supervisor, swcm-supervisor
✅ **All Terraform infrastructure files** - Complete GCP setup
✅ **Python virtual environment** - src/apis/core_case_mgmt/venv/ with all dependencies

### **4. Environment State**
- **Working Directory**: `/home/gabbyburke/cw-prototype`
- **Node.js**: Installed and working
- **Python**: Virtual environment set up with all BigQuery dependencies
- **Dependencies**: All npm packages installed in `src/ui/`, all Python packages in venv
- **BigQuery**: Connected and working with gb-demos project, cw_case_notes dataset
- **Terraform**: Infrastructure code complete
- **Docker**: Containerization ready

## 🚀 **TOMORROW'S STARTUP CHECKLIST**

### **Step 1: Verify Git Status**
```bash
cd /home/gabbyburke/cw-prototype
git status
git log --oneline -5  # Check recent commits
```

### **Step 2: Start Backend API**
```bash
cd src/apis/core_case_mgmt
source venv/bin/activate
PROJECT_ID=gb-demos BIGQUERY_DATASET=cw_case_notes python main.py
```
*Should start on http://localhost:5000*

### **Step 3: Start Frontend Development Server**
```bash
cd src/ui
npm run dev
```
*Should start on http://localhost:3000 (or next available port)*

### **Step 4: Verify BigQuery Integration Works**
- ✅ Navigate to dashboard - should load 13 unassigned cases from BigQuery
- ✅ Click "Cases" in sidebar - verify case list loads from BigQuery
- ✅ Click on individual case - verify case details and 13 case notes load
- ✅ Test CPW dashboard - verify unassigned cases load correctly
- ✅ Verify CPW case setup modal width is consistent with progress banner
- ✅ Test person search functionality
- ✅ Verify all API endpoints respond correctly

### **Step 5: Continue Development**
The BigQuery integration is complete and working. Next priorities:
- Deploy to Firebase hosting
- Push to GitHub
- Continue with additional CCWIS workflow features
- Add more case management functionality

## 📁 **PROJECT STRUCTURE OVERVIEW**
```
cw-prototype/
├── WORK_PRESERVATION_GUIDE.md  # ← This file
├── PROJECT_STATUS.md           # Project overview
├── README.md                   # Project overview
├── DEPLOYMENT.md               # Deployment instructions
├── envs/                       # Terraform environments
├── modules/                    # Terraform modules
├── src/
│   ├── apis/
│   │   └── core_case_mgmt/
│   │       ├── main.py         # ← Flask API with BigQuery ⭐
│   │       ├── bigquery_manager.py # ← BigQuery operations ⭐
│   │       ├── requirements.txt # Python dependencies
│   │       └── venv/           # ← Virtual environment ⭐
│   └── ui/                     # Frontend (Next.js/React)
│       ├── app/
│       │   ├── page.tsx        # ← Fixed unassigned cases ⭐
│       │   ├── cpw/page.tsx    # ← Fixed unassigned cases ⭐
│       │   ├── globals.css     # ← Fixed modal width ⭐
│       │   ├── layout.tsx      # Navigation with sidebar
│       │   ├── intake/         # Intake workflow
│       │   ├── cpw-supervisor/ # CPW supervisor workflow
│       │   └── swcm-supervisor/# SWCM supervisor workflow
│       ├── lib/
│       │   ├── api.ts          # ← API client ⭐
│       │   └── mockData.ts     # Case data structure
│       └── package.json
└── cloudbuild.yaml            # CI/CD pipeline
```

## ⚠️ **CRITICAL REMINDERS**

1. **COMMIT TO GIT** - This is the most important step
2. **Set environment variables** - PROJECT_ID=gb-demos BIGQUERY_DATASET=cw_case_notes
3. **Activate virtual environment** - source venv/bin/activate before running Python
4. **Start backend first** - API must be running before frontend can connect
5. **All work is in the cw-prototype directory**
6. **BigQuery integration is now working** - no more mock data needed

## 🎯 **WHAT'S READY FOR TOMORROW**

✅ **Complete BigQuery integration** - Real data from gb-demos project
✅ **Working API endpoints** - Health, cases, person search, individual cases
✅ **Fixed frontend data loading** - Loads unassigned cases correctly
✅ **Fixed CSS modal issues** - Consistent width in CPW case setup
✅ **Local testing completed** - Both backend and frontend verified working
✅ **Complete infrastructure** - Deploy to GCP anytime
✅ **Design system** - Material Design components and comprehensive CSS
✅ **Workflow system** - Multiple user role dashboards
✅ **Case management** - Real case data from BigQuery with 13 cases and case notes

## 🆕 **LATEST FIXES (Today's Work)**

### **BigQuery Integration Fixed**
- ✅ Frontend now loads 'unassigned' cases instead of looking for specific worker names
- ✅ Updated `src/ui/app/page.tsx` to use `getCasesByWorker('unassigned')`
- ✅ Updated `src/ui/app/cpw/page.tsx` to use `getCasesByWorker('unassigned')`
- ✅ Verified API returns 13 cases with complete data including case notes
- ✅ All API endpoints tested and working correctly

### **CSS Modal Width Fixed**
- ✅ Fixed width mismatch between 4-step progress banner and modal content
- ✅ Added `max-width: 100%` to `.setup-progress` class in globals.css
- ✅ Added `max-width: 100%` to `.modal-content` class in globals.css
- ✅ Verified visual consistency in CPW case setup modal

### **Local Testing Completed**
- ✅ Python virtual environment created with all dependencies
- ✅ Flask API running successfully with BigQuery connection
- ✅ Next.js frontend connecting to API and displaying real data
- ✅ All workflows tested and functioning correctly

### **API Endpoints Verified**
- ✅ `/health` - Returns healthy status
- ✅ `/cases` - Returns 13 cases from BigQuery
- ✅ `/cases/<case_id>` - Returns individual case with 13 case notes
- ✅ `/persons/search` - Returns person search results (e.g., Jamie Thompson)

Your CCWIS prototype now has full BigQuery integration and is ready for deployment!
