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
export const healthCheck = () => apiClient.healthCheck()
