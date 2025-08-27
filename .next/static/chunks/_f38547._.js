(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_f38547._.js", {

"[project]/lib/mockData.ts [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "assignCaseToWorker": ()=>assignCaseToWorker,
    "getCaseById": ()=>getCaseById,
    "getCasesBySupervisor": ()=>getCasesBySupervisor,
    "getCasesByWorker": ()=>getCasesByWorker,
    "getCasesPendingCPWReview": ()=>getCasesPendingCPWReview,
    "getCasesPendingCPWSupervisorApproval": ()=>getCasesPendingCPWSupervisorApproval,
    "getCasesPendingSWCMAssignment": ()=>getCasesPendingSWCMAssignment,
    "getCurrentUser": ()=>getCurrentUser,
    "getDocumentsByCase": ()=>getDocumentsByCase,
    "getPendingAssignmentCases": ()=>getPendingAssignmentCases,
    "getPersonById": ()=>getPersonById,
    "getPersonsByCase": ()=>getPersonsByCase,
    "getTimelineEventsByCase": ()=>getTimelineEventsByCase,
    "mockCases": ()=>mockCases,
    "mockUsers": ()=>mockUsers,
    "updateCaseWorkflowStatus": ()=>updateCaseWorkflowStatus
});
const mockUsers = [
    {
        user_id: 'user_1',
        name: 'Olivia Rodriguez',
        role: 'caseworker',
        email: 'olivia.rodriguez@state.gov'
    },
    {
        user_id: 'user_2',
        name: 'Michael Chen',
        role: 'caseworker',
        email: 'michael.chen@state.gov'
    },
    {
        user_id: 'user_3',
        name: 'Sarah Williams',
        role: 'supervisor',
        email: 'sarah.williams@state.gov'
    },
    {
        user_id: 'user_4',
        name: 'David Thompson',
        role: 'caseworker',
        email: 'david.thompson@state.gov'
    }
];
const mockCases = [
    {
        case_id: 'case_1',
        case_number: 'CASE-20240115103000',
        status: 'Active',
        priority_level: 'High',
        assigned_worker: 'Olivia Rodriguez',
        assigned_supervisor: 'Sarah Williams',
        workflow_status: {
            current_stage: 'active_case_management',
            cpw_reviewed: true,
            cpw_reviewed_by: 'Jennifer Smith',
            cpw_reviewed_date: '2024-01-15T11:00:00Z',
            cpw_supervisor_approved: true,
            cpw_supervisor_approved_by: 'Mark Johnson',
            cpw_supervisor_approved_date: '2024-01-15T14:00:00Z',
            swcm_assigned: true,
            swcm_assigned_by: 'Sarah Williams',
            swcm_assigned_date: '2024-01-15T15:30:00Z'
        },
        primary_child: 'Emma Johnson',
        family_name: 'Johnson Family',
        allegation_type: 'Physical Abuse',
        allegation_description: 'School nurse reported bruising on child\'s arms consistent with physical abuse',
        created_date: '2024-01-15T10:30:00Z',
        last_updated: '2024-01-18T14:20:00Z',
        created_by: 'System',
        referral_id: 'ref_001',
        jarvis_case_id: 'JARVIS-2024-001',
        county: 'Polk County',
        intake_worker: 'Jennifer Smith',
        risk_level: 'High',
        safety_factors: [
            'Physical injury to child',
            'History of domestic violence',
            'Substance abuse concerns'
        ],
        persons: [
            {
                person_id: 'person_1',
                first_name: 'Emma',
                last_name: 'Johnson',
                date_of_birth: '2017-03-15',
                role: 'child',
                contact_info: {
                    address: '123 Maple Street, Des Moines, IA 50309'
                },
                indicators: [
                    'Medical Needs',
                    'School Issues'
                ],
                relationship_to_primary_child: 'Self'
            },
            {
                person_id: 'person_2',
                first_name: 'Robert',
                last_name: 'Johnson',
                date_of_birth: '1985-07-22',
                role: 'parent',
                contact_info: {
                    phone: '(515) 555-0123',
                    address: '123 Maple Street, Des Moines, IA 50309'
                },
                relationship_to_primary_child: 'Father'
            },
            {
                person_id: 'person_3',
                first_name: 'Lisa',
                last_name: 'Johnson',
                date_of_birth: '1987-11-08',
                role: 'parent',
                contact_info: {
                    phone: '(515) 555-0124',
                    address: '123 Maple Street, Des Moines, IA 50309'
                },
                relationship_to_primary_child: 'Mother'
            }
        ],
        timeline_events: [
            {
                event_id: 'event_1',
                event_type: 'case_note',
                title: 'Initial Home Visit',
                description: 'Completed initial safety assessment and interviewed family members',
                date: '2024-01-16T09:15:00Z',
                created_by: 'Olivia Rodriguez',
                priority: 'high'
            },
            {
                event_id: 'event_2',
                event_type: 'document_upload',
                title: 'Medical Records Uploaded',
                description: 'Hospital records from emergency room visit uploaded to case file',
                date: '2024-01-16T15:30:00Z',
                created_by: 'Olivia Rodriguez'
            },
            {
                event_id: 'event_3',
                event_type: 'court_hearing',
                title: 'Emergency Custody Hearing',
                description: 'Court granted temporary custody to state pending investigation',
                date: '2024-01-17T10:00:00Z',
                created_by: 'Court System',
                priority: 'high'
            }
        ],
        documents: [
            {
                document_id: 'doc_1',
                title: 'Emergency Room Report',
                type: 'medical',
                uploaded_date: '2024-01-16T15:30:00Z',
                uploaded_by: 'Olivia Rodriguez',
                file_size: '2.3 MB',
                description: 'Medical examination documenting injuries'
            },
            {
                document_id: 'doc_2',
                title: 'School Incident Report',
                type: 'other',
                uploaded_date: '2024-01-16T16:00:00Z',
                uploaded_by: 'Olivia Rodriguez',
                file_size: '1.1 MB',
                description: 'Initial report from school nurse'
            }
        ],
        case_notes: [
            {
                note_id: 'note_1',
                text: 'Initial home visit completed. Child appears safe in current environment. Father cooperative during interview.',
                created_by: 'Olivia Rodriguez',
                created_date: '2024-01-16T09:15:00Z'
            },
            {
                note_id: 'note_2',
                text: 'Spoke with school nurse who made initial report. Provided additional details about observed injuries.',
                created_by: 'Olivia Rodriguez',
                created_date: '2024-01-17T11:30:00Z'
            }
        ],
        next_court_date: '2024-01-25T13:30:00Z',
        safety_assessment_due: '2024-01-19T17:00:00Z'
    },
    {
        case_id: 'case_2',
        case_number: 'CASE-20240110143000',
        status: 'Active',
        priority_level: 'Medium',
        assigned_worker: 'Olivia Rodriguez',
        assigned_supervisor: 'Sarah Williams',
        workflow_status: {
            current_stage: 'active_case_management',
            cpw_reviewed: true,
            cpw_reviewed_by: 'Jennifer Smith',
            cpw_reviewed_date: '2024-01-10T15:00:00Z',
            cpw_supervisor_approved: true,
            cpw_supervisor_approved_by: 'Mark Johnson',
            cpw_supervisor_approved_date: '2024-01-10T16:30:00Z',
            swcm_assigned: true,
            swcm_assigned_by: 'Sarah Williams',
            swcm_assigned_date: '2024-01-11T09:00:00Z'
        },
        primary_child: 'Carlos Martinez',
        family_name: 'Martinez Family',
        allegation_type: 'Neglect',
        allegation_description: 'Neighbor reported child left unattended for extended periods',
        created_date: '2024-01-10T14:30:00Z',
        last_updated: '2024-01-17T16:45:00Z',
        created_by: 'System',
        referral_id: 'ref_002',
        jarvis_case_id: 'JARVIS-2024-002',
        county: 'Linn County',
        intake_worker: 'Jennifer Smith',
        risk_level: 'Moderate',
        safety_factors: [
            'Inadequate supervision',
            'Young child age'
        ],
        persons: [
            {
                person_id: 'person_4',
                first_name: 'Carlos',
                last_name: 'Martinez',
                date_of_birth: '2019-05-10',
                role: 'child',
                contact_info: {
                    address: '456 Oak Avenue, Cedar Rapids, IA 52402'
                },
                indicators: [
                    'Allergy - Peanuts'
                ],
                relationship_to_primary_child: 'Self'
            },
            {
                person_id: 'person_5',
                first_name: 'Maria',
                last_name: 'Martinez',
                date_of_birth: '1992-02-14',
                role: 'parent',
                contact_info: {
                    phone: '(319) 555-0234',
                    address: '456 Oak Avenue, Cedar Rapids, IA 52402'
                },
                relationship_to_primary_child: 'Mother'
            }
        ],
        timeline_events: [
            {
                event_id: 'event_4',
                event_type: 'visit',
                title: 'Unannounced Home Visit',
                description: 'Conducted welfare check - child present and appears healthy',
                date: '2024-01-12T14:20:00Z',
                created_by: 'Olivia Rodriguez'
            },
            {
                event_id: 'event_5',
                event_type: 'assessment',
                title: 'Safety Assessment Completed',
                description: 'Comprehensive safety assessment indicates moderate risk level',
                date: '2024-01-13T11:00:00Z',
                created_by: 'Olivia Rodriguez',
                priority: 'medium'
            }
        ],
        documents: [],
        case_notes: [
            {
                note_id: 'note_3',
                text: 'Mother appears overwhelmed but willing to accept services. Discussed parenting resources.',
                created_by: 'Olivia Rodriguez',
                created_date: '2024-01-12T10:00:00Z'
            }
        ],
        case_plan_due: '2024-01-24T17:00:00Z'
    },
    {
        case_id: 'case_5',
        case_number: 'CASE-20240118090000',
        status: 'Pending Assignment',
        priority_level: 'High',
        assigned_supervisor: 'Sarah Williams',
        workflow_status: {
            current_stage: 'swcm_assignment',
            cpw_reviewed: true,
            cpw_reviewed_by: 'Jennifer Smith',
            cpw_reviewed_date: '2024-01-18T10:00:00Z',
            cpw_supervisor_approved: true,
            cpw_supervisor_approved_by: 'Mark Johnson',
            cpw_supervisor_approved_date: '2024-01-18T11:30:00Z',
            swcm_assigned: false
        },
        primary_child: 'Ashley Davis',
        family_name: 'Davis Family',
        allegation_type: 'Sexual Abuse',
        allegation_description: 'Child disclosed inappropriate touching by mother\'s boyfriend',
        created_date: '2024-01-18T09:00:00Z',
        last_updated: '2024-01-18T09:00:00Z',
        created_by: 'System',
        referral_id: 'ref_005',
        jarvis_case_id: 'JARVIS-2024-005',
        county: 'Story County',
        intake_worker: 'Jennifer Smith',
        risk_level: 'Very High',
        safety_factors: [
            'Sexual abuse allegation',
            'Child disclosure',
            'Perpetrator has access'
        ],
        persons: [
            {
                person_id: 'person_10',
                first_name: 'Ashley',
                last_name: 'Davis',
                date_of_birth: '2016-08-25',
                role: 'child',
                contact_info: {
                    address: '654 Birch Lane, Ames, IA 50010'
                },
                indicators: [
                    'ICWA Eligible'
                ],
                relationship_to_primary_child: 'Self'
            },
            {
                person_id: 'person_11',
                first_name: 'Jessica',
                last_name: 'Davis',
                date_of_birth: '1995-04-03',
                role: 'parent',
                contact_info: {
                    phone: '(515) 555-0567',
                    address: '654 Birch Lane, Ames, IA 50010'
                },
                relationship_to_primary_child: 'Mother'
            }
        ],
        timeline_events: [],
        documents: [],
        case_notes: [],
        safety_assessment_due: '2024-01-19T09:00:00Z'
    },
    {
        case_id: 'case_6',
        case_number: 'CASE-20240118140000',
        status: 'Pending Assignment',
        priority_level: 'Medium',
        assigned_supervisor: 'Sarah Williams',
        workflow_status: {
            current_stage: 'cpw_supervisor_approval',
            cpw_reviewed: true,
            cpw_reviewed_by: 'Jennifer Smith',
            cpw_reviewed_date: '2024-01-18T15:00:00Z',
            cpw_supervisor_approved: false
        },
        primary_child: 'Michael Brown',
        family_name: 'Brown Family',
        allegation_type: 'Neglect',
        allegation_description: 'Medical neglect - child missed multiple medical appointments',
        created_date: '2024-01-18T14:00:00Z',
        last_updated: '2024-01-18T14:00:00Z',
        created_by: 'System',
        referral_id: 'ref_006',
        jarvis_case_id: 'JARVIS-2024-006',
        county: 'Black Hawk County',
        intake_worker: 'Jennifer Smith',
        risk_level: 'Moderate',
        safety_factors: [
            'Medical neglect',
            'Chronic health conditions'
        ],
        persons: [
            {
                person_id: 'person_12',
                first_name: 'Michael',
                last_name: 'Brown',
                date_of_birth: '2018-11-12',
                role: 'child',
                contact_info: {
                    address: '987 Cedar Street, Waterloo, IA 50701'
                },
                indicators: [
                    'Chronic Medical Condition'
                ],
                relationship_to_primary_child: 'Self'
            }
        ],
        timeline_events: [],
        documents: [],
        case_notes: [],
        safety_assessment_due: '2024-01-21T14:00:00Z'
    }
];
const getCasesByWorker = (workerName)=>{
    return mockCases.filter((case_)=>case_.assigned_worker === workerName);
};
const getCasesBySupervisor = (supervisorName)=>{
    return mockCases.filter((case_)=>case_.assigned_supervisor === supervisorName);
};
const getPendingAssignmentCases = ()=>{
    return mockCases.filter((case_)=>case_.status === 'Pending Assignment');
};
const getCasesPendingCPWReview = ()=>{
    return mockCases.filter((case_)=>case_.workflow_status.current_stage === 'cpw_review' || case_.workflow_status.current_stage === 'jarvis_referral' && !case_.workflow_status.cpw_reviewed);
};
const getCasesPendingCPWSupervisorApproval = ()=>{
    return mockCases.filter((case_)=>case_.workflow_status.current_stage === 'cpw_supervisor_approval' && case_.workflow_status.cpw_reviewed && !case_.workflow_status.cpw_supervisor_approved);
};
const getCasesPendingSWCMAssignment = ()=>{
    return mockCases.filter((case_)=>case_.workflow_status.current_stage === 'swcm_assignment' && case_.workflow_status.cpw_supervisor_approved && !case_.workflow_status.swcm_assigned);
};
const getPersonsByCase = (caseId)=>{
    const case_ = getCaseById(caseId);
    return case_?.persons || [];
};
const getTimelineEventsByCase = (caseId)=>{
    const case_ = getCaseById(caseId);
    return case_?.timeline_events.sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime()) || [];
};
const getDocumentsByCase = (caseId)=>{
    const case_ = getCaseById(caseId);
    return case_?.documents || [];
};
const getCaseById = (caseId)=>{
    return mockCases.find((case_)=>case_.case_id === caseId);
};
const getPersonById = (personId)=>{
    // Search through all cases for the person
    for (const case_ of mockCases){
        const person = case_.persons.find((p)=>p.person_id === personId);
        if (person) return person;
    }
    return undefined;
};
const getCurrentUser = ()=>{
    return mockUsers[0] // Olivia Rodriguez as default user
    ;
};
const updateCaseWorkflowStatus = (caseId, updates)=>{
    const case_ = getCaseById(caseId);
    if (case_) {
        case_.workflow_status = {
            ...case_.workflow_status,
            ...updates
        };
        case_.last_updated = new Date().toISOString();
    }
    return case_;
};
const assignCaseToWorker = (caseId, workerName, supervisorName)=>{
    const case_ = getCaseById(caseId);
    if (case_) {
        case_.assigned_worker = workerName;
        case_.assigned_supervisor = supervisorName;
        case_.status = 'Active';
        case_.workflow_status.current_stage = 'active_case_management';
        case_.workflow_status.swcm_assigned = true;
        case_.workflow_status.swcm_assigned_by = supervisorName;
        case_.workflow_status.swcm_assigned_date = new Date().toISOString();
        case_.last_updated = new Date().toISOString();
    }
    return case_;
};

})()),
"[project]/app/cpw-supervisor/page.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>CPWSupervisorPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/api.ts [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
'use client';
;
;
;
function CPWSupervisorPage() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('pending');
    const [cases, setCases] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadCases();
    }, []);
    const loadCases = async ()=>{
        setLoading(true);
        setError(null);
        // Get cases with "Pending Assignment" status for CPW supervisor review
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCasesByWorker"])('unassigned');
        if (response.error) {
            setError(response.error);
        } else if (response.data) {
            // Filter for cases that are "Pending Assignment" (completed by CPW, awaiting supervisor approval)
            const pendingApprovalCases = response.data.cases.filter((case_)=>case_.status === 'Pending Assignment');
            setCases(pendingApprovalCases);
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
                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    index < children.length - 1 && ', '
                ]
            }, child.person_id, true, {
                fileName: "[project]/app/cpw-supervisor/page.tsx",
                lineNumber: 67,
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
    const getDaysPending = (case_)=>{
        if (!case_.last_updated) return 0;
        return Math.floor((Date.now() - new Date(case_.last_updated).getTime()) / (1000 * 60 * 60 * 24));
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "page-container",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "page-title",
                        children: "CPW Supervisor View"
                    }, void 0, false, {
                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                        lineNumber: 97,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "page-description",
                        children: "Loading cases..."
                    }, void 0, false, {
                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cpw-supervisor/page.tsx",
                lineNumber: 96,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/cpw-supervisor/page.tsx",
            lineNumber: 95,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "page-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "page-title",
                        children: "CPW Supervisor View"
                    }, void 0, false, {
                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "page-description",
                        children: "Review and approve cases from CPW workers"
                    }, void 0, false, {
                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cpw-supervisor/page.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "content-wrapper",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "tabs-container",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "tabs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `tab ${activeTab === 'pending' ? 'active' : ''}`,
                                    onClick: ()=>setActiveTab('pending'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            children: "pending_actions"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                            lineNumber: 118,
                                            columnNumber: 15
                                        }, this),
                                        "Pending Approval (",
                                        cases.length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                    lineNumber: 114,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `tab ${activeTab === 'approved' ? 'active' : ''}`,
                                    onClick: ()=>setActiveTab('approved'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            children: "check_circle"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                            lineNumber: 125,
                                            columnNumber: 15
                                        }, this),
                                        "Approved Today"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `tab ${activeTab === 'team' ? 'active' : ''}`,
                                    onClick: ()=>setActiveTab('team'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "icon",
                                            children: "group"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                            lineNumber: 132,
                                            columnNumber: 15
                                        }, this),
                                        "Team Workload"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "tab-content",
                        children: [
                            activeTab === 'pending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "card-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Cases Pending CPW Supervisor Approval"
                                            }, void 0, false, {
                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                lineNumber: 142,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "card-actions",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "action-btn secondary",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "icon",
                                                                children: "filter_list"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                lineNumber: 145,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Filter"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "action-btn primary",
                                                        onClick: loadCases,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "icon",
                                                                children: "refresh"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                lineNumber: 149,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Refresh"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                        lineNumber: 148,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                lineNumber: 143,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                        lineNumber: 141,
                                        columnNumber: 15
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
                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                        lineNumber: 157,
                                                        columnNumber: 21
                                                    }, this),
                                                    error
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                lineNumber: 156,
                                                columnNumber: 19
                                            }, this),
                                            cases.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                        lineNumber: 166,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        children: "Intake Date"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                        lineNumber: 167,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        children: "Key Allegations"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                        lineNumber: 168,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        children: "Children Involved"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                        lineNumber: 169,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        children: "Risk Level"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                        lineNumber: 170,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        children: "Indicators"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                        lineNumber: 171,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        children: "Days Pending"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                        lineNumber: 172,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                        children: "Actions"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                        lineNumber: 173,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                lineNumber: 165,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                            lineNumber: 164,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                            children: cases.map((case_)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
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
                                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                            lineNumber: 182,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                        lineNumber: 181,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "case-number",
                                                                                        children: case_.case_number
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                        lineNumber: 184,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                lineNumber: 180,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 179,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            children: new Date(case_.created_date).toLocaleDateString()
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 187,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "allegation-cell",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "allegation-type",
                                                                                        children: case_.allegation_type
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                        lineNumber: 190,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "allegation-desc",
                                                                                        children: case_.allegation_description
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                        lineNumber: 191,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                lineNumber: 189,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 188,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "children-list",
                                                                                children: getChildrenNames(case_) || 'No children listed'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                lineNumber: 195,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 194,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `risk-badge ${case_.risk_level?.toLowerCase().replace(' ', '-')}`,
                                                                                children: case_.risk_level || 'Not Set'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                lineNumber: 200,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 199,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "indicators-cell",
                                                                                children: [
                                                                                    getAllIndicators(case_).slice(0, 2).map((indicator, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: `indicator-badge ${getIndicatorColor(indicator)}`,
                                                                                            title: indicator,
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "icon",
                                                                                                    children: getIndicatorIcon(indicator)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                                    lineNumber: 212,
                                                                                                    columnNumber: 37
                                                                                                }, this),
                                                                                                indicator
                                                                                            ]
                                                                                        }, index, true, {
                                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                            lineNumber: 207,
                                                                                            columnNumber: 35
                                                                                        }, this)),
                                                                                    getAllIndicators(case_).length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "indicator-more",
                                                                                        children: [
                                                                                            "+",
                                                                                            getAllIndicators(case_).length - 2,
                                                                                            " more"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                        lineNumber: 217,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                lineNumber: 205,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 204,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "days-pending",
                                                                                children: getDaysPending(case_)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                lineNumber: 224,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 223,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "action-buttons",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        className: "action-btn small success",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "icon",
                                                                                                children: "check"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                                lineNumber: 231,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            "Approve"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                        lineNumber: 230,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        className: "action-btn small warning",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "icon",
                                                                                                children: "close"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                                lineNumber: 235,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            "Reject"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                        lineNumber: 234,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                        href: `/cases/${case_.case_id}`,
                                                                                        className: "action-btn small secondary",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "icon",
                                                                                                children: "visibility"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                                lineNumber: 239,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            "Review"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                        lineNumber: 238,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                                lineNumber: 229,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 228,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, case_.case_id, true, {
                                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                    lineNumber: 178,
                                                                    columnNumber: 27
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                            lineNumber: 176,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                lineNumber: 162,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "empty-state",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "icon large",
                                                        children: "check_circle"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                        lineNumber: 251,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: "No Cases Pending Approval"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "All cases have been reviewed and approved"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                        lineNumber: 253,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                lineNumber: 250,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, this),
                            activeTab === 'approved' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "card-header",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: "Cases Approved Today"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                            lineNumber: 263,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                        lineNumber: 262,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "card-content",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "empty-state",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "icon large",
                                                    children: "check_circle"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                    lineNumber: 267,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    children: "No Cases Approved Today"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "No cases have been approved today"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                    lineNumber: 269,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                            lineNumber: 266,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                        lineNumber: 265,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                lineNumber: 261,
                                columnNumber: 13
                            }, this),
                            activeTab === 'team' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "card-header",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: "Team Workload Overview"
                                        }, void 0, false, {
                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                            lineNumber: 278,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                        lineNumber: 277,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "card-content",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "workload-grid",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "workload-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "workload-header",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    children: "Jennifer Smith"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                    lineNumber: 284,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "worker-role",
                                                                    children: "CPW"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                    lineNumber: 285,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                            lineNumber: 283,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "workload-stats",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "stat",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "stat-number",
                                                                            children: "12"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 289,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "stat-label",
                                                                            children: "Active Cases"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 290,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                    lineNumber: 288,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "stat",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "stat-number",
                                                                            children: "3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 293,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "stat-label",
                                                                            children: "Pending Review"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 294,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                    lineNumber: 292,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "stat",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "stat-number",
                                                                            children: "2"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 297,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "stat-label",
                                                                            children: "Overdue"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 298,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                    lineNumber: 296,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                            lineNumber: 287,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                    lineNumber: 282,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "workload-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "workload-header",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    children: "Mark Johnson"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                    lineNumber: 305,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "worker-role",
                                                                    children: "CPW"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                    lineNumber: 306,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                            lineNumber: 304,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "workload-stats",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "stat",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "stat-number",
                                                                            children: "8"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 310,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "stat-label",
                                                                            children: "Active Cases"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 311,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                    lineNumber: 309,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "stat",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "stat-number",
                                                                            children: "1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 314,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "stat-label",
                                                                            children: "Pending Review"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 315,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                    lineNumber: 313,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "stat",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "stat-number",
                                                                            children: "0"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 318,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "stat-label",
                                                                            children: "Overdue"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                            lineNumber: 319,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                                    lineNumber: 317,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                            lineNumber: 308,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/cpw-supervisor/page.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/cpw-supervisor/page.tsx",
                                            lineNumber: 281,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                                        lineNumber: 280,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/cpw-supervisor/page.tsx",
                                lineNumber: 276,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/cpw-supervisor/page.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/cpw-supervisor/page.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/cpw-supervisor/page.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_s(CPWSupervisorPage, "W3cumCqFdc++0Jm6DkwzQoIeLgg=");
_c = CPWSupervisorPage;
var _c;
__turbopack_refresh__.register(_c, "CPWSupervisorPage");

})()),
"[project]/app/cpw-supervisor/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=_f38547._.js.map