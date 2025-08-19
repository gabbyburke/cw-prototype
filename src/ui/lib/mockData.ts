export interface Person {
  person_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  role: 'child' | 'parent' | 'caregiver' | 'relative' | 'professional'
  case_id: string
  contact_info: {
    phone?: string
    email?: string
    address?: string
  }
  indicators?: string[]
}

export interface TimelineEvent {
  event_id: string
  case_id: string
  event_type: 'case_note' | 'visit' | 'court_hearing' | 'placement_change' | 'assessment' | 'document_upload' | 'assignment_change'
  title: string
  description: string
  date: string
  created_by: string
  priority?: 'low' | 'medium' | 'high'
}

export interface Case {
  case_id: string
  case_number: string
  status: 'Draft' | 'Pending Assignment' | 'Active' | 'Closed'
  priority_level: 'Low' | 'Medium' | 'High'
  assigned_worker?: string
  assigned_supervisor?: string
  primary_child: string
  allegation_type: string
  allegation_description: string
  created_date: string
  last_updated: string
  created_by: string
  referral_id?: string
  case_notes: Array<{
    note_id: string
    text: string
    created_by: string
    created_date: string
  }>
  involved_persons: string[]
  next_court_date?: string
  safety_assessment_due?: string
  case_plan_due?: string
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

// Mock Persons
export const mockPersons: Person[] = [
  // Case 1 - Johnson Family
  {
    person_id: 'person_1',
    first_name: 'Emma',
    last_name: 'Johnson',
    date_of_birth: '2017-03-15',
    role: 'child',
    case_id: 'case_1',
    contact_info: {
      address: '123 Maple Street, Des Moines, IA 50309'
    },
    indicators: ['Medical Needs', 'School Issues']
  },
  {
    person_id: 'person_2',
    first_name: 'Robert',
    last_name: 'Johnson',
    date_of_birth: '1985-07-22',
    role: 'parent',
    case_id: 'case_1',
    contact_info: {
      phone: '(515) 555-0123',
      address: '123 Maple Street, Des Moines, IA 50309'
    }
  },
  {
    person_id: 'person_3',
    first_name: 'Lisa',
    last_name: 'Johnson',
    date_of_birth: '1987-11-08',
    role: 'parent',
    case_id: 'case_1',
    contact_info: {
      phone: '(515) 555-0124',
      address: '123 Maple Street, Des Moines, IA 50309'
    }
  },
  // Case 2 - Martinez Family
  {
    person_id: 'person_4',
    first_name: 'Carlos',
    last_name: 'Martinez',
    date_of_birth: '2019-05-10',
    role: 'child',
    case_id: 'case_2',
    contact_info: {
      address: '456 Oak Avenue, Cedar Rapids, IA 52402'
    },
    indicators: ['Allergy - Peanuts']
  },
  {
    person_id: 'person_5',
    first_name: 'Maria',
    last_name: 'Martinez',
    date_of_birth: '1992-02-14',
    role: 'parent',
    case_id: 'case_2',
    contact_info: {
      phone: '(319) 555-0234',
      address: '456 Oak Avenue, Cedar Rapids, IA 52402'
    }
  },
  // Case 3 - Wilson Family
  {
    person_id: 'person_6',
    first_name: 'Tyler',
    last_name: 'Wilson',
    date_of_birth: '2015-09-03',
    role: 'child',
    case_id: 'case_3',
    contact_info: {
      address: '789 Pine Road, Iowa City, IA 52240'
    }
  },
  {
    person_id: 'person_7',
    first_name: 'Jennifer',
    last_name: 'Wilson',
    date_of_birth: '1988-12-20',
    role: 'parent',
    case_id: 'case_3',
    contact_info: {
      phone: '(319) 555-0345',
      address: '789 Pine Road, Iowa City, IA 52240'
    },
    indicators: ['Substance Abuse History']
  },
  // Case 4 - Thompson Family
  {
    person_id: 'person_8',
    first_name: 'Sarah',
    last_name: 'Thompson',
    date_of_birth: '2012-01-18',
    role: 'child',
    case_id: 'case_4',
    contact_info: {
      address: '321 Elm Street, Waterloo, IA 50701'
    }
  },
  {
    person_id: 'person_9',
    first_name: 'Mark',
    last_name: 'Thompson',
    date_of_birth: '1980-06-12',
    role: 'parent',
    case_id: 'case_4',
    contact_info: {
      phone: '(319) 555-0456',
      address: '321 Elm Street, Waterloo, IA 50701'
    }
  },
  // Case 5 - Davis Family (Pending Assignment)
  {
    person_id: 'person_10',
    first_name: 'Ashley',
    last_name: 'Davis',
    date_of_birth: '2016-08-25',
    role: 'child',
    case_id: 'case_5',
    contact_info: {
      address: '654 Birch Lane, Ames, IA 50010'
    },
    indicators: ['ICWA Eligible']
  },
  {
    person_id: 'person_11',
    first_name: 'Jessica',
    last_name: 'Davis',
    date_of_birth: '1995-04-03',
    role: 'parent',
    case_id: 'case_5',
    contact_info: {
      phone: '(515) 555-0567',
      address: '654 Birch Lane, Ames, IA 50010'
    }
  }
]

// Mock Cases
export const mockCases: Case[] = [
  {
    case_id: 'case_1',
    case_number: 'CASE-20240115103000',
    status: 'Active',
    priority_level: 'High',
    assigned_worker: 'Olivia Rodriguez',
    assigned_supervisor: 'Sarah Williams',
    primary_child: 'Emma Johnson',
    allegation_type: 'Physical Abuse',
    allegation_description: 'School nurse reported bruising on child\'s arms consistent with physical abuse',
    created_date: '2024-01-15T10:30:00Z',
    last_updated: '2024-01-18T14:20:00Z',
    created_by: 'System',
    referral_id: 'ref_001',
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
    involved_persons: ['person_1', 'person_2', 'person_3'],
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
    primary_child: 'Carlos Martinez',
    allegation_type: 'Neglect',
    allegation_description: 'Neighbor reported child left unattended for extended periods',
    created_date: '2024-01-10T14:30:00Z',
    last_updated: '2024-01-17T16:45:00Z',
    created_by: 'System',
    referral_id: 'ref_002',
    case_notes: [
      {
        note_id: 'note_3',
        text: 'Mother appears overwhelmed but willing to accept services. Discussed parenting resources.',
        created_by: 'Olivia Rodriguez',
        created_date: '2024-01-12T10:00:00Z'
      }
    ],
    involved_persons: ['person_4', 'person_5'],
    case_plan_due: '2024-01-24T17:00:00Z'
  },
  {
    case_id: 'case_3',
    case_number: 'CASE-20240105091500',
    status: 'Active',
    priority_level: 'Medium',
    assigned_worker: 'Michael Chen',
    assigned_supervisor: 'Sarah Williams',
    primary_child: 'Tyler Wilson',
    allegation_type: 'Substance Abuse - Parent',
    allegation_description: 'Anonymous report of parent using drugs while caring for child',
    created_date: '2024-01-05T09:15:00Z',
    last_updated: '2024-01-16T12:30:00Z',
    created_by: 'System',
    referral_id: 'ref_003',
    case_notes: [
      {
        note_id: 'note_4',
        text: 'Parent agreed to voluntary drug testing. Results pending.',
        created_by: 'Michael Chen',
        created_date: '2024-01-08T14:20:00Z'
      }
    ],
    involved_persons: ['person_6', 'person_7'],
    next_court_date: '2024-01-22T10:00:00Z'
  },
  {
    case_id: 'case_4',
    case_number: 'CASE-20240108112000',
    status: 'Closed',
    priority_level: 'Low',
    assigned_worker: 'David Thompson',
    assigned_supervisor: 'Sarah Williams',
    primary_child: 'Sarah Thompson',
    allegation_type: 'Educational Neglect',
    allegation_description: 'School counselor reported chronic absenteeism and lack of parental engagement',
    created_date: '2024-01-08T11:20:00Z',
    last_updated: '2024-01-15T09:00:00Z',
    created_by: 'System',
    referral_id: 'ref_004',
    case_notes: [
      {
        note_id: 'note_5',
        text: 'Case closed - services no longer needed. Family successfully engaged with school support services.',
        created_by: 'David Thompson',
        created_date: '2024-01-15T09:00:00Z'
      }
    ],
    involved_persons: ['person_8', 'person_9']
  },
  {
    case_id: 'case_5',
    case_number: 'CASE-20240118090000',
    status: 'Pending Assignment',
    priority_level: 'High',
    assigned_supervisor: 'Sarah Williams',
    primary_child: 'Ashley Davis',
    allegation_type: 'Sexual Abuse',
    allegation_description: 'Child disclosed inappropriate touching by mother\'s boyfriend',
    created_date: '2024-01-18T09:00:00Z',
    last_updated: '2024-01-18T09:00:00Z',
    created_by: 'System',
    referral_id: 'ref_005',
    case_notes: [],
    involved_persons: ['person_10', 'person_11'],
    safety_assessment_due: '2024-01-19T09:00:00Z'
  },
  {
    case_id: 'case_6',
    case_number: 'CASE-20240118140000',
    status: 'Pending Assignment',
    priority_level: 'Medium',
    assigned_supervisor: 'Sarah Williams',
    primary_child: 'Michael Brown',
    allegation_type: 'Neglect',
    allegation_description: 'Medical neglect - child missed multiple medical appointments',
    created_date: '2024-01-18T14:00:00Z',
    last_updated: '2024-01-18T14:00:00Z',
    created_by: 'System',
    referral_id: 'ref_006',
    case_notes: [],
    involved_persons: [],
    safety_assessment_due: '2024-01-21T14:00:00Z'
  }
]

// Mock Timeline Events
export const mockTimelineEvents: TimelineEvent[] = [
  {
    event_id: 'event_1',
    case_id: 'case_1',
    event_type: 'case_note',
    title: 'Initial Home Visit',
    description: 'Completed initial safety assessment and interviewed family members',
    date: '2024-01-16T09:15:00Z',
    created_by: 'Olivia Rodriguez',
    priority: 'high'
  },
  {
    event_id: 'event_2',
    case_id: 'case_1',
    event_type: 'document_upload',
    title: 'Medical Records Uploaded',
    description: 'Hospital records from emergency room visit uploaded to case file',
    date: '2024-01-16T15:30:00Z',
    created_by: 'Olivia Rodriguez'
  },
  {
    event_id: 'event_3',
    case_id: 'case_1',
    event_type: 'court_hearing',
    title: 'Emergency Custody Hearing',
    description: 'Court granted temporary custody to state pending investigation',
    date: '2024-01-17T10:00:00Z',
    created_by: 'Court System',
    priority: 'high'
  },
  {
    event_id: 'event_4',
    case_id: 'case_2',
    event_type: 'visit',
    title: 'Unannounced Home Visit',
    description: 'Conducted welfare check - child present and appears healthy',
    date: '2024-01-12T14:20:00Z',
    created_by: 'Olivia Rodriguez'
  },
  {
    event_id: 'event_5',
    case_id: 'case_2',
    event_type: 'assessment',
    title: 'Safety Assessment Completed',
    description: 'Comprehensive safety assessment indicates moderate risk level',
    date: '2024-01-13T11:00:00Z',
    created_by: 'Olivia Rodriguez',
    priority: 'medium'
  }
]

// Helper functions
export const getCasesByWorker = (workerName: string): Case[] => {
  return mockCases.filter(case_ => case_.assigned_worker === workerName)
}

export const getCasesBySupervisor = (supervisorName: string): Case[] => {
  return mockCases.filter(case_ => case_.assigned_supervisor === supervisorName)
}

export const getPendingAssignmentCases = (): Case[] => {
  return mockCases.filter(case_ => case_.status === 'Pending Assignment')
}

export const getPersonsByCase = (caseId: string): Person[] => {
  return mockPersons.filter(person => person.case_id === caseId)
}

export const getTimelineEventsByCase = (caseId: string): TimelineEvent[] => {
  return mockTimelineEvents.filter(event => event.case_id === caseId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const getCaseById = (caseId: string): Case | undefined => {
  return mockCases.find(case_ => case_.case_id === caseId)
}

export const getPersonById = (personId: string): Person | undefined => {
  return mockPersons.find(person => person.person_id === personId)
}

export const getCurrentUser = (): User => {
  return mockUsers[0] // Olivia Rodriguez as default user
}
