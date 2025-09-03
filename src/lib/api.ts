/**
 * API client for the Child Welfare Case Management System
 */

// Use the direct Cloud Run service for local development
const API_BASE_URL = 'https://ccwis-core-case-mgmt-807576987550.us-central1.run.app'

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface Case {
  case_id: string
  case_number: string
  case_display_name: string
  status: string
  priority_level: string
  primary_child: string
  family_name: string
  allegation_type: string
  allegation_description: string
  county: string
  created_date: string
  last_updated: string
  created_by: string
  assigned_worker?: string
  assigned_supervisor?: string
  workflow_status: {
    current_stage: string
    cpw_reviewed: boolean
    cpw_supervisor_approved: boolean
    swcm_assigned: boolean
  }
  risk_level?: string
  safety_factors?: string[]
  safety_assessment_due?: string
  assessment_notes?: string
  persons?: Person[]
  timeline_events?: TimelineEvent[]
  case_notes?: CaseNote[]
  documents?: Document[]
  address?: {
    street_address?: string
    city?: string
    state?: string
    zipcode?: number
  }
}

export interface Person {
  person_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  role: string
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
  event_type: string
  title: string
  description: string
  date: string
  created_by: string
  priority?: string
}

export interface CaseNote {
  note_id: string
  text: string
  created_by: string
  created_date: string
  note_type?: string
  genai_summary?: string
}

export interface Document {
  document_id: string
  title: string
  type: string
  uploaded_date: string
  uploaded_by: string
  file_size?: string
  description?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  // SWCM Supervisor endpoints
  async getCasesPendingAssignment(): Promise<ApiResponse<{ cases: Case[] }>> {
    return this.request<{ cases: Case[] }>('/swcm/cases/pending-assignment')
  }

  async assignCaseToSWCM(
    caseId: string,
    assignedWorker: string,
    assignedSupervisor?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/swcm/cases/${caseId}/assign`, {
      method: 'POST',
      body: JSON.stringify({
        assigned_worker: assignedWorker,
        assigned_supervisor: assignedSupervisor,
      }),
    })
  }

  // SWCM Worker endpoints
  async getCasesByWorker(workerName: string): Promise<ApiResponse<{ cases: Case[] }>> {
    return this.request<{ cases: Case[] }>(`/cases?assigned_worker=${encodeURIComponent(workerName)}`)
  }

  async getCaseById(caseId: string): Promise<ApiResponse<Case>> {
    return this.request<Case>(`/cases/${caseId}`)
  }

  async getPersonsByCase(caseId: string): Promise<ApiResponse<{ persons: Person[] }>> {
    return this.request<{ persons: Person[] }>(`/cases/${caseId}/persons`)
  }

  async getCaseNotes(caseId: string): Promise<ApiResponse<{ notes: CaseNote[] }>> {
    return this.request<{ notes: CaseNote[] }>(`/cases/${caseId}/notes`)
  }

  async addCaseNote(
    caseId: string,
    noteText: string,
    noteType?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/cases/${caseId}/notes`, {
      method: 'POST',
      body: JSON.stringify({
        note_text: noteText,
        note_type: noteType || 'General',
      }),
    })
  }

  async updateCase(
    caseId: string,
    updates: Partial<Case>
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/cases/${caseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  // Person search
  async searchPersons(query: string): Promise<ApiResponse<{ persons: Person[] }>> {
    return this.request<{ persons: Person[] }>(`/persons/search?q=${encodeURIComponent(query)}`)
  }

  // Get person by ID
  async getPersonById(personId: string): Promise<ApiResponse<Person>> {
    return this.request<Person>(`/persons/${personId}`)
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; service: string }>> {
    return this.request<{ status: string; service: string }>('/health')
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export individual functions for convenience
export const getCasesPendingAssignment = () => apiClient.getCasesPendingAssignment()
export const assignCaseToSWCM = (caseId: string, assignedWorker: string, assignedSupervisor?: string) => 
  apiClient.assignCaseToSWCM(caseId, assignedWorker, assignedSupervisor)
export const getCasesByWorker = (workerName: string) => apiClient.getCasesByWorker(workerName)
export const getCaseById = (caseId: string) => apiClient.getCaseById(caseId)
export const getPersonsByCase = (caseId: string) => apiClient.getPersonsByCase(caseId)
export const getCaseNotes = (caseId: string) => apiClient.getCaseNotes(caseId)
export const addCaseNote = (caseId: string, noteText: string, noteType?: string) => 
  apiClient.addCaseNote(caseId, noteText, noteType)
export const updateCase = (caseId: string, updates: Partial<Case>) => 
  apiClient.updateCase(caseId, updates)
export const searchPersons = (query: string) => apiClient.searchPersons(query)
export const getPersonById = (personId: string) => apiClient.getPersonById(personId)
export const healthCheck = () => apiClient.healthCheck()

// Magic Button data interface based on BigQuery schema
export interface MagicButtonData {
  incident_number: string
  child_first_names: string
  child_last_names: string
  parent_first_names: string
  parent_last_names: string
  cps_worker: string
  due_date: string
  county_of_assessment: string
  intake_date: string
  reported_native_american_heritage: string
  perpetrators: string
  perpetrator_first_name: string
  perpetrator_last_name: string
  findings: string
  allegations: string
  victims: string
  victim_first_name: string
  victim_last_name: string
  person_id: string
  role: string
  gender: string
  age_calculated: number
  prior_workers: string
  current_address: string
  address_type: string
  residence_county: string
  date_of_birth: string
  phone_number: string
  phone_type: string
  address: string
  city: string
  state: string
  zip_code: number
  non_custodial_parent: boolean
  non_custodial_parent_person_id: string
  non_custodial_parent_first_name: string
  non_custodial_parent_last_name: string
  non_custodial_parent_middle_name: string
  non_custodial_parent_dob: string
  non_custodial_parent_ssn: string
  non_custodial_parent_suffix: string
  non_custodial_parent_sex: string
  non_custodial_parent_race: string
  non_custodial_parent_ethnicity: string
  legal_custodian: string
  guardian: string
  prior_assessment: string
  type_of_appointment: string
  clinic_name: string
  appointment_date: string
}

// Search Magic Button data by incident number (mock implementation for now)
export const searchMagicButtonData = async (query: string): Promise<ApiResponse<{ incidents: MagicButtonData[] }>> => {
  // Mock implementation - replace with real API call when backend is ready
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // Mock data for development
  const mockIncidents: MagicButtonData[] = [
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
  ]
  
  if (!query || query.length < 2) {
    return { data: { incidents: [] }, error: undefined }
  }
  
  const filteredIncidents = mockIncidents.filter(incident => 
    incident.incident_number.toLowerCase().includes(query.toLowerCase()) ||
    incident.child_first_names.toLowerCase().includes(query.toLowerCase()) ||
    incident.child_last_names.toLowerCase().includes(query.toLowerCase()) ||
    incident.allegations.toLowerCase().includes(query.toLowerCase())
  )
  
  return { data: { incidents: filteredIncidents }, error: undefined }
}
