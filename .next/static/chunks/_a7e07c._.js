(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_a7e07c._.js", {

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
"[project]/components/CPWCaseSetupModal.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>CPWCaseSetupModal
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/api.ts [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
function CPWCaseSetupModal({ isOpen, onClose, case_, onSuccess }) {
    _s();
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Step 1: Case membership
    const [casePersons, setCasePersons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showAddPersonForm, setShowAddPersonForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPersonSearch, setShowPersonSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [searchResults, setSearchResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchLoading, setSearchLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedRole, setSelectedRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Parent');
    const [selectedPerson, setSelectedPerson] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newPersonData, setNewPersonData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        role: 'Parent'
    });
    // Step 2: Allegations
    const [allegations, setAllegations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        type: '',
        description: ''
    });
    // Step 3: Assessments
    const [assessments, setAssessments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        risk_level: 'Medium',
        safety_factors: [],
        assessment_notes: '',
        risk_confirmed: false,
        safety_confirmed: false
    });
    // Common safety factors for quick selection
    const commonSafetyFactors = [
        'Physical injury to child',
        'Sexual abuse allegation',
        'Domestic violence',
        'Substance abuse concerns',
        'Inadequate supervision',
        'Unsafe living conditions',
        'Mental health concerns',
        'Medical neglect',
        'Educational neglect',
        'Child disclosure',
        'Perpetrator has access',
        'Young child age',
        'Chronic health conditions'
    ];
    const [newSafetyFactor, setNewSafetyFactor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Step 4: Final confirmation
    const [finalConfirmation, setFinalConfirmation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        cpw_notes: '',
        ready_for_assignment: false
    });
    const steps = [
        {
            id: 1,
            title: 'Review Case Details',
            description: 'Name case, add safety concerns, and review case information',
            completed: allegations.type !== '' && allegations.description !== ''
        },
        {
            id: 2,
            title: 'Verify Case Membership',
            description: 'Review and add people involved in the case',
            completed: casePersons.length > 0
        },
        {
            id: 3,
            title: 'Update Living Arrangements',
            description: 'Set living arrangements for all children/clients',
            completed: assessments.risk_confirmed && assessments.safety_confirmed
        },
        {
            id: 4,
            title: 'Request SWCM Assignment',
            description: 'Finalize case setup and request SWCM',
            completed: finalConfirmation.ready_for_assignment
        }
    ];
    // Save/Resume functionality
    const getStorageKey = (caseId)=>`cpw_assignment_${caseId}`;
    const saveProgress = ()=>{
        if (!case_) return;
        const savedData = {
            caseId: case_.case_id,
            currentStep,
            casePersons,
            allegations,
            assessments,
            finalConfirmation,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem(getStorageKey(case_.case_id), JSON.stringify(savedData));
    };
    const loadSavedProgress = (caseId)=>{
        try {
            const saved = localStorage.getItem(getStorageKey(caseId));
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading saved progress:', error);
            return null;
        }
    };
    const clearSavedProgress = (caseId)=>{
        localStorage.removeItem(getStorageKey(caseId));
    };
    const handleSaveAndExit = ()=>{
        saveProgress();
        onClose();
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen && case_) {
            // Check for saved progress first
            const savedProgress = loadSavedProgress(case_.case_id);
            if (savedProgress) {
                // Restore saved progress
                setCurrentStep(savedProgress.currentStep);
                setCasePersons(savedProgress.casePersons);
                setAllegations(savedProgress.allegations);
                setAssessments(savedProgress.assessments);
                setFinalConfirmation(savedProgress.finalConfirmation);
            } else {
                // Initialize data from case
                setCasePersons(case_.persons || []);
                setAllegations({
                    type: case_.allegation_type || '',
                    description: case_.allegation_description || ''
                });
                setAssessments({
                    risk_level: case_.risk_level || 'Medium',
                    safety_factors: case_.safety_factors || [],
                    assessment_notes: case_.assessment_notes || '',
                    risk_confirmed: false,
                    safety_confirmed: false
                });
                setFinalConfirmation({
                    cpw_notes: '',
                    ready_for_assignment: false
                });
                setCurrentStep(1);
            }
            setError(null);
        }
    }, [
        isOpen,
        case_
    ]);
    // Auto-save progress when data changes (but only save to localStorage, not to API)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen && case_) {
            const timeoutId = setTimeout(()=>{
                saveProgress() // This only saves to localStorage, not to the API
                ;
            }, 1000) // Auto-save after 1 second of inactivity
            ;
            return ()=>clearTimeout(timeoutId);
        }
    }, [
        isOpen,
        case_,
        currentStep,
        casePersons,
        allegations,
        assessments,
        finalConfirmation
    ]);
    const handleAddPerson = ()=>{
        if (!newPersonData.first_name || !newPersonData.last_name) {
            setError('First name and last name are required');
            return;
        }
        const newPerson = {
            person_id: `temp_${Date.now()}`,
            first_name: newPersonData.first_name,
            last_name: newPersonData.last_name,
            date_of_birth: newPersonData.date_of_birth,
            role: newPersonData.role.toLowerCase(),
            contact_info: {
                phone: undefined,
                email: undefined,
                address: undefined
            },
            indicators: [],
            relationship_to_primary_child: newPersonData.role
        };
        setCasePersons([
            ...casePersons,
            newPerson
        ]);
        setNewPersonData({
            first_name: '',
            last_name: '',
            date_of_birth: '',
            role: 'Parent'
        });
        setShowAddPersonForm(false);
        setError(null);
    };
    const handleRemovePerson = (personId)=>{
        setCasePersons(casePersons.filter((p)=>p.person_id !== personId));
    };
    // Person search functionality
    const handleSearchPersons = async (query)=>{
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchPersons"])(query);
            if (response.error) {
                setError(response.error);
                setSearchResults([]);
            } else if (response.data) {
                setSearchResults(response.data.persons);
            }
        } catch (err) {
            setError('Failed to search persons');
            setSearchResults([]);
        } finally{
            setSearchLoading(false);
        }
    };
    const handleAddExistingPerson = (person)=>{
        // Check if person is already in the case
        if (casePersons.some((p)=>p.person_id === person.person_id)) {
            setError('This person is already added to the case');
            return;
        }
        // Add person with selected role
        const personWithRole = {
            ...person,
            role: selectedRole.toLowerCase(),
            relationship_to_primary_child: selectedRole
        };
        setCasePersons([
            ...casePersons,
            personWithRole
        ]);
        setShowPersonSearch(false);
        setSearchQuery('');
        setSearchResults([]);
        setError(null);
    };
    // Debounced search
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (searchQuery) {
            const timeoutId = setTimeout(()=>{
                handleSearchPersons(searchQuery);
            }, 300);
            return ()=>clearTimeout(timeoutId);
        } else {
            setSearchResults([]);
        }
    }, [
        searchQuery
    ]);
    const handleNextStep = ()=>{
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };
    const handlePreviousStep = ()=>{
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    const handleFinishSetup = async ()=>{
        if (!case_) return;
        setLoading(true);
        setError(null);
        try {
            // Update case with final data and change status to "Pending Assignment"
            const updates = {
                allegation_type: allegations.type,
                allegation_description: allegations.description,
                risk_level: assessments.risk_level,
                safety_factors: assessments.safety_factors,
                assessment_notes: assessments.assessment_notes,
                status: 'Pending Assignment'
            };
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateCase"])(case_.case_id, updates);
            if (response.error) {
                setError(response.error);
            } else {
                // Clear saved progress since setup is complete
                clearSavedProgress(case_.case_id);
                onSuccess();
                onClose();
            }
        } catch (err) {
            setError('Failed to request SWCM assignment');
        } finally{
            setLoading(false);
        }
    };
    if (!isOpen || !case_) return null;
    const handleOverlayClick = (e)=>{
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay",
        onClick: handleOverlayClick,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal-container large scrollable",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: [
                                "Request SWCM Assignment - ",
                                case_.case_display_name || `Case ${case_.case_id}`
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                            lineNumber: 366,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "modal-close",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "icon",
                                children: "close"
                            }, void 0, false, {
                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                lineNumber: 368,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                            lineNumber: 367,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                    lineNumber: 365,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-body",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "progress-bar-container",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "progress-bar",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "progress-fill",
                                        style: {
                                            width: `${currentStep / steps.length * 100}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                        lineNumber: 376,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                    lineNumber: 375,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "progress-text",
                                    children: [
                                        "Step ",
                                        currentStep,
                                        " of ",
                                        steps.length,
                                        ": ",
                                        steps[currentStep - 1]?.title
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                    lineNumber: 381,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                            lineNumber: 374,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "setup-progress",
                            children: steps.map((step)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `progress-step ${currentStep === step.id ? 'active' : ''} ${step.completed ? 'completed' : ''} clickable`,
                                    onClick: ()=>setCurrentStep(step.id),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "step-number",
                                            children: step.completed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "icon",
                                                children: "check"
                                            }, void 0, false, {
                                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                lineNumber: 395,
                                                columnNumber: 37
                                            }, this) : step.id
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 394,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "step-info",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    children: step.title
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: step.description
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 399,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 397,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, step.id, true, {
                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                    lineNumber: 389,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                            lineNumber: 387,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-content",
                            children: [
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "error-message",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            children: "error"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 408,
                                            columnNumber: 15
                                        }, this),
                                        error
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                    lineNumber: 407,
                                    columnNumber: 13
                                }, this),
                                currentStep === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "setup-step",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Step 1: Review Case Details"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 416,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Name this case, add family safety concerns, and review case information before requesting SWCM assignment."
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 417,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    children: "Name this case *"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 420,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: allegations.description,
                                                    onChange: (e)=>setAllegations({
                                                            ...allegations,
                                                            description: e.target.value
                                                        }),
                                                    placeholder: "Enter a descriptive name for this case..."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 421,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 419,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    children: "Add family safety concerns"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 430,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: assessments.assessment_notes,
                                                    onChange: (e)=>setAssessments({
                                                            ...assessments,
                                                            assessment_notes: e.target.value
                                                        }),
                                                    placeholder: "Describe any family safety concerns...",
                                                    rows: 3
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 429,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-grid",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Safety Plan"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 441,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "radio-group",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "safety_plan",
                                                                            value: "yes",
                                                                            checked: assessments.safety_factors.includes('Safety Plan Required'),
                                                                            onChange: (e)=>{
                                                                                if (e.target.checked) {
                                                                                    setAssessments({
                                                                                        ...assessments,
                                                                                        safety_factors: [
                                                                                            ...assessments.safety_factors.filter((f)=>!f.includes('Safety Plan')),
                                                                                            'Safety Plan Required'
                                                                                        ]
                                                                                    });
                                                                                }
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 444,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        "Yes"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 443,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "safety_plan",
                                                                            value: "no",
                                                                            checked: !assessments.safety_factors.includes('Safety Plan Required'),
                                                                            onChange: (e)=>{
                                                                                if (e.target.checked) {
                                                                                    setAssessments({
                                                                                        ...assessments,
                                                                                        safety_factors: assessments.safety_factors.filter((f)=>!f.includes('Safety Plan'))
                                                                                    });
                                                                                }
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 461,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        "No"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 460,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 442,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Family Preservation"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 481,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "radio-group",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "family_preservation",
                                                                            value: "yes",
                                                                            checked: assessments.safety_factors.includes('Family Preservation Services'),
                                                                            onChange: (e)=>{
                                                                                if (e.target.checked) {
                                                                                    setAssessments({
                                                                                        ...assessments,
                                                                                        safety_factors: [
                                                                                            ...assessments.safety_factors.filter((f)=>!f.includes('Family Preservation')),
                                                                                            'Family Preservation Services'
                                                                                        ]
                                                                                    });
                                                                                }
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 484,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        "Yes"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 483,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "family_preservation",
                                                                            value: "no",
                                                                            checked: !assessments.safety_factors.includes('Family Preservation Services'),
                                                                            onChange: (e)=>{
                                                                                if (e.target.checked) {
                                                                                    setAssessments({
                                                                                        ...assessments,
                                                                                        safety_factors: assessments.safety_factors.filter((f)=>!f.includes('Family Preservation'))
                                                                                    });
                                                                                }
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 501,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        "No"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 500,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 482,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 480,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Prior Service Case"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 521,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "radio-group",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "prior_service",
                                                                            value: "yes",
                                                                            checked: assessments.safety_factors.includes('Prior Service Case'),
                                                                            onChange: (e)=>{
                                                                                if (e.target.checked) {
                                                                                    setAssessments({
                                                                                        ...assessments,
                                                                                        safety_factors: [
                                                                                            ...assessments.safety_factors.filter((f)=>!f.includes('Prior Service')),
                                                                                            'Prior Service Case'
                                                                                        ]
                                                                                    });
                                                                                }
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 524,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        "Yes"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 523,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "prior_service",
                                                                            value: "no",
                                                                            checked: !assessments.safety_factors.includes('Prior Service Case'),
                                                                            onChange: (e)=>{
                                                                                if (e.target.checked) {
                                                                                    setAssessments({
                                                                                        ...assessments,
                                                                                        safety_factors: assessments.safety_factors.filter((f)=>!f.includes('Prior Service'))
                                                                                    });
                                                                                }
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 541,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        "No"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 540,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 522,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 520,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 439,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-grid",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Service Area Assigned"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 563,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: allegations.type,
                                                            onChange: (e)=>setAllegations({
                                                                    ...allegations,
                                                                    type: e.target.value
                                                                }),
                                                            placeholder: "Will be pre-filled from Magic Button",
                                                            disabled: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 564,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 562,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Residence County"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 574,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: case_?.county || '',
                                                            placeholder: "Will be pre-filled from Magic Button",
                                                            disabled: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 575,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 573,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Financial County"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 584,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: case_?.county || '',
                                                            placeholder: "Will be pre-filled from Magic Button",
                                                            disabled: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 585,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 583,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 561,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                    lineNumber: 415,
                                    columnNumber: 13
                                }, this),
                                currentStep === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "setup-step",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Step 2: Verify Case Membership"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 599,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Review the people involved in this case and add any missing individuals before assignment."
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 600,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "persons-list",
                                            children: casePersons.map((person)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "person-item",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "person-info",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: [
                                                                        person.first_name,
                                                                        " ",
                                                                        person.last_name
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 606,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "person-role",
                                                                    children: person.role
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 607,
                                                                    columnNumber: 23
                                                                }, this),
                                                                person.date_of_birth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "person-age",
                                                                    children: [
                                                                        "Age: ",
                                                                        Math.floor((new Date().getTime() - new Date(person.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 609,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 605,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleRemovePerson(person.person_id),
                                                            className: "action-btn small error",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "icon",
                                                                    children: "remove"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 618,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Remove"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 614,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, person.person_id, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 604,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 602,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "person-search-section",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Search for a person or add new"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 627,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: searchQuery,
                                                            onChange: (e)=>setSearchQuery(e.target.value),
                                                            placeholder: "Start typing a person's name..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 628,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 626,
                                                    columnNumber: 17
                                                }, this),
                                                searchLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "search-loading",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "icon",
                                                            children: "hourglass_empty"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 638,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Searching..."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 637,
                                                    columnNumber: 19
                                                }, this),
                                                searchResults.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "search-results",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                            children: [
                                                                "Found ",
                                                                searchResults.length,
                                                                " person(s)"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 645,
                                                            columnNumber: 21
                                                        }, this),
                                                        searchResults.map((person)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "search-result-item",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "person-info",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: [
                                                                                    person.first_name,
                                                                                    " ",
                                                                                    person.last_name
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                                lineNumber: 649,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            person.date_of_birth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "person-age",
                                                                                children: [
                                                                                    "Age: ",
                                                                                    Math.floor((new Date().getTime() - new Date(person.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                                lineNumber: 651,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            person.contact_info?.address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "person-address",
                                                                                children: person.contact_info.address
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                                lineNumber: 656,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                        lineNumber: 648,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>{
                                                                            if (!casePersons.some((p)=>p.person_id === person.person_id)) {
                                                                                setShowPersonSearch(true);
                                                                                setSelectedRole('Parent');
                                                                                // Store the selected person for role assignment
                                                                                setSelectedPerson(person);
                                                                            }
                                                                        },
                                                                        className: "action-btn small primary",
                                                                        disabled: casePersons.some((p)=>p.person_id === person.person_id),
                                                                        children: casePersons.some((p)=>p.person_id === person.person_id) ? 'Already Added' : 'Select'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                        lineNumber: 659,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, person.person_id, true, {
                                                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                lineNumber: 647,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 644,
                                                    columnNumber: 19
                                                }, this),
                                                searchQuery.length >= 2 && !searchLoading && searchResults.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "no-results",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "no-results-content",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "icon",
                                                                children: "search_off"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                lineNumber: 681,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    'No persons found matching "',
                                                                    searchQuery,
                                                                    '"'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                lineNumber: 682,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setShowAddPersonForm(true),
                                                                className: "action-btn primary",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "icon",
                                                                        children: "person_add"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                        lineNumber: 687,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    'Add "',
                                                                    searchQuery,
                                                                    '" as New Person'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                lineNumber: 683,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                        lineNumber: 680,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 679,
                                                    columnNumber: 19
                                                }, this),
                                                searchQuery.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "search-help",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: "Start typing to search for existing people, or"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 696,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowAddPersonForm(true),
                                                            className: "action-btn secondary",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "icon",
                                                                    children: "person_add"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 701,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Add New Person"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 697,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 695,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 625,
                                            columnNumber: 15
                                        }, this),
                                        showPersonSearch && selectedPerson && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "role-selection-form",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    children: [
                                                        "Select Role for ",
                                                        selectedPerson.first_name,
                                                        " ",
                                                        selectedPerson.last_name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 710,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Role in Case"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 712,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: selectedRole,
                                                            onChange: (e)=>setSelectedRole(e.target.value),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Parent",
                                                                    children: "Parent"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 717,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Non-Resident Parent",
                                                                    children: "Non-Resident Parent"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 718,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Client",
                                                                    children: "Client"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 719,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Guardian",
                                                                    children: "Guardian"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 720,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Relative",
                                                                    children: "Relative"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 721,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Family Support",
                                                                    children: "Family Support"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 722,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 713,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 711,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-actions",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                handleAddExistingPerson(selectedPerson);
                                                                setShowPersonSearch(false);
                                                                setSelectedPerson(null);
                                                            },
                                                            className: "action-btn primary",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "icon",
                                                                    children: "add"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 734,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Add to Case"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 726,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                setShowPersonSearch(false);
                                                                setSelectedPerson(null);
                                                            },
                                                            className: "action-btn secondary",
                                                            children: "Cancel"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 737,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 725,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 709,
                                            columnNumber: 17
                                        }, this),
                                        showAddPersonForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "add-person-form",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    children: "Add New Person"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 752,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-grid",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "form-group",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: "First Name *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 755,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: newPersonData.first_name,
                                                                    onChange: (e)=>setNewPersonData({
                                                                            ...newPersonData,
                                                                            first_name: e.target.value
                                                                        }),
                                                                    placeholder: "Enter first name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 756,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 754,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "form-group",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: "Last Name *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 764,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: newPersonData.last_name,
                                                                    onChange: (e)=>setNewPersonData({
                                                                            ...newPersonData,
                                                                            last_name: e.target.value
                                                                        }),
                                                                    placeholder: "Enter last name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 765,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 763,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "form-group",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: "Date of Birth"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 773,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "date",
                                                                    value: newPersonData.date_of_birth,
                                                                    onChange: (e)=>setNewPersonData({
                                                                            ...newPersonData,
                                                                            date_of_birth: e.target.value
                                                                        })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 774,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 772,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "form-group",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: "Relationship to Case *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 781,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: newPersonData.role,
                                                                    onChange: (e)=>setNewPersonData({
                                                                            ...newPersonData,
                                                                            role: e.target.value
                                                                        }),
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Parent",
                                                                            children: "Parent"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 786,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Non-Resident Parent",
                                                                            children: "Non-Resident Parent"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 787,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Client",
                                                                            children: "Client"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 788,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Guardian",
                                                                            children: "Guardian"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 789,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Relative",
                                                                            children: "Relative"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 790,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "Family Support",
                                                                            children: "Family Support"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 791,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 782,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 780,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 753,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-actions",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleAddPerson,
                                                            className: "action-btn primary",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "icon",
                                                                    children: "add"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 797,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Add Person"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 796,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowAddPersonForm(false),
                                                            className: "action-btn secondary",
                                                            children: "Cancel"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 800,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 795,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 751,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                    lineNumber: 598,
                                    columnNumber: 13
                                }, this),
                                currentStep === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "setup-step",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Step 3: Update Living Arrangements"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 815,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Set living arrangements for all children/clients before requesting SWCM assignment."
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 816,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "living-arrangements-section",
                                            children: casePersons.filter((person)=>person.role.toLowerCase() === 'client' || person.role.toLowerCase() === 'child').length > 0 ? casePersons.filter((person)=>person.role.toLowerCase() === 'client' || person.role.toLowerCase() === 'child').map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "child-living-arrangement",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            children: [
                                                                child.first_name,
                                                                " ",
                                                                child.last_name
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 824,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "form-grid",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "form-group",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            children: "Living Arrangement Type *"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 827,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            value: "",
                                                                            onChange: (e)=>{
                                                                                // TODO: Store living arrangement data
                                                                                console.log(`Living arrangement for ${child.first_name}: ${e.target.value}`);
                                                                            },
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "",
                                                                                    children: "Select arrangement type"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                                    lineNumber: 835,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "With Parent/Guardian",
                                                                                    children: "With Parent/Guardian"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                                    lineNumber: 836,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "Foster Care",
                                                                                    children: "Foster Care"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                                    lineNumber: 837,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "Kinship Care",
                                                                                    children: "Kinship Care"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                                    lineNumber: 838,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "Group Home",
                                                                                    children: "Group Home"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                                    lineNumber: 839,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "Residential Treatment",
                                                                                    children: "Residential Treatment"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                                    lineNumber: 840,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "Independent Living",
                                                                                    children: "Independent Living"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                                    lineNumber: 841,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "Other",
                                                                                    children: "Other"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                                    lineNumber: 842,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 828,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 826,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "form-group",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            children: "Name and Location *"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 847,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            placeholder: "Enter caregiver name and location",
                                                                            onChange: (e)=>{
                                                                                // TODO: Store location data
                                                                                console.log(`Location for ${child.first_name}: ${e.target.value}`);
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 848,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 846,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "form-group",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            children: "Start Date *"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 859,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "date",
                                                                            onChange: (e)=>{
                                                                                // TODO: Store start date
                                                                                console.log(`Start date for ${child.first_name}: ${e.target.value}`);
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 860,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 858,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "form-group",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            children: "End Date"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 870,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "date",
                                                                            onChange: (e)=>{
                                                                                // TODO: Store end date
                                                                                console.log(`End date for ${child.first_name}: ${e.target.value}`);
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                            lineNumber: 871,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                                    lineNumber: 869,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 825,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, child.person_id, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 823,
                                                    columnNumber: 23
                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "no-children-notice",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "icon",
                                                        children: "info"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                        lineNumber: 884,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "No children/clients found in this case. Please add children in Step 2 before requesting assignment."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                        lineNumber: 885,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                lineNumber: 883,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 818,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-group",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: assessments.risk_confirmed,
                                                        onChange: (e)=>setAssessments({
                                                                ...assessments,
                                                                risk_confirmed: e.target.checked
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                        lineNumber: 892,
                                                        columnNumber: 19
                                                    }, this),
                                                    "I confirm all living arrangements have been reviewed and updated"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                lineNumber: 891,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 890,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                    lineNumber: 814,
                                    columnNumber: 13
                                }, this),
                                currentStep === 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "setup-step",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Step 4: Request SWCM Assignment"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 907,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Review all information and request assignment to a Social Work Case Manager."
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 908,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "setup-summary",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    children: "Assignment Request Summary"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 911,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "summary-item",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "People Involved:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 913,
                                                            columnNumber: 19
                                                        }, this),
                                                        " ",
                                                        casePersons.length,
                                                        " person(s)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 912,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "summary-item",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Allegation:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 916,
                                                            columnNumber: 19
                                                        }, this),
                                                        " ",
                                                        allegations.type
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 915,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "summary-item",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Risk Level:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 919,
                                                            columnNumber: 19
                                                        }, this),
                                                        " ",
                                                        assessments.risk_level
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 918,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "summary-item",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Ready for Assignment:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                            lineNumber: 922,
                                                            columnNumber: 19
                                                        }, this),
                                                        " ",
                                                        assessments.risk_confirmed ? 'Yes' : 'No'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 921,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 910,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    children: "CPW Notes (Optional)"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 927,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: finalConfirmation.cpw_notes,
                                                    onChange: (e)=>setFinalConfirmation({
                                                            ...finalConfirmation,
                                                            cpw_notes: e.target.value
                                                        }),
                                                    placeholder: "Add any additional notes for the SWCM...",
                                                    rows: 3
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                    lineNumber: 928,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 926,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-group",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: finalConfirmation.ready_for_assignment,
                                                        onChange: (e)=>setFinalConfirmation({
                                                                ...finalConfirmation,
                                                                ready_for_assignment: e.target.checked
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                        lineNumber: 938,
                                                        columnNumber: 19
                                                    }, this),
                                                    "I confirm this case is ready for SWCM assignment and all required information has been reviewed"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                                lineNumber: 937,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                            lineNumber: 936,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                    lineNumber: 906,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CPWCaseSetupModal.tsx",
                            lineNumber: 405,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                    lineNumber: 372,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-footer",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "modal-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "action-btn secondary",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                lineNumber: 953,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSaveAndExit,
                                className: "action-btn tertiary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        children: "save"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                        lineNumber: 958,
                                        columnNumber: 15
                                    }, this),
                                    "Save & Exit"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                lineNumber: 957,
                                columnNumber: 13
                            }, this),
                            currentStep > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handlePreviousStep,
                                className: "action-btn secondary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        children: "arrow_back"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                        lineNumber: 964,
                                        columnNumber: 17
                                    }, this),
                                    "Previous"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                lineNumber: 963,
                                columnNumber: 15
                            }, this),
                            currentStep < 4 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleNextStep,
                                className: "action-btn primary",
                                children: [
                                    "Next",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        children: "arrow_forward"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                        lineNumber: 975,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                lineNumber: 970,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleFinishSetup,
                                className: "action-btn primary",
                                disabled: !finalConfirmation.ready_for_assignment || loading,
                                children: [
                                    loading ? 'Requesting Assignment...' : 'Request SWCM Assignment',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        children: "assignment_ind"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                        lineNumber: 984,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CPWCaseSetupModal.tsx",
                                lineNumber: 978,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CPWCaseSetupModal.tsx",
                        lineNumber: 952,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/CPWCaseSetupModal.tsx",
                    lineNumber: 951,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/CPWCaseSetupModal.tsx",
            lineNumber: 364,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/CPWCaseSetupModal.tsx",
        lineNumber: 363,
        columnNumber: 5
    }, this);
}
_s(CPWCaseSetupModal, "anqXvJKKzZSZ6rJ48szON/Cm2ac=");
_c = CPWCaseSetupModal;
var _c;
__turbopack_refresh__.register(_c, "CPWCaseSetupModal");

})()),
"[project]/components/MagicSearchModal.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>MagicSearchModal
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/api.ts [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
function MagicSearchModal({ isOpen, onClose, onSelectIncident }) {
    _s();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [searchResults, setSearchResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAdvancedSearch, setShowAdvancedSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [advancedFilters, setAdvancedFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        child_name: '',
        parent_name: '',
        county: '',
        allegation_type: '',
        date_from: '',
        date_to: ''
    });
    // Debounced search
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (searchQuery.length >= 2) {
            const timeoutId = setTimeout(()=>{
                handleSearch(searchQuery);
            }, 300);
            return ()=>clearTimeout(timeoutId);
        } else {
            setSearchResults([]);
        }
    }, [
        searchQuery
    ]);
    const handleSearch = async (query)=>{
        setLoading(true);
        setError(null);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchMagicButtonData"])(query);
            if (response.error) {
                setError(response.error);
                setSearchResults([]);
            } else if (response.data) {
                setSearchResults(response.data.incidents);
            }
        } catch (err) {
            setError('Failed to search incidents');
            setSearchResults([]);
        } finally{
            setLoading(false);
        }
    };
    const handleAdvancedSearch = ()=>{
        // For now, just use the child_name filter as a basic implementation
        if (advancedFilters.child_name) {
            handleSearch(advancedFilters.child_name);
        }
    };
    const formatDate = (dateString)=>{
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };
    const handleSelectIncident = (incident)=>{
        onSelectIncident(incident);
        onClose();
    };
    const handleOverlayClick = (e)=>{
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay",
        onClick: handleOverlayClick,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal-container large scrollable",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-header magic-modal-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "magic-header-content",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "magic-header-icon",
                                    children: "✨"
                                }, void 0, false, {
                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: "Magic Button"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 91,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Search JARVIS incidents to import case data"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 92,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                    lineNumber: 90,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/MagicSearchModal.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "modal-close",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "icon",
                                children: "close"
                            }, void 0, false, {
                                fileName: "[project]/components/MagicSearchModal.tsx",
                                lineNumber: 96,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/MagicSearchModal.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/MagicSearchModal.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-body",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "magic-search-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "magic-search-bar",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "search-icon icon",
                                            children: "search"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 103,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: searchQuery,
                                            onChange: (e)=>setSearchQuery(e.target.value),
                                            placeholder: "Enter incident number (e.g., INC-2024-001234)...",
                                            className: "magic-search-input",
                                            autoFocus: true
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 104,
                                            columnNumber: 15
                                        }, this),
                                        searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSearchQuery(''),
                                            className: "clear-search-btn",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "icon",
                                                children: "close"
                                            }, void 0, false, {
                                                fileName: "[project]/components/MagicSearchModal.tsx",
                                                lineNumber: 117,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 113,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "search-options",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowAdvancedSearch(!showAdvancedSearch),
                                        className: `advanced-search-toggle ${showAdvancedSearch ? 'active' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "icon",
                                                children: "tune"
                                            }, void 0, false, {
                                                fileName: "[project]/components/MagicSearchModal.tsx",
                                                lineNumber: 127,
                                                columnNumber: 17
                                            }, this),
                                            "Advanced Search",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "icon",
                                                children: showAdvancedSearch ? 'expand_less' : 'expand_more'
                                            }, void 0, false, {
                                                fileName: "[project]/components/MagicSearchModal.tsx",
                                                lineNumber: 129,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/MagicSearchModal.tsx",
                                        lineNumber: 123,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this),
                                showAdvancedSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "advanced-search-form",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: "Advanced Search Options"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 135,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-grid",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Child Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 138,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: advancedFilters.child_name,
                                                            onChange: (e)=>setAdvancedFilters({
                                                                    ...advancedFilters,
                                                                    child_name: e.target.value
                                                                }),
                                                            placeholder: "Enter child's name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 139,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                    lineNumber: 137,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Parent Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 147,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: advancedFilters.parent_name,
                                                            onChange: (e)=>setAdvancedFilters({
                                                                    ...advancedFilters,
                                                                    parent_name: e.target.value
                                                                }),
                                                            placeholder: "Enter parent's name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 148,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "County"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 156,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: advancedFilters.county,
                                                            onChange: (e)=>setAdvancedFilters({
                                                                    ...advancedFilters,
                                                                    county: e.target.value
                                                                }),
                                                            placeholder: "Enter county"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 157,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                    lineNumber: 155,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Allegation Type"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 165,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: advancedFilters.allegation_type,
                                                            onChange: (e)=>setAdvancedFilters({
                                                                    ...advancedFilters,
                                                                    allegation_type: e.target.value
                                                                }),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "",
                                                                    children: "All Types"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 170,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Physical abuse",
                                                                    children: "Physical Abuse"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 171,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Sexual abuse",
                                                                    children: "Sexual Abuse"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 172,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Neglect",
                                                                    children: "Neglect"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 173,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Emotional abuse",
                                                                    children: "Emotional Abuse"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 174,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 166,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                    lineNumber: 164,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Date From"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 178,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: advancedFilters.date_from,
                                                            onChange: (e)=>setAdvancedFilters({
                                                                    ...advancedFilters,
                                                                    date_from: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 179,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "form-group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: "Date To"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 186,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: advancedFilters.date_to,
                                                            onChange: (e)=>setAdvancedFilters({
                                                                    ...advancedFilters,
                                                                    date_to: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 187,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                    lineNumber: 185,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 136,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-actions",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleAdvancedSearch,
                                                    className: "action-btn primary",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "icon",
                                                            children: "search"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 196,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Search"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                    lineNumber: 195,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setAdvancedFilters({
                                                            child_name: '',
                                                            parent_name: '',
                                                            county: '',
                                                            allegation_type: '',
                                                            date_from: '',
                                                            date_to: ''
                                                        }),
                                                    className: "action-btn secondary",
                                                    children: "Clear Filters"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 194,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/MagicSearchModal.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "search-results-section",
                            children: [
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "error-message",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            children: "error"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 216,
                                            columnNumber: 17
                                        }, this),
                                        error
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                    lineNumber: 215,
                                    columnNumber: 15
                                }, this),
                                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "loading-state",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            children: "hourglass_empty"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 223,
                                            columnNumber: 17
                                        }, this),
                                        "Searching JARVIS incidents..."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                    lineNumber: 222,
                                    columnNumber: 15
                                }, this),
                                searchQuery.length >= 2 && !loading && searchResults.length === 0 && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "no-results",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            children: "search_off"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 230,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "No incidents found"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 231,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "No incidents match your search criteria. Try a different incident number or use advanced search."
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 232,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                    lineNumber: 229,
                                    columnNumber: 15
                                }, this),
                                searchResults.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "results-container",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: [
                                                "Found ",
                                                searchResults.length,
                                                " incident(s)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 238,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "incidents-list",
                                            children: searchResults.map((incident)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "incident-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "incident-header",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "incident-number",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: incident.incident_number
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/MagicSearchModal.tsx",
                                                                        lineNumber: 244,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 243,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "incident-date",
                                                                    children: [
                                                                        "Intake: ",
                                                                        formatDate(incident.intake_date)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 246,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 242,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "incident-details",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "detail-row",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "label",
                                                                            children: "Child:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 253,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "value",
                                                                            children: [
                                                                                incident.child_first_names,
                                                                                " ",
                                                                                incident.child_last_names
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 254,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 252,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "detail-row",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "label",
                                                                            children: "Age:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 257,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "value",
                                                                            children: [
                                                                                incident.age_calculated,
                                                                                " years old"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 258,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 256,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "detail-row",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "label",
                                                                            children: "Parents:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 261,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "value",
                                                                            children: [
                                                                                incident.parent_first_names,
                                                                                " ",
                                                                                incident.parent_last_names
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 262,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 260,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "detail-row",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "label",
                                                                            children: "Allegations:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 265,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "value",
                                                                            children: incident.allegations
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 266,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 264,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "detail-row",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "label",
                                                                            children: "County:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 269,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "value",
                                                                            children: incident.residence_county
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 270,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 268,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "detail-row",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "label",
                                                                            children: "CPS Worker:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 273,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "value",
                                                                            children: incident.cps_worker
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 274,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 272,
                                                                    columnNumber: 25
                                                                }, this),
                                                                incident.perpetrators && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "detail-row",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "label",
                                                                            children: "Perpetrator:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 278,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "value perpetrator",
                                                                            children: incident.perpetrators
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                                            lineNumber: 279,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                                    lineNumber: 277,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 251,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "incident-actions",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleSelectIncident(incident),
                                                                className: "action-btn primary",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "icon",
                                                                        children: "download"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/MagicSearchModal.tsx",
                                                                        lineNumber: 289,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    "Import Case Data"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/MagicSearchModal.tsx",
                                                                lineNumber: 285,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                                            lineNumber: 284,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, incident.incident_number, true, {
                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 239,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                    lineNumber: 237,
                                    columnNumber: 15
                                }, this),
                                searchQuery.length < 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "search-help",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            children: "info"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 301,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Search JARVIS Incidents"
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 302,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Enter an incident number to search for cases from the JARVIS intake system. The Magic Button will pull in all relevant case information to help with your case setup."
                                        }, void 0, false, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 303,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Start typing an incident number (minimum 2 characters)"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Use advanced search for more specific criteria"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "Select an incident to import all case data automatically"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/MagicSearchModal.tsx",
                                            lineNumber: 304,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/MagicSearchModal.tsx",
                                    lineNumber: 300,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/MagicSearchModal.tsx",
                            lineNumber: 213,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/MagicSearchModal.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-footer",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "modal-actions",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "action-btn secondary",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/MagicSearchModal.tsx",
                            lineNumber: 316,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/MagicSearchModal.tsx",
                        lineNumber: 315,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/MagicSearchModal.tsx",
                    lineNumber: 314,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/MagicSearchModal.tsx",
            lineNumber: 86,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/MagicSearchModal.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_s(MagicSearchModal, "/gySM7BmOFbVRKn0vN+WVGdFzL8=");
_c = MagicSearchModal;
var _c;
__turbopack_refresh__.register(_c, "MagicSearchModal");

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
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CPWCaseSetupModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/CPWCaseSetupModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MagicSearchModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/MagicSearchModal.tsx [app-client] (ecmascript)");
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
    const [isMagicSearchOpen, setIsMagicSearchOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedIncident, setSelectedIncident] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
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
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    index < children.length - 1 && ', '
                ]
            }, child.person_id, true, {
                fileName: "[project]/app/cpw/page.tsx",
                lineNumber: 72,
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
    const handleMagicButtonClick = ()=>{
        setIsMagicSearchOpen(true);
    };
    const handleIncidentSelect = (incident)=>{
        setSelectedIncident(incident);
        // TODO: Create a new case from the incident data or open setup modal with pre-filled data
        console.log('Selected incident:', incident);
    };
    const handleCloseMagicSearch = ()=>{
        setIsMagicSearchOpen(false);
    };
    // Define available filter tags
    const filterTags = [
        {
            id: 'draft',
            label: 'Draft Cases',
            status: [
                'Draft'
            ],
            count: cases.filter((c)=>c.status === 'Draft').length
        },
        {
            id: 'pending-assignment',
            label: 'Pending Assignment',
            status: [
                'Pending Assignment'
            ],
            count: cases.filter((c)=>c.status === 'Pending Assignment').length
        },
        {
            id: 'case-setup',
            label: 'Case Setup',
            status: [
                'Case Setup'
            ],
            count: cases.filter((c)=>c.status === 'Case Setup').length
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
            id: 'active-completed',
            label: 'Active/Completed',
            status: [
                'Active',
                'Closed'
            ],
            count: cases.filter((c)=>c.status === 'Active' || c.status === 'Closed').length
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
                            lineNumber: 197,
                            columnNumber: 13
                        }, this),
                        "Request Assignment"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cpw/page.tsx",
                    lineNumber: 192,
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
                            lineNumber: 208,
                            columnNumber: 13
                        }, this),
                        "Pending"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cpw/page.tsx",
                    lineNumber: 203,
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
                            lineNumber: 219,
                            columnNumber: 13
                        }, this),
                        hasSavedProgress(case_.case_id) ? 'Resume Setup' : 'Start Setup'
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cpw/page.tsx",
                    lineNumber: 214,
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
                            lineNumber: 230,
                            columnNumber: 13
                        }, this),
                        "Awaiting Approval"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cpw/page.tsx",
                    lineNumber: 225,
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
                            lineNumber: 238,
                            columnNumber: 13
                        }, this),
                        "View"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cpw/page.tsx",
                    lineNumber: 237,
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
                            lineNumber: 245,
                            columnNumber: 13
                        }, this),
                        "Unknown Status"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/cpw/page.tsx",
                    lineNumber: 244,
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
                        lineNumber: 256,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "page-description",
                        children: "Loading cases..."
                    }, void 0, false, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cpw/page.tsx",
                lineNumber: 255,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/cpw/page.tsx",
            lineNumber: 254,
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
                        lineNumber: 266,
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
                                    lineNumber: 269,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: "search-input",
                                    placeholder: "Ask me anything about your cases, or search for specific information..."
                                }, void 0, false, {
                                    fileName: "[project]/app/cpw/page.tsx",
                                    lineNumber: 270,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "search-submit",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "icon",
                                        children: "send"
                                    }, void 0, false, {
                                        fileName: "[project]/app/cpw/page.tsx",
                                        lineNumber: 276,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/cpw/page.tsx",
                                    lineNumber: 275,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cpw/page.tsx",
                            lineNumber: 268,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cpw/page.tsx",
                lineNumber: 265,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "content-wrapper",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filter-container",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleMagicButtonClick,
                                        className: "magic-button",
                                        title: "Search JARVIS incidents to import case data",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "magic-icon",
                                                children: "✨"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 290,
                                                columnNumber: 15
                                            }, this),
                                            "Magic Button"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cpw/page.tsx",
                                        lineNumber: 285,
                                        columnNumber: 13
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
                                                        lineNumber: 299,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Clear Filters"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 294,
                                                columnNumber: 15
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
                                                        lineNumber: 303,
                                                        columnNumber: 17
                                                    }, this),
                                                    "Refresh"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 302,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cpw/page.tsx",
                                        lineNumber: 293,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cpw/page.tsx",
                                lineNumber: 284,
                                columnNumber: 11
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
                                                lineNumber: 316,
                                                columnNumber: 17
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
                                                lineNumber: 317,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, tag.id, true, {
                                        fileName: "[project]/app/cpw/page.tsx",
                                        lineNumber: 310,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/cpw/page.tsx",
                                lineNumber: 308,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 283,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "content-area",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "card-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: [
                                                activeFilters.length === 0 ? 'All Cases' : activeFilters.length === 1 ? activeFilters[0] : `${activeFilters.length} Filters Active`,
                                                activeFilters.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "filter-summary",
                                                    children: [
                                                        " (",
                                                        activeFilters.join(', '),
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 334,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cpw/page.tsx",
                                            lineNumber: 326,
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
                                                lineNumber: 338,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/cpw/page.tsx",
                                            lineNumber: 337,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cpw/page.tsx",
                                    lineNumber: 325,
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
                                                    lineNumber: 344,
                                                    columnNumber: 19
                                                }, this),
                                                error
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cpw/page.tsx",
                                            lineNumber: 343,
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
                                                                    lineNumber: 353,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 354,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Intake Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 355,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Key Allegations"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 356,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Children Involved"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 357,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Indicators"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 358,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Progress"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 359,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Assigned Workers"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 360,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Actions"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                    lineNumber: 361,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/cpw/page.tsx",
                                                            lineNumber: 352,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 351,
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
                                                                                        lineNumber: 370,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 369,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "case-number",
                                                                                    children: case_.case_number
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 372,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 368,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 367,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `status-badge ${case_.status.toLowerCase().replace(/\s+/g, '-')}`,
                                                                            children: case_.status
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 376,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 375,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: new Date(case_.created_date).toLocaleDateString()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 380,
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
                                                                                    lineNumber: 383,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "allegation-desc",
                                                                                    children: case_.allegation_description
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 384,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 382,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 381,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "children-list",
                                                                            children: getChildrenNames(case_) || 'No children listed'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 388,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 387,
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
                                                                                                lineNumber: 400,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            indicator
                                                                                        ]
                                                                                    }, index, true, {
                                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                                        lineNumber: 395,
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
                                                                                    lineNumber: 405,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 393,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 392,
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
                                                                                                    lineNumber: 418,
                                                                                                    columnNumber: 39
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/cpw/page.tsx",
                                                                                                lineNumber: 417,
                                                                                                columnNumber: 37
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "progress-text-small",
                                                                                                children: progress.step > 0 ? `Step ${progress.step}/${progress.total}` : 'Not Started'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/cpw/page.tsx",
                                                                                                lineNumber: 423,
                                                                                                columnNumber: 37
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                                        lineNumber: 416,
                                                                                        columnNumber: 35
                                                                                    }, this);
                                                                                })(),
                                                                                case_.status !== 'Case Setup' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "progress-na",
                                                                                    children: "—"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 430,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 412,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 411,
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
                                                                                            lineNumber: 437,
                                                                                            columnNumber: 33
                                                                                        }, this),
                                                                                        " ",
                                                                                        case_.assigned_worker || 'Unassigned'
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 436,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                case_.assigned_supervisor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "supervisor",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                            children: "Supervisor:"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                                            lineNumber: 441,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        " ",
                                                                                        case_.assigned_supervisor
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/cpw/page.tsx",
                                                                                    lineNumber: 440,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 435,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 434,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "action-buttons",
                                                                            children: getCaseActionButton(case_)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw/page.tsx",
                                                                            lineNumber: 447,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw/page.tsx",
                                                                        lineNumber: 446,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, case_.case_id, true, {
                                                                fileName: "[project]/app/cpw/page.tsx",
                                                                lineNumber: 366,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw/page.tsx",
                                                        lineNumber: 364,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw/page.tsx",
                                                lineNumber: 350,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/cpw/page.tsx",
                                            lineNumber: 349,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "empty-state",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "icon large",
                                                    children: "filter_list"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 458,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    children: "No Cases Match Current Filters"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 459,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: activeFilters.length === 0 ? 'No cases found in the system' : `Try adjusting your filters or clearing them to see more cases`
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 460,
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
                                                            lineNumber: 471,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Clear All Filters"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/cpw/page.tsx",
                                                    lineNumber: 467,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cpw/page.tsx",
                                            lineNumber: 457,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cpw/page.tsx",
                                    lineNumber: 341,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cpw/page.tsx",
                            lineNumber: 324,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/cpw/page.tsx",
                        lineNumber: 323,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cpw/page.tsx",
                lineNumber: 282,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CPWCaseSetupModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isSetupModalOpen,
                onClose: handleCloseModal,
                case_: selectedCase,
                onSuccess: handleSetupSuccess
            }, void 0, false, {
                fileName: "[project]/app/cpw/page.tsx",
                lineNumber: 483,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MagicSearchModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isMagicSearchOpen,
                onClose: handleCloseMagicSearch,
                onSelectIncident: handleIncidentSelect
            }, void 0, false, {
                fileName: "[project]/app/cpw/page.tsx",
                lineNumber: 491,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/cpw/page.tsx",
        lineNumber: 264,
        columnNumber: 5
    }, this);
}
_s(CPWPage, "JQwboJJ0Y7IPNE+qXxnbCx7RWDY=");
_c = CPWPage;
var _c;
__turbopack_refresh__.register(_c, "CPWPage");

})()),
"[project]/app/cpw/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=_a7e07c._.js.map