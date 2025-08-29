(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_31629d._.js", {

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
"[project]/components/TaskTable.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>TaskTable
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
'use client';
;
;
// Configuration for different task types
const taskConfigs = {
    'request-assignment': {
        title: 'Ready to Request SWCM Assignment',
        columns: [
            'Incident Number',
            'Intake Date',
            'Key Allegation',
            'Actions'
        ],
        actionButton: {
            text: 'Request Assignment',
            icon: 'assignment_ind',
            className: 'primary'
        }
    },
    'edits-required': {
        title: 'Edits Required',
        columns: [
            'Case Name',
            'Last Updated',
            'Supervisor Note',
            'Actions'
        ],
        actionButton: {
            text: 'View & Edit',
            icon: 'edit',
            className: 'error'
        }
    },
    'case-setup': {
        title: 'Ready for Setup',
        columns: [
            'Case Name',
            'Assigned SWCM',
            'Setup Progress',
            'Actions'
        ],
        actionButton: {
            text: 'Start Setup',
            icon: 'settings',
            className: 'secondary'
        }
    }
};
function TaskTable({ taskType, cases, onActionClick }) {
    const config = taskConfigs[taskType];
    if (!config) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "task-table-container",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "error-message",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "icon",
                        children: "error"
                    }, void 0, false, {
                        fileName: "[project]/components/TaskTable.tsx",
                        lineNumber: 38,
                        columnNumber: 11
                    }, this),
                    "Unknown task type: ",
                    taskType
                ]
            }, void 0, true, {
                fileName: "[project]/components/TaskTable.tsx",
                lineNumber: 37,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/TaskTable.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, this);
    }
    const renderCellContent = (case_, columnIndex)=>{
        switch(taskType){
            case 'request-assignment':
                switch(columnIndex){
                    case 0:
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "case-name-cell",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/cases/${case_.case_id}`,
                                className: "case-link",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: case_.case_number
                                }, void 0, false, {
                                    fileName: "[project]/components/TaskTable.tsx",
                                    lineNumber: 53,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/TaskTable.tsx",
                                lineNumber: 52,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/TaskTable.tsx",
                            lineNumber: 51,
                            columnNumber: 15
                        }, this);
                    case 1:
                        return new Date(case_.created_date).toLocaleDateString();
                    case 2:
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "allegation-cell",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "allegation-type",
                                    children: case_.allegation_type
                                }, void 0, false, {
                                    fileName: "[project]/components/TaskTable.tsx",
                                    lineNumber: 62,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "allegation-desc",
                                    children: case_.allegation_description
                                }, void 0, false, {
                                    fileName: "[project]/components/TaskTable.tsx",
                                    lineNumber: 63,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TaskTable.tsx",
                            lineNumber: 61,
                            columnNumber: 15
                        }, this);
                    case 3:
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onActionClick(case_),
                            className: `action-btn small ${config.actionButton.className}`,
                            title: config.actionButton.text,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "icon",
                                    children: config.actionButton.icon
                                }, void 0, false, {
                                    fileName: "[project]/components/TaskTable.tsx",
                                    lineNumber: 73,
                                    columnNumber: 17
                                }, this),
                                config.actionButton.text
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TaskTable.tsx",
                            lineNumber: 68,
                            columnNumber: 15
                        }, this);
                    default:
                        return null;
                }
            case 'edits-required':
                // Placeholder for future implementation
                switch(columnIndex){
                    case 0:
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "case-name-cell",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/cases/${case_.case_id}`,
                                    className: "case-link",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: case_.case_display_name || case_.family_name
                                    }, void 0, false, {
                                        fileName: "[project]/components/TaskTable.tsx",
                                        lineNumber: 88,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/TaskTable.tsx",
                                    lineNumber: 87,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "case-number",
                                    children: case_.case_number
                                }, void 0, false, {
                                    fileName: "[project]/components/TaskTable.tsx",
                                    lineNumber: 90,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TaskTable.tsx",
                            lineNumber: 86,
                            columnNumber: 15
                        }, this);
                    case 1:
                        return new Date(case_.created_date).toLocaleDateString();
                    case 2:
                        return "Placeholder for supervisor feedback";
                    case 3:
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onActionClick(case_),
                            className: `action-btn small ${config.actionButton.className}`,
                            title: config.actionButton.text,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "icon",
                                    children: config.actionButton.icon
                                }, void 0, false, {
                                    fileName: "[project]/components/TaskTable.tsx",
                                    lineNumber: 104,
                                    columnNumber: 17
                                }, this),
                                config.actionButton.text
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TaskTable.tsx",
                            lineNumber: 99,
                            columnNumber: 15
                        }, this);
                    default:
                        return null;
                }
            case 'case-setup':
                // Placeholder for future implementation
                switch(columnIndex){
                    case 0:
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "case-name-cell",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/cases/${case_.case_id}`,
                                    className: "case-link",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: case_.case_display_name || case_.family_name
                                    }, void 0, false, {
                                        fileName: "[project]/components/TaskTable.tsx",
                                        lineNumber: 119,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/TaskTable.tsx",
                                    lineNumber: 118,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "case-number",
                                    children: case_.case_number
                                }, void 0, false, {
                                    fileName: "[project]/components/TaskTable.tsx",
                                    lineNumber: 121,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TaskTable.tsx",
                            lineNumber: 117,
                            columnNumber: 15
                        }, this);
                    case 1:
                        return case_.assigned_worker || 'Unassigned';
                    case 2:
                        return "Progress placeholder";
                    case 3:
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onActionClick(case_),
                            className: `action-btn small ${config.actionButton.className}`,
                            title: config.actionButton.text,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "icon",
                                    children: config.actionButton.icon
                                }, void 0, false, {
                                    fileName: "[project]/components/TaskTable.tsx",
                                    lineNumber: 135,
                                    columnNumber: 17
                                }, this),
                                config.actionButton.text
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/TaskTable.tsx",
                            lineNumber: 130,
                            columnNumber: 15
                        }, this);
                    default:
                        return null;
                }
            default:
                return null;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "task-table-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "task-table-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "task-table-title",
                        children: config.title
                    }, void 0, false, {
                        fileName: "[project]/components/TaskTable.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "task-table-count",
                        children: [
                            cases.length,
                            " cases"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/TaskTable.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/TaskTable.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this),
            cases.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "table-container",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "data-table task-table",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: config.columns.map((column, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        children: column
                                    }, index, false, {
                                        fileName: "[project]/components/TaskTable.tsx",
                                        lineNumber: 161,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/TaskTable.tsx",
                                lineNumber: 159,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/TaskTable.tsx",
                            lineNumber: 158,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: cases.map((case_)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: config.columns.map((_, columnIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            children: renderCellContent(case_, columnIndex)
                                        }, columnIndex, false, {
                                            fileName: "[project]/components/TaskTable.tsx",
                                            lineNumber: 169,
                                            columnNumber: 21
                                        }, this))
                                }, case_.case_id, false, {
                                    fileName: "[project]/components/TaskTable.tsx",
                                    lineNumber: 167,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/TaskTable.tsx",
                            lineNumber: 165,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/TaskTable.tsx",
                    lineNumber: 157,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/TaskTable.tsx",
                lineNumber: 156,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "empty-state",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "icon large",
                        children: "check_circle"
                    }, void 0, false, {
                        fileName: "[project]/components/TaskTable.tsx",
                        lineNumber: 180,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        children: "No Cases in Queue"
                    }, void 0, false, {
                        fileName: "[project]/components/TaskTable.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "All cases for this task have been completed."
                    }, void 0, false, {
                        fileName: "[project]/components/TaskTable.tsx",
                        lineNumber: 182,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/TaskTable.tsx",
                lineNumber: 179,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/TaskTable.tsx",
        lineNumber: 149,
        columnNumber: 5
    }, this);
}
_c = TaskTable;
var _c;
__turbopack_refresh__.register(_c, "TaskTable");

})()),
"[project]/app/cpw/page.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>CPWPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RequestSWCMAssignmentModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/RequestSWCMAssignmentModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TaskTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/TaskTable.tsx [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
;
;
function CPWPage() {
    _s();
    const [activeFilters, setActiveFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        'Draft Cases'
    ]);
    const [cases, setCases] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSetupModalOpen, setIsSetupModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedCase, setSelectedCase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeTask, setActiveTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadCases();
    }, []);
    const loadCases = async ()=>{
        setLoading(true);
        setError(null);
        // For demo: show unassigned cases since no workers are assigned yet in the workflow
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCasesByWorker"])('unassigned');
        if (response.error) {
            setError(response.error);
        } else if (response.data) {
            setCases(response.data.cases);
        }
        setLoading(false);
    };
    const getIndicatorIcon = (indicator)=>{
        switch(indicator.toLowerCase()){
            case 'allergy':
                return 'medical_services';
            case 'icwa eligible':
                return 'diversity_3';
            case 'runaway':
                return 'directions_run';
            case 'worker safety':
                return 'security';
            case 'protective order':
                return 'gavel';
            case 'icpc':
                return 'swap_horiz';
            case 'safe haven':
                return 'shield';
            case 'chronic medical condition':
                return 'local_hospital';
            default:
                return 'flag';
        }
    };
    const getIndicatorColor = (indicator)=>{
        switch(indicator.toLowerCase()){
            case 'allergy':
                return 'error';
            case 'icwa eligible':
                return 'tertiary';
            case 'runaway':
                return 'error';
            case 'worker safety':
                return 'error';
            case 'protective order':
                return 'secondary';
            case 'chronic medical condition':
                return 'secondary';
            default:
                return 'primary';
        }
    };
    const getChildrenNames = (case_)=>{
        if (!case_.persons) return null;
        const children = case_.persons.filter((person)=>person.role === 'Client');
        if (children.length === 0) return null;
        return children.map((child, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/persons/${child.person_id}`,
                        className: "child-link",
                        children: [
                            child.first_name,
                            " ",
                            child.last_name
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    index < children.length - 1 && ', '
                ]
            }, child.person_id, true, {
                fileName: "[project]/app/cpw/page.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this));
    };
    const getAllIndicators = (case_)=>{
        const indicators = new Set();
        if (case_.persons) {
            case_.persons.forEach((person)=>{
                if (person.indicators) {
                    person.indicators.forEach((indicator)=>indicators.add(indicator));
                }
            });
        }
        return Array.from(indicators);
    };
    const handleSetupCase = (case_)=>{
        setSelectedCase(case_);
        setIsSetupModalOpen(true);
    };
    const handleStartCaseSetup = (case_)=>{
        // TODO: Open comprehensive case setup modal/component
        // For now, navigate to case details page
        window.location.href = `/cases/${case_.case_id}`;
    };
    const hasSavedProgress = (caseId)=>{
        try {
            const saved = localStorage.getItem(`cpw_setup_${caseId}`);
            return saved !== null;
        } catch (error) {
            return false;
        }
    };
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
    const handleSetupSuccess = ()=>{
        setIsSetupModalOpen(false);
        setSelectedCase(null);
        loadCases() // Reload cases to reflect status changes
        ;
    };
    const handleCloseModal = ()=>{
        setIsSetupModalOpen(false);
        setSelectedCase(null);
    };
    // Handle task card clicks - toggle between showing task view and default view
    const handleTaskCardClick = (taskType)=>{
        if (activeTask === taskType) {
            // If clicking the same task, toggle it off
            setActiveTask(null);
        } else {
            // Set the new active task
            setActiveTask(taskType);
        }
    };
    // Get cases for the active task
    const getTaskCases = (taskType)=>{
        switch(taskType){
            case 'request-assignment':
                return cases.filter((c)=>c.status.toLowerCase() === 'draft');
            case 'edits-required':
                return cases.filter((c)=>c.status.toLowerCase() === 'edits required');
            case 'case-setup':
                return cases.filter((c)=>c.status.toLowerCase() === 'case setup');
            default:
                return [];
        }
    };
    // Handle task table action clicks
    const handleTaskAction = (case_)=>{
        if (activeTask === 'request-assignment') {
            handleSetupCase(case_);
        } else if (activeTask === 'edits-required') {
            // TODO: Handle edits required action
            console.log('Handle edits required for case:', case_.case_id);
        } else if (activeTask === 'case-setup') {
            handleStartCaseSetup(case_);
        }
    };
    // Define available filter tags
    const filterTags = [
        {
            id: 'pending-assignment',
            label: 'Pending Assignment',
            status: [
                'Pending Assignment'
            ],
            count: cases.filter((c)=>c.status === 'Pending Assignment').length
        },
        {
            id: 'pending-approval',
            label: 'Pending Approval',
            status: [
                'Pending Approval'
            ],
            count: cases.filter((c)=>c.status === 'Pending Approval').length
        },
        {
            id: 'ready-swcm-assignment',
            label: 'Ready for SWCM Assignment',
            status: [
                'Draft'
            ],
            count: cases.filter((c)=>c.status === 'Draft').length
        },
        {
            id: 'active',
            label: 'Active',
            status: [
                'Active'
            ],
            count: cases.filter((c)=>c.status === 'Active').length
        }
    ];
    // Toggle filter tag
    const toggleFilter = (tagId)=>{
        const tag = filterTags.find((t)=>t.id === tagId);
        if (!tag) return;
        setActiveFilters((prev)=>{
            const isActive = prev.includes(tag.label);
            if (isActive) {
                return prev.filter((f)=>f !== tag.label);
            } else {
                return [
                    ...prev,
                    tag.label
                ];
            }
        });
    };
    // Filter cases based on active filters
    const filteredCases = cases.filter((case_)=>{
        if (activeFilters.length === 0) return true;
        return filterTags.some((tag)=>activeFilters.includes(tag.label) && tag.status.includes(case_.status));
    });
    // Get action button for case based on status
    const getCaseActionButton = (case_)=>{
        switch(case_.status){
            case 'Draft':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>handleSetupCase(case_),
                    className: "action-btn small primary",
                    title: "Request SWCM Assignment",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "icon",
                            children: "assignment_ind"
                        }, void 0, false, {
                            fileName: "[project]/app/cpw/page.tsx",
                            lineNumber: 219,
                            columnNumber: 13
                        }, this),
                        "Request Assignment"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cpw/page.tsx",
                    lineNumber: 214,
                    columnNumber: 11
                }, this);
            case 'Pending Assignment':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "action-btn small secondary",
                    disabled: true,
                    title: "Waiting for SWCM assignment",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "icon",
                            children: "hourglass_empty"
                        }, void 0, false, {
                            fileName: "[project]/app/cpw/page.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, this),
                        "Pending"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cpw/page.tsx",
                    lineNumber: 225,
                    columnNumber: 11
                }, this);
            case 'Case Setup':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>handleStartCaseSetup(case_),
                    className: "action-btn small primary",
                    title: hasSavedProgress(case_.case_id) ? 'Resume case setup progress' : 'Start comprehensive case setup',
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "icon",
                            children: hasSavedProgress(case_.case_id) ? 'play_arrow' : 'settings'
                        }, void 0, false, {
                            fileName: "[project]/app/cpw/page.tsx",
                            lineNumber: 241,
                            columnNumber: 13
                        }, this),
                        hasSavedProgress(case_.case_id) ? 'Resume Setup' : 'Start Setup'
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cpw/page.tsx",
                    lineNumber: 236,
                    columnNumber: 11
                }, this);
            case 'Pending Approval':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "action-btn small secondary",
                    disabled: true,
                    title: "Case setup complete, awaiting supervisor approval",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "icon",
                            children: "pending"
                        }, void 0, false, {
                            fileName: "[project]/app/cpw/page.tsx",
                            lineNumber: 252,
                            columnNumber: 13
                        }, this),
                        "Awaiting Approval"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cpw/page.tsx",
                    lineNumber: 247,
                    columnNumber: 11
                }, this);
            case 'Active':
            case 'Closed':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/cases/${case_.case_id}`,
                    className: "action-btn small primary",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "icon",
                            children: "visibility"
                        }, void 0, false, {
                            fileName: "[project]/app/cpw/page.tsx",
                            lineNumber: 260,
                            columnNumber: 13
                        }, this),
                        "View"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cpw/page.tsx",
                    lineNumber: 259,
                    columnNumber: 11
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "action-btn small secondary",
                    disabled: true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "icon",
                            children: "help"
                        }, void 0, false, {
                            fileName: "[project]/app/cpw/page.tsx",
                            lineNumber: 267,
                            columnNumber: 13
                        }, this),
                        "Unknown Status"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cpw/page.tsx",
                    lineNumber: 266,
                    columnNumber: 11
                }, this);
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
                        children: "CPW Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "page-description",
                        children: "Loading cases..."
                    }, void 0, false, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 279,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cpw/page.tsx",
                lineNumber: 277,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/cpw/page.tsx",
            lineNumber: 276,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-header modern-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "greeting-title",
                        children: "Hi Dana! What can I help you with today?"
                    }, void 0, false, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 288,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "search-container",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "search-bar",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "search-icon icon",
                                    children: "search"
                                }, void 0, false, {
                                    fileName: "[project]/app/cpw/page.tsx",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "search-input",
                                    placeholder: "Ask me anything about your cases, or search for specific information..."
                                }, void 0, false, {
                                    fileName: "[project]/app/cpw/page.tsx",
                                    lineNumber: 292,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "search-submit",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        children: "send"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cpw/page.tsx",
                                        lineNumber: 298,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/cpw/page.tsx",
                                    lineNumber: 297,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cpw/page.tsx",
                            lineNumber: 290,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cpw/page.tsx",
                lineNumber: 287,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "content-wrapper",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "my-tasks-section",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "section-title",
                                children: "My Tasks"
                            }, void 0, false, {
                                fileName: "[project]/app/cpw/page.tsx",
                                lineNumber: 307,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "task-cards-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `task-card primary ${activeTask === 'request-assignment' ? 'active' : ''}`,
                                        onClick: ()=>handleTaskCardClick('request-assignment'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "task-card-icon",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "icon",
                                                    children: "assignment_ind"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 314,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 313,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "task-card-content",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: "Ready to Request SWCM Assignment"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 317,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "task-count",
                                                        children: [
                                                            cases.filter((c)=>c.status.toLowerCase() === 'draft').length,
                                                            " cases"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 318,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "task-description",
                                                        children: "New cases ready for assignment request"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 319,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 316,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "task-card-action",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "icon",
                                                    children: "arrow_forward"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 322,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 321,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cpw/page.tsx",
                                        lineNumber: 309,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `task-card error ${activeTask === 'edits-required' ? 'active' : ''}`,
                                        onClick: ()=>handleTaskCardClick('edits-required'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "task-card-icon",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "icon",
                                                    children: "edit"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 331,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 330,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "task-card-content",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: "Edits Required"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "task-count",
                                                        children: [
                                                            cases.filter((c)=>c.status.toLowerCase() === 'edits required').length,
                                                            " cases"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 335,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "task-description",
                                                        children: "Cases returned by supervisor for changes"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 336,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 333,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "task-card-action",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "icon",
                                                    children: "arrow_forward"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 339,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 338,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cpw/page.tsx",
                                        lineNumber: 326,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `task-card secondary ${activeTask === 'case-setup' ? 'active' : ''}`,
                                        onClick: ()=>handleTaskCardClick('case-setup'),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "task-card-icon",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "icon",
                                                    children: "settings"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 348,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 347,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "task-card-content",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: "Ready for Setup"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 351,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "task-count",
                                                        children: [
                                                            cases.filter((c)=>c.status.toLowerCase() === 'case setup').length,
                                                            " cases"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "task-description",
                                                        children: "Cases assigned and ready for setup"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 353,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 350,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "task-card-action",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "icon",
                                                    children: "arrow_forward"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 355,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cpw/page.tsx",
                                        lineNumber: 343,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cpw/page.tsx",
                                lineNumber: 308,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 306,
                        columnNumber: 9
                    }, this),
                    activeTask ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TaskTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        taskType: activeTask,
                        cases: getTaskCases(activeTask),
                        onActionClick: handleTaskAction
                    }, void 0, false, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 364,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filter-container",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "section-subtitle",
                                        children: "My Cases"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cpw/page.tsx",
                                        lineNumber: 372,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "filter-actions",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "action-btn secondary",
                                                onClick: ()=>setActiveFilters([]),
                                                disabled: activeFilters.length === 0,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "icon",
                                                        children: "clear_all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 379,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Clear Filters"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 374,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "action-btn primary",
                                                onClick: loadCases,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "icon",
                                                        children: "refresh"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 383,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Refresh"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 382,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cpw/page.tsx",
                                        lineNumber: 373,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cpw/page.tsx",
                                lineNumber: 371,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-tags",
                                children: filterTags.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>toggleFilter(tag.id),
                                        className: `filter-tag ${activeFilters.includes(tag.label) ? 'active' : ''}`,
                                        disabled: tag.count === 0,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "tag-label",
                                                children: tag.label
                                            }, void 0, false, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 396,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "tag-count",
                                                children: [
                                                    "(",
                                                    tag.count,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 397,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, tag.id, true, {
                                        fileName: "[project]/app/cpw/page.tsx",
                                        lineNumber: 390,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/cpw/page.tsx",
                                lineNumber: 388,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 370,
                        columnNumber: 11
                    }, this),
                    !activeTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "content-area",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "card-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: [
                                                activeFilters.length === 0 ? 'My Cases' : activeFilters.length === 1 ? activeFilters[0] : `${activeFilters.length} Filters Active`,
                                                activeFilters.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "filter-summary",
                                                    children: [
                                                        " (",
                                                        activeFilters.join(', '),
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 417,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cpw/page.tsx",
                                            lineNumber: 409,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "card-actions",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "case-count",
                                                children: [
                                                    filteredCases.length,
                                                    " cases"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 421,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/cpw/page.tsx",
                                            lineNumber: 420,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cpw/page.tsx",
                                    lineNumber: 408,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "card-content",
                                    children: [
                                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "error-message",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "icon",
                                                    children: "error"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 427,
                                                    columnNumber: 19
                                                }, this),
                                                error
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cpw/page.tsx",
                                            lineNumber: 426,
                                            columnNumber: 17
                                        }, this),
                                        filteredCases.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "table-container",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                className: "data-table",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Case Name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 436,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 437,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Intake Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 438,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Key Allegations"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 439,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Children Involved"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 440,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Indicators"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 441,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Progress"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 442,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Assigned Workers"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 443,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Actions"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 444,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/cpw/page.tsx",
                                                            lineNumber: 435,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 434,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        children: filteredCases.map((case_)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "case-name-cell",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                    href: `/cases/${case_.case_id}`,
                                                                                    className: "case-link",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: case_.case_display_name || case_.family_name
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                                        lineNumber: 453,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 452,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "case-number",
                                                                                    children: case_.case_number
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 455,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 451,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 450,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `status-badge ${case_.status.toLowerCase().replace(/\s+/g, '-')}`,
                                                                            children: case_.status
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 459,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 458,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: new Date(case_.created_date).toLocaleDateString()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 463,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "allegation-cell",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "allegation-type",
                                                                                    children: case_.allegation_type
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 466,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "allegation-desc",
                                                                                    children: case_.allegation_description
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 467,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 465,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 464,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "children-list",
                                                                            children: getChildrenNames(case_) || 'No children listed'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 471,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 470,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "indicators-cell",
                                                                            children: [
                                                                                getAllIndicators(case_).slice(0, 3).map((indicator, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: `indicator-badge ${getIndicatorColor(indicator)}`,
                                                                                        title: indicator,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "icon",
                                                                                                children: getIndicatorIcon(indicator)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/cpw/page.tsx",
                                                                                                lineNumber: 483,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            indicator
                                                                                        ]
                                                                                    }, index, true, {
                                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                                        lineNumber: 478,
                                                                                        columnNumber: 33
                                                                                    }, this)),
                                                                                getAllIndicators(case_).length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "indicator-more",
                                                                                    children: [
                                                                                        "+",
                                                                                        getAllIndicators(case_).length - 3,
                                                                                        " more"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 488,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 476,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 475,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "progress-cell",
                                                                            children: [
                                                                                case_.status === 'Case Setup' && (()=>{
                                                                                    const progress = getSetupProgress(case_.case_id);
                                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "setup-progress-indicator",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "progress-bar-small",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "progress-fill-small",
                                                                                                    style: {
                                                                                                        width: `${progress.percentage}%`
                                                                                                    }
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                                    lineNumber: 501,
                                                                                                    columnNumber: 39
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/cpw/page.tsx",
                                                                                                lineNumber: 500,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "progress-text-small",
                                                                                                children: progress.step > 0 ? `Step ${progress.step}/${progress.total}` : 'Not Started'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/cpw/page.tsx",
                                                                                                lineNumber: 506,
                                                                                                columnNumber: 37
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                                        lineNumber: 499,
                                                                                        columnNumber: 35
                                                                                    }, this);
                                                                                })(),
                                                                                case_.status !== 'Case Setup' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "progress-na",
                                                                                    children: "—"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 513,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 495,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 494,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "workers-cell",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "primary-worker",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                            children: "Primary:"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                                            lineNumber: 520,
                                                                                            columnNumber: 33
                                                                                        }, this),
                                                                                        " ",
                                                                                        case_.assigned_worker || 'Unassigned'
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 519,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                case_.assigned_supervisor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "supervisor",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                            children: "Supervisor:"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                                            lineNumber: 524,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        " ",
                                                                                        case_.assigned_supervisor
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 523,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 518,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 517,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "action-buttons",
                                                                            children: getCaseActionButton(case_)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 530,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 529,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, case_.case_id, true, {
                                                                fileName: "[project]/app/cpw/page.tsx",
                                                                lineNumber: 449,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 447,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 433,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/cpw/page.tsx",
                                            lineNumber: 432,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "empty-state",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "icon large",
                                                    children: "filter_list"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 541,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    children: "No Cases Match Current Filters"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 542,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: activeFilters.length === 0 ? 'No cases found in the system' : `Try adjusting your filters or clearing them to see more cases`
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 543,
                                                    columnNumber: 19
                                                }, this),
                                                activeFilters.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "action-btn primary",
                                                    onClick: ()=>setActiveFilters([]),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "icon",
                                                            children: "clear_all"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/cpw/page.tsx",
                                                            lineNumber: 554,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Clear All Filters"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 550,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cpw/page.tsx",
                                            lineNumber: 540,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cpw/page.tsx",
                                    lineNumber: 424,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cpw/page.tsx",
                            lineNumber: 407,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 406,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cpw/page.tsx",
                lineNumber: 304,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RequestSWCMAssignmentModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isSetupModalOpen,
                onClose: handleCloseModal,
                case_: selectedCase,
                onSuccess: handleSetupSuccess
            }, void 0, false, {
                fileName: "[project]/app/cpw/page.tsx",
                lineNumber: 567,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/cpw/page.tsx",
        lineNumber: 286,
        columnNumber: 5
    }, this);
}
_s(CPWPage, "UzH2tDa0hyPNmemo2ds/8Ul+2IM=");
_c = CPWPage;
var _c;
__turbopack_refresh__.register(_c, "CPWPage");

})()),
"[project]/app/cpw/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=_31629d._.js.map