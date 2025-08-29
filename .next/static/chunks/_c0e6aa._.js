(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_c0e6aa._.js", {

"[project]/lib/api.ts [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

/**
 * API client for the Child Welfare Case Management System
 */ // Use the direct Cloud Run service for local development
__turbopack_esm__({
    "addCaseNote": ()=>addCaseNote,
    "apiClient": ()=>apiClient,
    "assignCaseToSWCM": ()=>assignCaseToSWCM,
    "getCaseById": ()=>getCaseById,
    "getCaseNotes": ()=>getCaseNotes,
    "getCasesByWorker": ()=>getCasesByWorker,
    "getCasesPendingAssignment": ()=>getCasesPendingAssignment,
    "getPersonById": ()=>getPersonById,
    "getPersonsByCase": ()=>getPersonsByCase,
    "healthCheck": ()=>healthCheck,
    "searchMagicButtonData": ()=>searchMagicButtonData,
    "searchPersons": ()=>searchPersons,
    "updateCase": ()=>updateCase
});
const API_BASE_URL = 'https://ccwis-core-case-mgmt-807576987550.us-central1.run.app';
class ApiClient {
    baseUrl;
    constructor(baseUrl = API_BASE_URL){
        this.baseUrl = baseUrl;
    }
    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                return {
                    error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
                };
            }
            const data = await response.json();
            return {
                data
            };
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
    // SWCM Supervisor endpoints
    async getCasesPendingAssignment() {
        return this.request('/swcm/cases/pending-assignment');
    }
    async assignCaseToSWCM(caseId, assignedWorker, assignedSupervisor) {
        return this.request(`/swcm/cases/${caseId}/assign`, {
            method: 'POST',
            body: JSON.stringify({
                assigned_worker: assignedWorker,
                assigned_supervisor: assignedSupervisor
            })
        });
    }
    // SWCM Worker endpoints
    async getCasesByWorker(workerName) {
        return this.request(`/cases?assigned_worker=${encodeURIComponent(workerName)}`);
    }
    async getCaseById(caseId) {
        return this.request(`/cases/${caseId}`);
    }
    async getPersonsByCase(caseId) {
        return this.request(`/cases/${caseId}/persons`);
    }
    async getCaseNotes(caseId) {
        return this.request(`/cases/${caseId}/notes`);
    }
    async addCaseNote(caseId, noteText, noteType) {
        return this.request(`/cases/${caseId}/notes`, {
            method: 'POST',
            body: JSON.stringify({
                note_text: noteText,
                note_type: noteType || 'General'
            })
        });
    }
    async updateCase(caseId, updates) {
        return this.request(`/cases/${caseId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }
    // Person search
    async searchPersons(query) {
        return this.request(`/persons/search?q=${encodeURIComponent(query)}`);
    }
    // Get person by ID
    async getPersonById(personId) {
        return this.request(`/persons/${personId}`);
    }
    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}
const apiClient = new ApiClient();
const getCasesPendingAssignment = ()=>apiClient.getCasesPendingAssignment();
const assignCaseToSWCM = (caseId, assignedWorker, assignedSupervisor)=>apiClient.assignCaseToSWCM(caseId, assignedWorker, assignedSupervisor);
const getCasesByWorker = (workerName)=>apiClient.getCasesByWorker(workerName);
const getCaseById = (caseId)=>apiClient.getCaseById(caseId);
const getPersonsByCase = (caseId)=>apiClient.getPersonsByCase(caseId);
const getCaseNotes = (caseId)=>apiClient.getCaseNotes(caseId);
const addCaseNote = (caseId, noteText, noteType)=>apiClient.addCaseNote(caseId, noteText, noteType);
const updateCase = (caseId, updates)=>apiClient.updateCase(caseId, updates);
const searchPersons = (query)=>apiClient.searchPersons(query);
const getPersonById = (personId)=>apiClient.getPersonById(personId);
const healthCheck = ()=>apiClient.healthCheck();
const searchMagicButtonData = async (query)=>{
    // Mock implementation - replace with real API call when backend is ready
    await new Promise((resolve)=>setTimeout(resolve, 400));
    // Mock data for development
    const mockIncidents = [
        {
            incident_number: "INC-2024-001234",
            child_first_names: "Emma",
            child_last_names: "Johnson",
            parent_first_names: "Michael, Sarah",
            parent_last_names: "Johnson, Johnson",
            cps_worker: "Dana Wilson",
            due_date: "2024-09-15",
            county_of_assessment: "King County",
            intake_date: "2024-08-15",
            reported_native_american_heritage: "No",
            perpetrators: "Michael Johnson",
            perpetrator_first_name: "Michael",
            perpetrator_last_name: "Johnson",
            findings: "Substantiated",
            allegations: "Physical abuse",
            victims: "Emma Johnson",
            victim_first_name: "Emma",
            victim_last_name: "Johnson",
            person_id: "12345",
            role: "Client",
            gender: "Female",
            age_calculated: 8,
            prior_workers: "None",
            current_address: "123 Main St",
            address_type: "Residential",
            residence_county: "King County",
            date_of_birth: "2016-03-12",
            phone_number: "206-555-0123",
            phone_type: "Home",
            address: "123 Main St",
            city: "Seattle",
            state: "WA",
            zip_code: 98101,
            non_custodial_parent: false,
            non_custodial_parent_person_id: "",
            non_custodial_parent_first_name: "",
            non_custodial_parent_last_name: "",
            non_custodial_parent_middle_name: "",
            non_custodial_parent_dob: "",
            non_custodial_parent_ssn: "",
            non_custodial_parent_suffix: "",
            non_custodial_parent_sex: "",
            non_custodial_parent_race: "",
            non_custodial_parent_ethnicity: "",
            legal_custodian: "Sarah Johnson",
            guardian: "",
            prior_assessment: "None",
            type_of_appointment: "",
            clinic_name: "",
            appointment_date: ""
        }
    ];
    if (!query || query.length < 2) {
        return {
            data: {
                incidents: []
            },
            error: undefined
        };
    }
    const filteredIncidents = mockIncidents.filter((incident)=>incident.incident_number.toLowerCase().includes(query.toLowerCase()) || incident.child_first_names.toLowerCase().includes(query.toLowerCase()) || incident.child_last_names.toLowerCase().includes(query.toLowerCase()) || incident.allegations.toLowerCase().includes(query.toLowerCase()));
    return {
        data: {
            incidents: filteredIncidents
        },
        error: undefined
    };
};

})()),
"[project]/components/ChevronStepper.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>ChevronStepper
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
'use client';
;
;
function ChevronStepper({ steps, currentStep, onStepClick, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-b433722c44d104f3" + " " + `chevron-stepper ${className}`,
        children: [
            steps.map((step, index)=>{
                const isActive = step.id === currentStep;
                const isCompleted = step.completed;
                const isStarted = step.started;
                const isDisabled = step.disabled;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: ()=>!isDisabled && onStepClick(step.id),
                    style: {
                        zIndex: steps.length - index
                    },
                    className: "jsx-b433722c44d104f3" + " " + `chevron-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isStarted && !isCompleted ? 'started' : ''} ${isDisabled ? 'disabled' : ''}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b433722c44d104f3" + " " + "chevron-content",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b433722c44d104f3" + " " + "step-icon",
                                children: isCompleted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-b433722c44d104f3" + " " + "checkbox-icon",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-b433722c44d104f3" + " " + "icon",
                                        children: "check_box"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChevronStepper.tsx",
                                        lineNumber: 38,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ChevronStepper.tsx",
                                    lineNumber: 37,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-b433722c44d104f3" + " " + "step-number",
                                    children: index + 1
                                }, void 0, false, {
                                    fileName: "[project]/components/ChevronStepper.tsx",
                                    lineNumber: 41,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ChevronStepper.tsx",
                                lineNumber: 35,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-b433722c44d104f3" + " " + "step-title",
                                children: step.title
                            }, void 0, false, {
                                fileName: "[project]/components/ChevronStepper.tsx",
                                lineNumber: 44,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChevronStepper.tsx",
                        lineNumber: 34,
                        columnNumber: 13
                    }, this)
                }, step.id, false, {
                    fileName: "[project]/components/ChevronStepper.tsx",
                    lineNumber: 28,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "b433722c44d104f3",
                children: ".chevron-stepper.jsx-b433722c44d104f3{border-radius:8px;align-items:center;width:100%;margin:0;padding:0;display:flex;overflow:hidden;box-shadow:0 2px 4px #0000001a}.chevron-stepper.full-width.jsx-b433722c44d104f3{width:100%}.chevron-stepper.full-width.jsx-b433722c44d104f3 .chevron-step.jsx-b433722c44d104f3{flex:1;min-width:0}.chevron-step.jsx-b433722c44d104f3{color:#64748b;cursor:pointer;clip-path:polygon(0 0,calc(100% - 14px) 0,100% 50%,calc(100% - 14px) 100%,0 100%,14px 50%);background:linear-gradient(135deg,#f1f5f9 0%,#e2e8f0 100%);border:1px solid #cbd5e1;align-items:center;min-width:140px;margin-right:-14px;padding:20px 28px 20px 20px;transition:all .3s;display:flex;position:relative}.chevron-step.jsx-b433722c44d104f3:first-child{clip-path:polygon(0 0,calc(100% - 14px) 0,100% 50%,calc(100% - 14px) 100%,0 100%);margin-left:0;padding-left:24px}.chevron-step.jsx-b433722c44d104f3:last-child{clip-path:polygon(0 0,100% 0,100% 100%,0 100%,14px 50%);margin-right:0;padding-right:24px}.chevron-step.jsx-b433722c44d104f3:first-child:last-child{clip-path:none;margin-right:0}.chevron-step.completed.jsx-b433722c44d104f3{color:#fff;background:linear-gradient(135deg,#10b981 0%,#059669 100%);border-color:#047857;box-shadow:0 2px 8px #10b9814d}.chevron-step.active.jsx-b433722c44d104f3{color:#fff;background:linear-gradient(135deg,#8b5cf6 0%,#7c3aed 100%);border-color:#6d28d9;transform:scale(1.02);box-shadow:0 4px 12px #8b5cf666}.chevron-step.started.jsx-b433722c44d104f3{color:#6d28d9;background:linear-gradient(135deg,#ddd6fe 0%,#c4b5fd 100%);border-color:#8b5cf6;box-shadow:0 2px 8px #8b5cf633}.chevron-step.started.jsx-b433722c44d104f3 .step-icon.jsx-b433722c44d104f3{color:#fff;background:linear-gradient(135deg,#8b5cf6 0%,#7c3aed 100%)}.chevron-step.disabled.jsx-b433722c44d104f3{color:#94a3b8;cursor:not-allowed;opacity:.6;background:linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%);border-color:#e2e8f0}.chevron-step.jsx-b433722c44d104f3:not(.disabled):hover{color:#475569;background:linear-gradient(135deg,#e2e8f0 0%,#cbd5e1 100%);transform:translateY(-1px);box-shadow:0 2px 8px #0000001a}.chevron-step.completed.jsx-b433722c44d104f3:hover{background:linear-gradient(135deg,#059669 0%,#047857 100%);box-shadow:0 4px 12px #10b98166}.chevron-step.active.jsx-b433722c44d104f3:hover{background:linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%);box-shadow:0 6px 16px #8b5cf680}.chevron-step.disabled.jsx-b433722c44d104f3:hover{color:#94a3b8;box-shadow:none;background:linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%);transform:none}.chevron-content.jsx-b433722c44d104f3{z-index:1;align-items:center;gap:8px;display:flex;position:relative}.step-icon.jsx-b433722c44d104f3{background:#fff3;border-radius:50%;justify-content:center;align-items:center;width:24px;height:24px;font-size:14px;font-weight:600;display:flex}.chevron-step.completed.jsx-b433722c44d104f3 .step-icon.jsx-b433722c44d104f3,.chevron-step.active.jsx-b433722c44d104f3 .step-icon.jsx-b433722c44d104f3{background:#ffffff4d}.chevron-step.disabled.jsx-b433722c44d104f3 .step-icon.jsx-b433722c44d104f3{background:#94a3b84d}.step-number.jsx-b433722c44d104f3{font-size:12px;font-weight:600}.step-title.jsx-b433722c44d104f3{white-space:nowrap;font-size:14px;font-weight:500}.icon.jsx-b433722c44d104f3{font-family:Material Icons;font-size:16px}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChevronStepper.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c = ChevronStepper;
var _c;
__turbopack_refresh__.register(_c, "ChevronStepper");

})()),
"[project]/components/CaseSetupTracker.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>CaseSetupTracker
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChevronStepper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/ChevronStepper.tsx [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
const SETUP_STEPS = [
    {
        id: 'associations',
        title: 'Associations',
        description: 'Manage family associations and relationships',
        required: true
    },
    {
        id: 'living_arrangements',
        title: 'Living Arrangements',
        description: 'Document current living arrangements for all children',
        required: true
    },
    {
        id: 'services',
        title: 'Services',
        description: 'Set up and manage case services',
        required: true
    },
    {
        id: 'court',
        title: 'Court',
        description: 'Manage court information and legal documents',
        required: true
    },
    {
        id: 'checklist',
        title: 'Checklist',
        description: 'SWCM completion checklist (completed by SWCM)',
        required: false
    },
    {
        id: 'approval',
        title: 'Approval',
        description: 'Supervisor approval (completed by supervisor)',
        required: false
    }
];
function CaseSetupTracker({ case_, onProgressUpdate }) {
    _s();
    const [milestones, setMilestones] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('associations');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load progress from localStorage
    const loadProgress = ()=>{
        try {
            const saved = localStorage.getItem(`case_setup_${case_.case_id}`);
            const completedIds = saved ? JSON.parse(saved).completedMilestones || [] : [];
            const milestonesWithProgress = SETUP_STEPS.map((milestone)=>({
                    ...milestone,
                    completed: completedIds.includes(milestone.id)
                }));
            setMilestones(milestonesWithProgress);
        } catch (error) {
            console.error('Error loading case setup progress:', error);
            setMilestones(SETUP_STEPS.map((m)=>({
                    ...m,
                    completed: false
                })));
        }
    };
    // Save progress to localStorage
    const saveProgress = (completedIds)=>{
        try {
            const progressData = {
                caseId: case_.case_id,
                completedMilestones: completedIds,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(`case_setup_${case_.case_id}`, JSON.stringify(progressData));
            if (onProgressUpdate) {
                onProgressUpdate();
            }
        } catch (error) {
            console.error('Error saving case setup progress:', error);
        }
    };
    // Handle step click
    const handleStepClick = (stepId)=>{
        setCurrentStep(stepId);
        // Navigate to the appropriate tab and section based on the step
        switch(stepId){
            case 'associations':
                // Navigate to People & Associations tab
                const peopleTab = document.querySelector('[data-tab="people"]');
                if (peopleTab) {
                    peopleTab.click();
                    // Wait for tab to load, then scroll to associations
                    setTimeout(()=>{
                        const associationsSubTab = document.querySelector('[data-subtab="associations"]');
                        if (associationsSubTab) {
                            associationsSubTab.click();
                        }
                    }, 100);
                }
                break;
            case 'living_arrangements':
                // Navigate to Case Management tab, Living Arrangements section
                const caseManagementTab = document.querySelector('[data-tab="case-management"]');
                if (caseManagementTab) {
                    caseManagementTab.click();
                    setTimeout(()=>{
                        const livingSubTab = document.querySelector('[data-subtab="living"]');
                        if (livingSubTab) {
                            livingSubTab.click();
                        }
                    }, 100);
                }
                break;
            case 'services':
                // Navigate to Case Management tab, Services section
                const servicesTab = document.querySelector('[data-tab="case-management"]');
                if (servicesTab) {
                    servicesTab.click();
                    setTimeout(()=>{
                        const servicesSubTab = document.querySelector('[data-subtab="services"]');
                        if (servicesSubTab) {
                            servicesSubTab.click();
                        }
                    }, 100);
                }
                break;
            case 'court':
                // Navigate to Legal & Documentation tab, Court section
                const legalTab = document.querySelector('[data-tab="legal"]');
                if (legalTab) {
                    legalTab.click();
                    setTimeout(()=>{
                        const courtSubTab = document.querySelector('[data-subtab="court"]');
                        if (courtSubTab) {
                            courtSubTab.click();
                        }
                    }, 100);
                }
                break;
            default:
                break;
        }
    };
    // Toggle milestone completion
    const toggleMilestone = (milestoneId)=>{
        setMilestones((prev)=>{
            const updated = prev.map((milestone)=>milestone.id === milestoneId ? {
                    ...milestone,
                    completed: !milestone.completed
                } : milestone);
            // Save to localStorage
            const completedIds = updated.filter((m)=>m.completed).map((m)=>m.id);
            saveProgress(completedIds);
            return updated;
        });
    };
    // Calculate progress
    const getProgress = ()=>{
        const completed = milestones.filter((m)=>m.completed).length;
        const total = milestones.length;
        const percentage = total > 0 ? Math.round(completed / total * 100) : 0;
        return {
            completed,
            total,
            percentage
        };
    };
    // Check if case setup is complete
    const isSetupComplete = ()=>{
        const requiredMilestones = milestones.filter((m)=>m.required);
        return requiredMilestones.every((m)=>m.completed);
    };
    // Handle complete setup
    const handleCompleteSetup = async ()=>{
        if (!isSetupComplete()) return;
        setLoading(true);
        try {
            // Update case status to "Pending Approval" via API
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCase"])(case_.case_id, {
                status: 'Pending Approval'
            });
            if (response.error) {
                console.error('Error updating case status:', response.error);
                // Don't clear progress if API call failed
                return;
            }
            // Clear the setup progress since it's complete
            localStorage.removeItem(`case_setup_${case_.case_id}`);
            if (onProgressUpdate) {
                onProgressUpdate();
            }
        } catch (error) {
            console.error('Error completing case setup:', error);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadProgress();
    }, [
        case_.case_id
    ]);
    const progress = getProgress();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "case-setup-tracker",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "setup-stepper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChevronStepper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    steps: milestones.map((milestone)=>({
                            id: milestone.id,
                            title: milestone.title,
                            completed: milestone.completed,
                            disabled: milestone.id === 'checklist' || milestone.id === 'approval'
                        })),
                    currentStep: currentStep,
                    onStepClick: handleStepClick,
                    className: "full-width"
                }, void 0, false, {
                    fileName: "[project]/components/CaseSetupTracker.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/CaseSetupTracker.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this),
            case_.status === 'Case Setup' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 'var(--unit-6)'
                },
                children: [
                    currentStep === 'associations' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Associations"
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 267,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Manage family associations and relationships for this case."
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 268,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CaseSetupTracker.tsx",
                        lineNumber: 266,
                        columnNumber: 13
                    }, this),
                    currentStep === 'living_arrangements' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Living Arrangements"
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 273,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Document current living arrangements for all children in this case."
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 274,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CaseSetupTracker.tsx",
                        lineNumber: 272,
                        columnNumber: 13
                    }, this),
                    currentStep === 'services' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Services"
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 279,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Set up and manage case services and support programs."
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 280,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CaseSetupTracker.tsx",
                        lineNumber: 278,
                        columnNumber: 13
                    }, this),
                    currentStep === 'court' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Court"
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 285,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Manage court information and legal documents for this case."
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 286,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CaseSetupTracker.tsx",
                        lineNumber: 284,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CaseSetupTracker.tsx",
                lineNumber: 264,
                columnNumber: 9
            }, this),
            isSetupComplete() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "setup-completion",
                style: {
                    marginTop: 'var(--unit-6)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "completion-message",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "icon",
                                children: "celebration"
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 295,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Case Setup Complete!"
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 296,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "All required steps have been completed. You can now submit for supervisor review."
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 297,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CaseSetupTracker.tsx",
                        lineNumber: 294,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleCompleteSetup,
                        className: "action-btn primary large",
                        disabled: loading,
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "icon",
                                    children: "hourglass_empty"
                                }, void 0, false, {
                                    fileName: "[project]/components/CaseSetupTracker.tsx",
                                    lineNumber: 306,
                                    columnNumber: 17
                                }, this),
                                "Submitting..."
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "icon",
                                    children: "send"
                                }, void 0, false, {
                                    fileName: "[project]/components/CaseSetupTracker.tsx",
                                    lineNumber: 311,
                                    columnNumber: 17
                                }, this),
                                "Submit for Review"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/components/CaseSetupTracker.tsx",
                        lineNumber: 299,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CaseSetupTracker.tsx",
                lineNumber: 293,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CaseSetupTracker.tsx",
        lineNumber: 247,
        columnNumber: 5
    }, this);
}
_s(CaseSetupTracker, "I9SFpmyURs5soXMTwb/mgPWjAN8=");
_c = CaseSetupTracker;
var _c;
__turbopack_refresh__.register(_c, "CaseSetupTracker");

})()),
"[project]/app/cases/[caseId]/page.tsx [app-client] (ecmascript)": (function({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__, m: module, e: exports, t: require }) { !function() {

const e = new Error(`Could not parse module '[project]/app/cases/[caseId]/page.tsx'

Unexpected token `div`. Expected jsx identifier`);
e.code = 'MODULE_UNPARSEABLE';
throw e;
}.call(this) }),
"[project]/app/cases/[caseId]/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=_c0e6aa._.js.map