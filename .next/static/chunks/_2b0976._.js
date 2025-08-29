(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_2b0976._.js", {

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
"[project]/components/ProgressBar.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>ProgressBar
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
'use client';
;
function ProgressBar({ percentage, size = 'medium', showText = true, text, className = '' }) {
    // Ensure percentage is between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    const sizeClasses = {
        small: 'progress-bar-small',
        medium: 'progress-bar',
        large: 'progress-bar-large'
    };
    const fillClasses = {
        small: 'progress-fill-small',
        medium: 'progress-fill',
        large: 'progress-fill-large'
    };
    const textClasses = {
        small: 'progress-text-small',
        medium: 'progress-text',
        large: 'progress-text-large'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `progress-container ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: sizeClasses[size],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: fillClasses[size],
                    style: {
                        width: `${clampedPercentage}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/components/ProgressBar.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ProgressBar.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            showText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: textClasses[size],
                children: text || `${Math.round(clampedPercentage)}%`
            }, void 0, false, {
                fileName: "[project]/components/ProgressBar.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ProgressBar.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_c = ProgressBar;
var _c;
__turbopack_refresh__.register(_c, "ProgressBar");

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
        className: "jsx-83cc9bef8a2d51ee" + " " + `chevron-stepper ${className}`,
        children: [
            steps.map((step, index)=>{
                const isActive = step.id === currentStep;
                const isCompleted = step.completed;
                const isDisabled = step.disabled;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: ()=>!isDisabled && onStepClick(step.id),
                    style: {
                        zIndex: steps.length - index
                    },
                    className: "jsx-83cc9bef8a2d51ee" + " " + `chevron-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isDisabled ? 'disabled' : ''}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-83cc9bef8a2d51ee" + " " + "chevron-content",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-83cc9bef8a2d51ee" + " " + "step-icon",
                                children: isCompleted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-83cc9bef8a2d51ee" + " " + "icon",
                                    children: "check"
                                }, void 0, false, {
                                    fileName: "[project]/components/ChevronStepper.tsx",
                                    lineNumber: 35,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-83cc9bef8a2d51ee" + " " + "step-number",
                                    children: index + 1
                                }, void 0, false, {
                                    fileName: "[project]/components/ChevronStepper.tsx",
                                    lineNumber: 37,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ChevronStepper.tsx",
                                lineNumber: 33,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-83cc9bef8a2d51ee" + " " + "step-title",
                                children: step.title
                            }, void 0, false, {
                                fileName: "[project]/components/ChevronStepper.tsx",
                                lineNumber: 40,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChevronStepper.tsx",
                        lineNumber: 32,
                        columnNumber: 13
                    }, this)
                }, step.id, false, {
                    fileName: "[project]/components/ChevronStepper.tsx",
                    lineNumber: 26,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "83cc9bef8a2d51ee",
                children: ".chevron-stepper.jsx-83cc9bef8a2d51ee{border-radius:8px;align-items:center;margin:0;padding:0;display:flex;overflow:hidden;box-shadow:0 2px 4px #0000001a}.chevron-step.jsx-83cc9bef8a2d51ee{color:#64748b;cursor:pointer;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,0 100%,12px 50%);background:#f8fafc;align-items:center;min-width:140px;margin-right:-12px;padding:16px 24px 16px 16px;transition:all .2s;display:flex;position:relative}.chevron-step.jsx-83cc9bef8a2d51ee:first-child{clip-path:polygon(0 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,0 100%);margin-left:0;padding-left:20px}.chevron-step.jsx-83cc9bef8a2d51ee:last-child{clip-path:polygon(0 0,100% 0,100% 100%,0 100%,12px 50%);margin-right:0;padding-right:20px}.chevron-step.jsx-83cc9bef8a2d51ee:first-child:last-child{clip-path:none;margin-right:0}.chevron-step.completed.jsx-83cc9bef8a2d51ee{color:#fff;background:#3b82f6}.chevron-step.active.jsx-83cc9bef8a2d51ee{color:#fff;background:#1e40af;transform:scale(1.02)}.chevron-step.disabled.jsx-83cc9bef8a2d51ee{color:#94a3b8;cursor:not-allowed;opacity:.6;background:#e2e8f0}.chevron-step.jsx-83cc9bef8a2d51ee:not(.disabled):hover{color:#475569;background:#e2e8f0}.chevron-step.completed.jsx-83cc9bef8a2d51ee:hover,.chevron-step.active.jsx-83cc9bef8a2d51ee:hover{background:#1d4ed8}.chevron-step.disabled.jsx-83cc9bef8a2d51ee:hover{color:#94a3b8;background:#e2e8f0}.chevron-content.jsx-83cc9bef8a2d51ee{z-index:1;align-items:center;gap:8px;display:flex;position:relative}.step-icon.jsx-83cc9bef8a2d51ee{background:#fff3;border-radius:50%;justify-content:center;align-items:center;width:24px;height:24px;font-size:14px;font-weight:600;display:flex}.chevron-step.completed.jsx-83cc9bef8a2d51ee .step-icon.jsx-83cc9bef8a2d51ee,.chevron-step.active.jsx-83cc9bef8a2d51ee .step-icon.jsx-83cc9bef8a2d51ee{background:#ffffff4d}.chevron-step.disabled.jsx-83cc9bef8a2d51ee .step-icon.jsx-83cc9bef8a2d51ee{background:#94a3b84d}.step-number.jsx-83cc9bef8a2d51ee{font-size:12px;font-weight:600}.step-title.jsx-83cc9bef8a2d51ee{white-space:nowrap;font-size:14px;font-weight:500}.icon.jsx-83cc9bef8a2d51ee{font-family:Material Icons;font-size:16px}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChevronStepper.tsx",
        lineNumber: 19,
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
        // Scroll to the corresponding section on the page
        const element = document.getElementById(stepId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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
                    lineNumber: 190,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/CaseSetupTracker.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this),
            isSetupComplete() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "setup-completion",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "completion-message",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "icon",
                                children: "celebration"
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Case Setup Complete!"
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 207,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "All required steps have been completed. You can now submit for supervisor review."
                            }, void 0, false, {
                                fileName: "[project]/components/CaseSetupTracker.tsx",
                                lineNumber: 208,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CaseSetupTracker.tsx",
                        lineNumber: 205,
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
                                    lineNumber: 217,
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
                                    lineNumber: 222,
                                    columnNumber: 17
                                }, this),
                                "Submit for Review"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/components/CaseSetupTracker.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CaseSetupTracker.tsx",
                lineNumber: 204,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CaseSetupTracker.tsx",
        lineNumber: 188,
        columnNumber: 5
    }, this);
}
_s(CaseSetupTracker, "I9SFpmyURs5soXMTwb/mgPWjAN8=");
_c = CaseSetupTracker;
var _c;
__turbopack_refresh__.register(_c, "CaseSetupTracker");

})()),
"[project]/app/cases/[caseId]/page.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>CaseDetailPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CaseSetupTracker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/CaseSetupTracker.tsx [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
;
;
function CaseDetailPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const caseId = params.caseId;
    const [caseData, setCaseData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [persons, setPersons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [timelineEvents, setTimelineEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('overview');
    const [activeSubTab, setActiveSubTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        'people': 'people',
        'case-management': 'services',
        'legal': 'court'
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (caseId) {
            loadCaseData();
        }
    }, [
        caseId
    ]);
    const loadCaseData = async ()=>{
        setLoading(true);
        setError(null);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCaseById"])(caseId);
            if (response.error) {
                setError(response.error);
            } else if (response.data) {
                setCaseData(response.data);
                setPersons(response.data.persons || []);
                setTimelineEvents(response.data.timeline_events || []);
            } else {
                setError('Case not found');
            }
        } catch (err) {
            setError('Failed to load case data');
        }
        setLoading(false);
    };
    const getPriorityColor = (priority)=>{
        switch(priority.toLowerCase()){
            case 'high':
                return 'error';
            case 'medium':
                return 'secondary';
            case 'low':
                return 'tertiary';
            default:
                return 'secondary';
        }
    };
    const getStatusColor = (status)=>{
        switch(status.toLowerCase()){
            case 'active':
                return 'primary';
            case 'pending assignment':
                return 'secondary';
            case 'closed':
                return 'tertiary';
            case 'draft':
                return 'tertiary';
            default:
                return 'secondary';
        }
    };
    const getEventIcon = (eventType)=>{
        switch(eventType){
            case 'case_note':
                return 'note';
            case 'visit':
                return 'home';
            case 'court_hearing':
                return 'gavel';
            case 'placement_change':
                return 'swap_horiz';
            case 'assessment':
                return 'assignment';
            case 'document_upload':
                return 'upload_file';
            case 'assignment_change':
                return 'person_add';
            default:
                return 'event';
        }
    };
    const getEventColor = (priority)=>{
        switch(priority){
            case 'high':
                return 'error';
            case 'medium':
                return 'secondary';
            default:
                return 'primary';
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "page-container",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "page-title",
                        children: "Loading Case Details..."
                    }, void 0, false, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "page-description",
                        children: "Please wait while we load the case information."
                    }, void 0, false, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cases/[caseId]/page.tsx",
                lineNumber: 102,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/cases/[caseId]/page.tsx",
            lineNumber: 101,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "page-container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "page-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "page-title",
                            children: "Error Loading Case"
                        }, void 0, false, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "page-description",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "content-wrapper",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "error-message",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "icon",
                                    children: "error"
                                }, void 0, false, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Unable to load case details. Please try again or contact support if the problem persists."
                                }, void 0, false, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "action-btn primary",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "icon",
                                    children: "arrow_back"
                                }, void 0, false, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this),
                                "Back to Dashboard"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                    lineNumber: 117,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/cases/[caseId]/page.tsx",
            lineNumber: 112,
            columnNumber: 7
        }, this);
    }
    if (!caseData) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "page-container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "page-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "page-title",
                            children: "Case Not Found"
                        }, void 0, false, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 135,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "page-description",
                            children: "The requested case could not be found."
                        }, void 0, false, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                    lineNumber: 134,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "content-wrapper",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "action-btn primary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "icon",
                                children: "arrow_back"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, this),
                            "Back to Dashboard"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/cases/[caseId]/page.tsx",
            lineNumber: 133,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 'var(--unit-4)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "page-title",
                                        children: caseData.case_display_name || caseData.family_name
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "page-description",
                                        style: {
                                            fontSize: '1.1rem',
                                            marginBottom: 'var(--unit-2)'
                                        },
                                        children: [
                                            caseData.case_number,
                                            " • Primary Child: ",
                                            caseData.primary_child
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: 'var(--unit-2)',
                                            marginBottom: 'var(--unit-2)'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `badge ${getStatusColor(caseData.status)}`,
                                            children: caseData.status
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this),
                                    caseData.status === 'Case Setup' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "case-setup-progress",
                                        style: {
                                            marginBottom: 'var(--unit-4)'
                                        },
                                        children: (()=>{
                                            const getSetupProgress = (caseId)=>{
                                                try {
                                                    const saved = localStorage.getItem(`cpw_setup_${caseId}`);
                                                    if (!saved) return {
                                                        step: 0,
                                                        total: 4,
                                                        percentage: 0
                                                    };
                                                    const data = JSON.parse(saved);
                                                    const currentStep = data.currentStep || 1;
                                                    const total = 4;
                                                    const percentage = Math.round(currentStep / total * 100);
                                                    return {
                                                        step: currentStep,
                                                        total,
                                                        percentage
                                                    };
                                                } catch (error) {
                                                    return {
                                                        step: 0,
                                                        total: 4,
                                                        percentage: 0
                                                    };
                                                }
                                            };
                                            const progress = getSetupProgress(caseData.case_id);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            marginBottom: '8px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                style: {
                                                                    margin: 0,
                                                                    fontSize: '0.9rem',
                                                                    color: 'var(--text-secondary)'
                                                                },
                                                                children: "Case Setup Progress"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                lineNumber: 188,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '0.8rem',
                                                                    color: 'var(--text-secondary)'
                                                                },
                                                                children: progress.step > 0 ? `Step ${progress.step} of ${progress.total}` : 'Not Started'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                lineNumber: 191,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                        lineNumber: 187,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: '100%',
                                                            height: '8px',
                                                            backgroundColor: '#e2e8f0',
                                                            borderRadius: '4px',
                                                            overflow: 'hidden'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                width: `${progress.percentage}%`,
                                                                height: '100%',
                                                                backgroundColor: progress.percentage > 0 ? '#3b82f6' : '#e2e8f0',
                                                                transition: 'width 0.3s ease'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                            lineNumber: 202,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                        lineNumber: 195,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 186,
                                                columnNumber: 21
                                            }, this);
                                        })()
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 'var(--unit-2)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/",
                                        className: "action-btn secondary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "icon",
                                                children: "arrow_back"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 217,
                                                columnNumber: 15
                                            }, this),
                                            "Back to Dashboard"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 216,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "action-btn primary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "icon",
                                                children: "edit"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 221,
                                                columnNumber: 15
                                            }, this),
                                            "Edit Case"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 220,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 215,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "case-summary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "summary-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        children: "schedule"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 229,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Intake Date:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 231,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: new Date(caseData.created_date).toLocaleDateString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 232,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 228,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "summary-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        children: "assignment_turned_in"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 236,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Assessment Approval Date:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 238,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: caseData.workflow_status?.cpw_supervisor_approved ? new Date(caseData.last_updated).toLocaleDateString() : 'Pending'
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 239,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 237,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "summary-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        children: "report"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 243,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Allegation(s):"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 245,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: caseData.allegation_type
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 246,
                                                columnNumber: 15
                                            }, this),
                                            caseData.allegation_description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: '0.9rem',
                                                    color: 'var(--text-secondary)',
                                                    marginTop: '4px'
                                                },
                                                children: caseData.allegation_description
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 248,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 244,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "summary-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        children: "child_care"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 255,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Child(ren):"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 257,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: persons.filter((person)=>person.role === 'Client' || person.role === 'child').length > 0 ? persons.filter((person)=>person.role === 'Client' || person.role === 'child').map((child, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: `/persons/${child.person_id}`,
                                                                className: "child-link",
                                                                style: {
                                                                    color: 'var(--primary)',
                                                                    textDecoration: 'none'
                                                                },
                                                                children: [
                                                                    child.first_name,
                                                                    " ",
                                                                    child.last_name
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                lineNumber: 264,
                                                                columnNumber: 25
                                                            }, this),
                                                            index < persons.filter((person)=>person.role === 'Client' || person.role === 'child').length - 1 && ', '
                                                        ]
                                                    }, child.person_id, true, {
                                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                        lineNumber: 263,
                                                        columnNumber: 23
                                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--text-secondary)'
                                                    },
                                                    children: "No children listed"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 275,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 258,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 256,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "summary-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        children: "person"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 281,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Assigned Worker:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 283,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: caseData.assigned_worker || 'Unassigned'
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 284,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 282,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 280,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "summary-item",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        children: "location_on"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 288,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "County:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 290,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: caseData.county
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 291,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 289,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 287,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cases/[caseId]/page.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            caseData.status === 'Case Setup' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 'var(--unit-6)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CaseSetupTracker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    case_: caseData,
                    onProgressUpdate: loadCaseData
                }, void 0, false, {
                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                    lineNumber: 300,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/cases/[caseId]/page.tsx",
                lineNumber: 299,
                columnNumber: 9
            }, this),
            caseData.status === 'Case Setup' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "case-setup-content",
                style: {
                    marginBottom: 'var(--unit-6)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "associations",
                        className: "setup-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Associations"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 311,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Manage family associations and relationships for this case."
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 312,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 310,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "living_arrangements",
                        className: "setup-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Living Arrangements"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 317,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Document current living arrangements for all children in this case."
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 318,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 316,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "services",
                        className: "setup-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Services"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 323,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Set up and manage case services and support programs."
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 324,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 322,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "court",
                        className: "setup-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Court"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 329,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Manage court information and legal documents for this case."
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 330,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 328,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "checklist",
                        className: "setup-section disabled",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Checklist"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 335,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "SWCM completion checklist (this section is completed by the assigned SWCM)."
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 336,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 334,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "approval",
                        className: "setup-section disabled",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Approval"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 340,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Supervisor approval (this section is completed by the supervisor)."
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 341,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 339,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cases/[caseId]/page.tsx",
                lineNumber: 309,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tab-navigation",
                style: {
                    marginBottom: 'var(--unit-6)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: activeTab === 'overview' ? 'active' : '',
                        onClick: ()=>setActiveTab('overview'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "icon",
                                children: "dashboard"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 352,
                                columnNumber: 11
                            }, this),
                            "Overview"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 348,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: activeTab === 'people' ? 'active' : '',
                        onClick: ()=>setActiveTab('people'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "icon",
                                children: "people"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 359,
                                columnNumber: 11
                            }, this),
                            "People & Associations (",
                            persons.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 355,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: activeTab === 'case-management' ? 'active' : '',
                        onClick: ()=>setActiveTab('case-management'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "icon",
                                children: "work"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 366,
                                columnNumber: 11
                            }, this),
                            "Case Management"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 362,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: activeTab === 'legal' ? 'active' : '',
                        onClick: ()=>setActiveTab('legal'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "icon",
                                children: "gavel"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 373,
                                columnNumber: 11
                            }, this),
                            "Legal & Documentation"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: activeTab === 'timeline' ? 'active' : '',
                        onClick: ()=>setActiveTab('timeline'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "icon",
                                children: "timeline"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 380,
                                columnNumber: 11
                            }, this),
                            "Timeline (",
                            timelineEvents.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 376,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cases/[caseId]/page.tsx",
                lineNumber: 347,
                columnNumber: 7
            }, this),
            activeTab === 'overview' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tab-content",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overview-grid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            className: "overview-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Case Information"
                                }, void 0, false, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 391,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "detail-list",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "detail-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Allegation Description:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: caseData.allegation_description
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 395,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 393,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "detail-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Status:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: caseData.status
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 399,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 397,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "detail-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Priority Level:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: caseData.priority_level
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 403,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 401,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "detail-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Last Updated:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 406,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: new Date(caseData.last_updated).toLocaleDateString()
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 407,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 405,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "detail-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Risk Level:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 410,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: caseData.risk_level || 'Not assessed'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 411,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 409,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 392,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 390,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            className: "overview-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Recent Activity"
                                }, void 0, false, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 418,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "activity-list",
                                    children: [
                                        timelineEvents.slice(0, 3).map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "activity-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `activity-icon ${getEventColor(event.priority)}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "icon",
                                                            children: getEventIcon(event.event_type)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                            lineNumber: 423,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                        lineNumber: 422,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "activity-content",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: event.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                lineNumber: 426,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: event.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                lineNumber: 427,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "activity-date",
                                                                children: [
                                                                    new Date(event.date).toLocaleDateString(),
                                                                    " - ",
                                                                    event.created_by
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                lineNumber: 428,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                        lineNumber: 425,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, event.event_id, true, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 421,
                                                columnNumber: 19
                                            }, this)),
                                        timelineEvents.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: 'var(--text-secondary)',
                                                textAlign: 'center',
                                                padding: 'var(--unit-4)'
                                            },
                                            children: "No recent activity"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 435,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 419,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 417,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            className: "overview-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Recent Case Notes"
                                }, void 0, false, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 444,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "notes-list",
                                    children: [
                                        caseData.case_notes && caseData.case_notes.slice(0, 3).map((note)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "note-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "note-header",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: note.created_by
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                lineNumber: 449,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "note-date",
                                                                children: new Date(note.created_date).toLocaleDateString()
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                lineNumber: 450,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                        lineNumber: 448,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: note.text
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                        lineNumber: 454,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, note.note_id, true, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 447,
                                                columnNumber: 19
                                            }, this)),
                                        (!caseData.case_notes || caseData.case_notes.length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: 'var(--text-secondary)',
                                                textAlign: 'center',
                                                padding: 'var(--unit-4)'
                                            },
                                            children: "No case notes yet"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 458,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 445,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "action-btn secondary",
                                    style: {
                                        marginTop: 'var(--unit-4)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            children: "note_add"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 464,
                                            columnNumber: 17
                                        }, this),
                                        "Add Case Note"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 463,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 443,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                    lineNumber: 388,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/cases/[caseId]/page.tsx",
                lineNumber: 387,
                columnNumber: 9
            }, this),
            activeTab === 'timeline' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tab-content",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--unit-4)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Case Timeline"
                                }, void 0, false, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 476,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "action-btn primary",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            children: "add"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 478,
                                            columnNumber: 17
                                        }, this),
                                        "Add Event"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 477,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 475,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "timeline",
                            children: [
                                timelineEvents.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "timeline-item",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `timeline-marker ${getEventColor(event.priority)}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "icon",
                                                    children: getEventIcon(event.event_type)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 487,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 486,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "timeline-content",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "timeline-header",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: event.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                lineNumber: 491,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "timeline-date",
                                                                children: [
                                                                    new Date(event.date).toLocaleDateString(),
                                                                    " at ",
                                                                    new Date(event.date).toLocaleTimeString()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                lineNumber: 492,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                        lineNumber: 490,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: event.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                        lineNumber: 496,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "timeline-meta",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "timeline-author",
                                                                children: [
                                                                    "By: ",
                                                                    event.created_by
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                lineNumber: 498,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `timeline-type ${event.event_type}`,
                                                                children: event.event_type.replace('_', ' ').toUpperCase()
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                lineNumber: 499,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 489,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, event.event_id, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 485,
                                        columnNumber: 17
                                    }, this)),
                                timelineEvents.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: 'center',
                                        padding: 'var(--unit-8)',
                                        color: 'var(--text-secondary)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            style: {
                                                fontSize: '3rem',
                                                marginBottom: 'var(--unit-4)'
                                            },
                                            children: "timeline"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 509,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "No timeline events yet"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 510,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 508,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 483,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                    lineNumber: 474,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/cases/[caseId]/page.tsx",
                lineNumber: 473,
                columnNumber: 9
            }, this),
            activeTab === 'people' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tab-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            padding: '8px',
                            marginBottom: 'var(--unit-4)',
                            border: '1px solid #e2e8f0'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '4px',
                                width: '100%'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `sub-tab ${activeSubTab['people'] === 'people' ? 'active' : ''}`,
                                    onClick: ()=>setActiveSubTab({
                                            ...activeSubTab,
                                            'people': 'people'
                                        }),
                                    style: {
                                        padding: '12px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: activeSubTab['people'] === 'people' ? '#dbeafe' : 'transparent',
                                        color: activeSubTab['people'] === 'people' ? '#1e40af' : '#64748b',
                                        fontWeight: activeSubTab['people'] === 'people' ? '600' : '500',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            style: {
                                                fontSize: '18px'
                                            },
                                            children: "people"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 553,
                                            columnNumber: 17
                                        }, this),
                                        "People"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 534,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `sub-tab ${activeSubTab['people'] === 'associations' ? 'active' : ''}`,
                                    onClick: ()=>setActiveSubTab({
                                            ...activeSubTab,
                                            'people': 'associations'
                                        }),
                                    style: {
                                        padding: '12px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: activeSubTab['people'] === 'associations' ? '#dbeafe' : 'transparent',
                                        color: activeSubTab['people'] === 'associations' ? '#1e40af' : '#64748b',
                                        fontWeight: activeSubTab['people'] === 'associations' ? '600' : '500',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            style: {
                                                fontSize: '18px'
                                            },
                                            children: "family_restroom"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 575,
                                            columnNumber: 17
                                        }, this),
                                        "Associations"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 556,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `sub-tab ${activeSubTab['people'] === 'health' ? 'active' : ''}`,
                                    onClick: ()=>setActiveSubTab({
                                            ...activeSubTab,
                                            'people': 'health'
                                        }),
                                    style: {
                                        padding: '12px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: activeSubTab['people'] === 'health' ? '#dbeafe' : 'transparent',
                                        color: activeSubTab['people'] === 'health' ? '#1e40af' : '#64748b',
                                        fontWeight: activeSubTab['people'] === 'health' ? '600' : '500',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            style: {
                                                fontSize: '18px'
                                            },
                                            children: "medical_services"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 597,
                                            columnNumber: 17
                                        }, this),
                                        "Health"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 578,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `sub-tab ${activeSubTab['people'] === 'education' ? 'active' : ''}`,
                                    onClick: ()=>setActiveSubTab({
                                            ...activeSubTab,
                                            'people': 'education'
                                        }),
                                    style: {
                                        padding: '12px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: activeSubTab['people'] === 'education' ? '#dbeafe' : 'transparent',
                                        color: activeSubTab['people'] === 'education' ? '#1e40af' : '#64748b',
                                        fontWeight: activeSubTab['people'] === 'education' ? '600' : '500',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            style: {
                                                fontSize: '18px'
                                            },
                                            children: "school"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 619,
                                            columnNumber: 17
                                        }, this),
                                        "Education/Income"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 600,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 528,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 521,
                        columnNumber: 11
                    }, this),
                    activeSubTab['people'] === 'people' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 'var(--unit-4)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "People Involved"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 628,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "action-btn small primary",
                                        style: {
                                            padding: '8px 12px',
                                            fontSize: '13px',
                                            minWidth: 'auto',
                                            width: 'auto',
                                            flex: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "icon",
                                                style: {
                                                    fontSize: '16px'
                                                },
                                                children: "person_add"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 642,
                                                columnNumber: 19
                                            }, this),
                                            "Add Person"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 629,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 627,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "persons-grid",
                                children: [
                                    persons.map((person)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "person-card",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "person-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "person-info",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    children: [
                                                                        person.first_name,
                                                                        " ",
                                                                        person.last_name
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                    lineNumber: 652,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "person-role",
                                                                    children: person.role.charAt(0).toUpperCase() + person.role.slice(1)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                    lineNumber: 653,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "person-age",
                                                                    children: [
                                                                        "Age: ",
                                                                        Math.floor((new Date().getTime() - new Date(person.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                    lineNumber: 654,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                            lineNumber: 651,
                                                            columnNumber: 23
                                                        }, this),
                                                        person.indicators && person.indicators.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "person-indicators",
                                                            children: person.indicators.map((indicator, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "indicator-badge",
                                                                    children: indicator
                                                                }, index, false, {
                                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                    lineNumber: 661,
                                                                    columnNumber: 29
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                            lineNumber: 659,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 650,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "person-contact",
                                                    children: [
                                                        person.contact_info.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "contact-item",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "icon",
                                                                    children: "phone"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                    lineNumber: 672,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: person.contact_info.phone
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                    lineNumber: 673,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                            lineNumber: 671,
                                                            columnNumber: 25
                                                        }, this),
                                                        person.contact_info.address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "contact-item",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "icon",
                                                                    children: "location_on"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                    lineNumber: 678,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: person.contact_info.address
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                    lineNumber: 679,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                            lineNumber: 677,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 669,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "person-actions",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "action-btn primary",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "icon",
                                                                    children: "visibility"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                    lineNumber: 686,
                                                                    columnNumber: 25
                                                                }, this),
                                                                "View Profile"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                            lineNumber: 685,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "action-btn secondary",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "icon",
                                                                    children: "edit"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                                    lineNumber: 690,
                                                                    columnNumber: 25
                                                                }, this),
                                                                "Edit"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                            lineNumber: 689,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 684,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, person.person_id, true, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 649,
                                            columnNumber: 19
                                        }, this)),
                                    persons.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            textAlign: 'center',
                                            padding: 'var(--unit-8)',
                                            color: 'var(--text-secondary)',
                                            gridColumn: '1 / -1'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "icon",
                                                style: {
                                                    fontSize: '3rem',
                                                    marginBottom: 'var(--unit-4)'
                                                },
                                                children: "people"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 699,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "No people added to this case yet"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 700,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 698,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 647,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 626,
                        columnNumber: 13
                    }, this),
                    activeSubTab['people'] === 'associations' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Family Associations & Relationships"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 709,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    padding: 'var(--unit-8)',
                                    color: 'var(--text-secondary)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        style: {
                                            fontSize: '3rem',
                                            marginBottom: 'var(--unit-4)'
                                        },
                                        children: "family_restroom"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 711,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Association management feature coming soon"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 712,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 710,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 708,
                        columnNumber: 13
                    }, this),
                    activeSubTab['people'] === 'health' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Health Information"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 719,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    padding: 'var(--unit-8)',
                                    color: 'var(--text-secondary)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        style: {
                                            fontSize: '3rem',
                                            marginBottom: 'var(--unit-4)'
                                        },
                                        children: "medical_services"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 721,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Health information management feature coming soon"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 722,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 720,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 718,
                        columnNumber: 13
                    }, this),
                    activeSubTab['people'] === 'education' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Education & Income Information"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 729,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    padding: 'var(--unit-8)',
                                    color: 'var(--text-secondary)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        style: {
                                            fontSize: '3rem',
                                            marginBottom: 'var(--unit-4)'
                                        },
                                        children: "school"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 731,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Education and income tracking feature coming soon"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 732,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 730,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 728,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cases/[caseId]/page.tsx",
                lineNumber: 519,
                columnNumber: 9
            }, this),
            activeTab === 'case-management' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tab-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            padding: '8px',
                            marginBottom: 'var(--unit-4)',
                            border: '1px solid #e2e8f0'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '4px',
                                width: '100%'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `sub-tab ${activeSubTab['case-management'] === 'services' ? 'active' : ''}`,
                                    onClick: ()=>setActiveSubTab({
                                            ...activeSubTab,
                                            'case-management': 'services'
                                        }),
                                    style: {
                                        padding: '12px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: activeSubTab['case-management'] === 'services' ? '#dbeafe' : 'transparent',
                                        color: activeSubTab['case-management'] === 'services' ? '#1e40af' : '#64748b',
                                        fontWeight: activeSubTab['case-management'] === 'services' ? '600' : '500',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            style: {
                                                fontSize: '18px'
                                            },
                                            children: "support"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 774,
                                            columnNumber: 17
                                        }, this),
                                        "Services"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 755,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `sub-tab ${activeSubTab['case-management'] === 'living' ? 'active' : ''}`,
                                    onClick: ()=>setActiveSubTab({
                                            ...activeSubTab,
                                            'case-management': 'living'
                                        }),
                                    style: {
                                        padding: '12px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: activeSubTab['case-management'] === 'living' ? '#dbeafe' : 'transparent',
                                        color: activeSubTab['case-management'] === 'living' ? '#1e40af' : '#64748b',
                                        fontWeight: activeSubTab['case-management'] === 'living' ? '600' : '500',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            style: {
                                                fontSize: '18px'
                                            },
                                            children: "home"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 796,
                                            columnNumber: 17
                                        }, this),
                                        "Living Arrangements"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 777,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `sub-tab ${activeSubTab['case-management'] === 'notes' ? 'active' : ''}`,
                                    onClick: ()=>setActiveSubTab({
                                            ...activeSubTab,
                                            'case-management': 'notes'
                                        }),
                                    style: {
                                        padding: '12px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: activeSubTab['case-management'] === 'notes' ? '#dbeafe' : 'transparent',
                                        color: activeSubTab['case-management'] === 'notes' ? '#1e40af' : '#64748b',
                                        fontWeight: activeSubTab['case-management'] === 'notes' ? '600' : '500',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            style: {
                                                fontSize: '18px'
                                            },
                                            children: "note"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 818,
                                            columnNumber: 17
                                        }, this),
                                        "Notes"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 799,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 749,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 742,
                        columnNumber: 11
                    }, this),
                    activeSubTab['case-management'] === 'services' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Services & Support"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 826,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    padding: 'var(--unit-8)',
                                    color: 'var(--text-secondary)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        style: {
                                            fontSize: '3rem',
                                            marginBottom: 'var(--unit-4)'
                                        },
                                        children: "support"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 828,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Services management feature coming soon"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 829,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 827,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 825,
                        columnNumber: 13
                    }, this),
                    activeSubTab['case-management'] === 'living' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Living Arrangements & Placements"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 836,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    padding: 'var(--unit-8)',
                                    color: 'var(--text-secondary)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        style: {
                                            fontSize: '3rem',
                                            marginBottom: 'var(--unit-4)'
                                        },
                                        children: "home"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 838,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Living arrangements tracking feature coming soon"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 839,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 837,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 835,
                        columnNumber: 13
                    }, this),
                    activeSubTab['case-management'] === 'notes' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 'var(--unit-4)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Case Notes"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 847,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "action-btn primary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "icon",
                                                children: "note_add"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 849,
                                                columnNumber: 19
                                            }, this),
                                            "Add Note"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 848,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 846,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "notes-list",
                                children: [
                                    caseData.case_notes && caseData.case_notes.map((note)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "note-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "note-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: note.created_by
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                            lineNumber: 858,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "note-date",
                                                            children: new Date(note.created_date).toLocaleDateString()
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                            lineNumber: 859,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 857,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: note.text
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                    lineNumber: 863,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, note.note_id, true, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 856,
                                            columnNumber: 19
                                        }, this)),
                                    (!caseData.case_notes || caseData.case_notes.length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: 'var(--text-secondary)',
                                            textAlign: 'center',
                                            padding: 'var(--unit-4)'
                                        },
                                        children: "No case notes yet"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 867,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 854,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 845,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cases/[caseId]/page.tsx",
                lineNumber: 740,
                columnNumber: 9
            }, this),
            activeTab === 'legal' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tab-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            padding: '8px',
                            marginBottom: 'var(--unit-4)',
                            border: '1px solid #e2e8f0'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '4px',
                                width: '100%'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `sub-tab ${activeSubTab['legal'] === 'court' ? 'active' : ''}`,
                                    onClick: ()=>setActiveSubTab({
                                            ...activeSubTab,
                                            'legal': 'court'
                                        }),
                                    style: {
                                        padding: '12px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: activeSubTab['legal'] === 'court' ? '#dbeafe' : 'transparent',
                                        color: activeSubTab['legal'] === 'court' ? '#1e40af' : '#64748b',
                                        fontWeight: activeSubTab['legal'] === 'court' ? '600' : '500',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            style: {
                                                fontSize: '18px'
                                            },
                                            children: "gavel"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 912,
                                            columnNumber: 17
                                        }, this),
                                        "Court"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 893,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `sub-tab ${activeSubTab['legal'] === 'documents' ? 'active' : ''}`,
                                    onClick: ()=>setActiveSubTab({
                                            ...activeSubTab,
                                            'legal': 'documents'
                                        }),
                                    style: {
                                        padding: '12px 16px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: activeSubTab['legal'] === 'documents' ? '#dbeafe' : 'transparent',
                                        color: activeSubTab['legal'] === 'documents' ? '#1e40af' : '#64748b',
                                        fontWeight: activeSubTab['legal'] === 'documents' ? '600' : '500',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            style: {
                                                fontSize: '18px'
                                            },
                                            children: "folder"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                                            lineNumber: 934,
                                            columnNumber: 17
                                        }, this),
                                        "Electronic Case File"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cases/[caseId]/page.tsx",
                                    lineNumber: 915,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cases/[caseId]/page.tsx",
                            lineNumber: 887,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 880,
                        columnNumber: 11
                    }, this),
                    activeSubTab['legal'] === 'court' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Court Information & Legal Documents"
                            }, void 0, false, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 942,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    padding: 'var(--unit-8)',
                                    color: 'var(--text-secondary)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        style: {
                                            fontSize: '3rem',
                                            marginBottom: 'var(--unit-4)'
                                        },
                                        children: "gavel"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 944,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Court management feature coming soon"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 945,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 943,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 941,
                        columnNumber: 13
                    }, this),
                    activeSubTab['legal'] === 'documents' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 'var(--unit-4)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Electronic Case File (ECF)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 953,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "action-btn primary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "icon",
                                                children: "upload_file"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                                lineNumber: 955,
                                                columnNumber: 19
                                            }, this),
                                            "Upload Document"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 954,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 952,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    padding: 'var(--unit-8)',
                                    color: 'var(--text-secondary)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        style: {
                                            fontSize: '3rem',
                                            marginBottom: 'var(--unit-4)'
                                        },
                                        children: "folder_open"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 961,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Document management feature coming soon"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 962,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '0.9rem',
                                            marginTop: 'var(--unit-2)'
                                        },
                                        children: "This will include document upload, categorization, and management capabilities"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                                        lineNumber: 963,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cases/[caseId]/page.tsx",
                                lineNumber: 960,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cases/[caseId]/page.tsx",
                        lineNumber: 951,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cases/[caseId]/page.tsx",
                lineNumber: 878,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/cases/[caseId]/page.tsx",
        lineNumber: 149,
        columnNumber: 5
    }, this);
}
_s(CaseDetailPage, "le+nxNfvVQVUtdfmvI+5g5+QISU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = CaseDetailPage;
var _c;
__turbopack_refresh__.register(_c, "CaseDetailPage");

})()),
"[project]/app/cases/[caseId]/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=_2b0976._.js.map