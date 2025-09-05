export interface Person {
  person_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  role: 'child' | 'parent' | 'caregiver' | 'relative' | 'professional'
  contact_info: {
    phone?: string
    email?: string
    address?: string
  }
  indicators?: string[]
  relationship_to_primary_child?: string
}

export interface TimelineEvent {
  event_id: string
  event_type: 'case_note' | 'visit' | 'court_hearing' | 'placement_change' | 'assessment' | 'document_upload' | 'assignment_change'
  title: string
  description: string
  date: string
  created_by: string
  priority?: 'low' | 'medium' | 'high'
}

export interface Document {
  document_id: string
  title: string
  type: 'medical' | 'legal' | 'assessment' | 'photo' | 'court_order' | 'other'
  uploaded_date: string
  uploaded_by: string
  file_size?: string
  description?: string
}

export interface CaseWorkflowStatus {
  current_stage: 'jarvis_referral' | 'cpw_review' | 'cpw_supervisor_approval' | 'swcm_assignment' | 'active_case_management'
  cpw_reviewed?: boolean
  cpw_reviewed_by?: string
  cpw_reviewed_date?: string
  cpw_supervisor_approved?: boolean
  cpw_supervisor_approved_by?: string
  cpw_supervisor_approved_date?: string
  swcm_assigned?: boolean
  swcm_assigned_by?: string
  swcm_assigned_date?: string
}

export interface Case {
  case_id: string
  case_number: string
  status: 'Draft' | 'Pending Assignment' | 'Active' | 'Closed'
  priority_level: 'Low' | 'Medium' | 'High'
  
  // Case Assignment & Workflow
  assigned_worker?: string
  assigned_supervisor?: string
  workflow_status: CaseWorkflowStatus
  
  // Primary Case Information
  primary_child: string
  family_name: string
  allegation_type: string
  allegation_description: string
  
  // Dates & Tracking
  created_date: string
  last_updated: string
  created_by: string
  referral_id?: string
  jarvis_case_id?: string
  
  // Embedded Related Data (Case-Centric Model)
  persons: Person[]
  timeline_events: TimelineEvent[]
  documents: Document[]
  case_notes: Array<{
    note_id: string
    text: string
    created_by: string
    created_date: string
  }>
  
  // Important Dates
  next_court_date?: string
  safety_assessment_due?: string
  case_plan_due?: string
  
  // Additional Case Details
  county: string
  intake_worker?: string
  risk_level?: 'Low' | 'Moderate' | 'High' | 'Very High'
  safety_factors?: string[]
  assessment_notes?: string
}

export interface User {
  user_id: string
  name: string
  role: 'caseworker' | 'supervisor' | 'administrator'
  email: string
}

// Mock Users
export const mockUsers: User[] = [
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
]

// Mock Cases with Embedded Data (Case-Centric Model)
export const mockCases: Case[] = [
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
    safety_factors: ['Physical injury to child', 'History of domestic violence', 'Substance abuse concerns'],
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
        indicators: ['Medical Needs', 'School Issues'],
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
    safety_factors: ['Inadequate supervision', 'Young child age'],
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
        indicators: ['Allergy - Peanuts'],
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
    safety_factors: ['Sexual abuse allegation', 'Child disclosure', 'Perpetrator has access'],
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
        indicators: ['ICWA Eligible'],
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
    safety_factors: ['Medical neglect', 'Chronic health conditions'],
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
        indicators: ['Chronic Medical Condition'],
        relationship_to_primary_child: 'Self'
      }
    ],
    timeline_events: [],
    documents: [],
    case_notes: [],
    safety_assessment_due: '2024-01-21T14:00:00Z'
  }
]

// Helper functions for Case-Centric Model
export const getCasesByWorker = (workerName: string): Case[] => {
  return mockCases.filter(case_ => case_.assigned_worker === workerName)
}

export const getCasesBySupervisor = (supervisorName: string): Case[] => {
  return mockCases.filter(case_ => case_.assigned_supervisor === supervisorName)
}

export const getPendingAssignmentCases = (): Case[] => {
  return mockCases.filter(case_ => case_.status === 'Pending Assignment')
}

export const getCasesPendingCPWReview = (): Case[] => {
  return mockCases.filter(case_ => 
    case_.workflow_status.current_stage === 'cpw_review' || 
    (case_.workflow_status.current_stage === 'jarvis_referral' && !case_.workflow_status.cpw_reviewed)
  )
}

export const getCasesPendingCPWSupervisorApproval = (): Case[] => {
  return mockCases.filter(case_ => 
    case_.workflow_status.current_stage === 'cpw_supervisor_approval' && 
    case_.workflow_status.cpw_reviewed && 
    !case_.workflow_status.cpw_supervisor_approved
  )
}

export const getCasesPendingSWCMAssignment = (): Case[] => {
  return mockCases.filter(case_ => 
    case_.workflow_status.current_stage === 'swcm_assignment' && 
    case_.workflow_status.cpw_supervisor_approved && 
    !case_.workflow_status.swcm_assigned
  )
}

export const getPersonsByCase = (caseId: string): Person[] => {
  const case_ = getCaseById(caseId)
  return case_?.persons || []
}

export const getTimelineEventsByCase = (caseId: string): TimelineEvent[] => {
  const case_ = getCaseById(caseId)
  return case_?.timeline_events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []
}

export const getDocumentsByCase = (caseId: string): Document[] => {
  const case_ = getCaseById(caseId)
  return case_?.documents || []
}

export const getCaseById = (caseId: string): Case | undefined => {
  return mockCases.find(case_ => case_.case_id === caseId)
}

export const getPersonById = (personId: string): Person | undefined => {
  // Search through all cases for the person
  for (const case_ of mockCases) {
    const person = case_.persons.find(p => p.person_id === personId)
    if (person) return person
  }
  return undefined
}

export const getCurrentUser = (): User => {
  return mockUsers[0] // Olivia Rodriguez as default user
}

// Additional helper functions for workflow management
export const updateCaseWorkflowStatus = (caseId: string, updates: Partial<CaseWorkflowStatus>): Case | undefined => {
  const case_ = getCaseById(caseId)
  if (case_) {
    case_.workflow_status = { ...case_.workflow_status, ...updates }
    case_.last_updated = new Date().toISOString()
  }
  return case_
}

export const assignCaseToWorker = (caseId: string, workerName: string, supervisorName: string): Case | undefined => {
  const case_ = getCaseById(caseId)
  if (case_) {
    case_.assigned_worker = workerName
    case_.assigned_supervisor = supervisorName
    case_.status = 'Active'
    case_.workflow_status.current_stage = 'active_case_management'
    case_.workflow_status.swcm_assigned = true
    case_.workflow_status.swcm_assigned_by = supervisorName
    case_.workflow_status.swcm_assigned_date = new Date().toISOString()
    case_.last_updated = new Date().toISOString()
  }
  return case_
}
