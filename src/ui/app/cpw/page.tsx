'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Case, getCasesByWorker, MagicButtonData, getDraftIncidents } from '@/lib/api'
import { getCurrentUser } from '@/lib/mockData'
import RequestSWCMAssignmentModal from '@/components/RequestSWCMAssignmentModal'
import TaskTable from '@/components/TaskTable'

export default function CPWPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>(['Draft Cases'])
  const [cases, setCases] = useState<Case[]>([])
  const [draftIncidents, setDraftIncidents] = useState<MagicButtonData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [selectedIncident, setSelectedIncident] = useState<MagicButtonData | null>(null)
  const [activeTask, setActiveTask] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch both case setup cases and draft incidents in parallel
      const [casesResponse, incidentsResponse] = await Promise.all([
        getCasesByWorker('unassigned'),
        getDraftIncidents()
      ])
      
      if (casesResponse.error) {
        setError(casesResponse.error)
      } else if (casesResponse.data) {
        setCases(casesResponse.data.cases)
      }
      
      if (incidentsResponse.error) {
        console.warn('Failed to load draft incidents:', incidentsResponse.error)
      } else if (incidentsResponse.data) {
        setDraftIncidents(incidentsResponse.data.incidents)
      }
    } catch (err) {
      setError('Failed to load data')
      console.error('Error loading cases and incidents:', err)
    }
    
    setLoading(false)
  }

  const getIndicatorIcon = (indicator: string) => {
    switch (indicator.toLowerCase()) {
      case 'allergy': return 'medical_services'
      case 'icwa eligible': return 'diversity_3'
      case 'runaway': return 'directions_run'
      case 'worker safety': return 'security'
      case 'protective order': return 'gavel'
      case 'icpc': return 'swap_horiz'
      case 'safe haven': return 'shield'
      case 'chronic medical condition': return 'local_hospital'
      default: return 'flag'
    }
  }

  const getIndicatorColor = (indicator: string) => {
    switch (indicator.toLowerCase()) {
      case 'allergy': return 'error'
      case 'icwa eligible': return 'tertiary'
      case 'runaway': return 'error'
      case 'worker safety': return 'error'
      case 'protective order': return 'secondary'
      case 'chronic medical condition': return 'secondary'
      default: return 'primary'
    }
  }

  const getChildrenNames = (case_: Case) => {
    if (!case_.persons) return null
    const children = case_.persons.filter(person => person.role === 'Client')
    if (children.length === 0) return null
    
    return children.map((child, index) => (
      <span key={child.person_id}>
        <Link href={`/persons/${child.person_id}`} className="child-link">
          {child.first_name} {child.last_name}
        </Link>
        {index < children.length - 1 && ', '}
      </span>
    ))
  }

  const getAllIndicators = (case_: Case) => {
    const indicators = new Set<string>()
    if (case_.persons) {
      case_.persons.forEach(person => {
        if (person.indicators) {
          person.indicators.forEach(indicator => indicators.add(indicator))
        }
      })
    }
    return Array.from(indicators)
  }

  const handleSetupCase = (case_: Case) => {
    setSelectedCase(case_)
    setIsSetupModalOpen(true)
  }

  const handleStartCaseSetup = (case_: Case) => {
    // TODO: Open comprehensive case setup modal/component
    // For now, navigate to case details page
    window.location.href = `/cases/${case_.case_id}`
  }

  const hasSavedProgress = (caseId: string) => {
    try {
      const saved = localStorage.getItem(`cpw_setup_${caseId}`)
      return saved !== null
    } catch (error) {
      return false
    }
  }

  const getSetupProgress = (caseId: string) => {
    try {
      const saved = localStorage.getItem(`cpw_setup_${caseId}`)
      if (!saved) return { step: 0, total: 4, percentage: 0 }
      
      const data = JSON.parse(saved)
      const currentStep = data.currentStep || 1
      const total = 4
      const percentage = Math.round((currentStep / total) * 100)
      
      return { step: currentStep, total, percentage }
    } catch (error) {
      return { step: 0, total: 4, percentage: 0 }
    }
  }

  const handleSetupSuccess = () => {
    setIsSetupModalOpen(false)
    setSelectedCase(null)
    loadCases() // Reload cases to reflect status changes
  }

  const handleCloseModal = () => {
    setIsSetupModalOpen(false)
    setSelectedCase(null)
    setSelectedIncident(null)
  }

  // Handle task card clicks - toggle between showing task view and default view
  const handleTaskCardClick = (taskType: string) => {
    if (activeTask === taskType) {
      // If clicking the same task, toggle it off
      setActiveTask(null)
    } else {
      // Set the new active task
      setActiveTask(taskType)
    }
  }

  // Get cases for the active task
  const getTaskCases = (taskType: string) => {
    switch (taskType) {
      case 'request-assignment':
        return cases.filter(c => c.status.toLowerCase() === 'draft')
      case 'edits-required':
        return cases.filter(c => c.status.toLowerCase() === 'edits required')
      case 'case-setup':
        return cases.filter(c => c.status.toLowerCase() === 'case setup')
      default:
        return []
    }
  }



  // Define available filter tags
  const filterTags = [
    { id: 'pending-assignment', label: 'Pending Assignment', status: ['Pending Assignment'], count: cases.filter(c => c.status === 'Pending Assignment').length },
    { id: 'pending-approval', label: 'Pending Approval', status: ['Pending Approval'], count: cases.filter(c => c.status === 'Pending Approval').length },
    { id: 'ready-swcm-assignment', label: 'Ready for SWCM Assignment', status: ['Draft'], count: cases.filter(c => c.status === 'Draft').length },
    { id: 'case-setup', label: 'Case Setup', status: ['Case Setup'], count: cases.filter(c => c.status === 'Case Setup').length },
    { id: 'active', label: 'Active', status: ['Active'], count: cases.filter(c => c.status === 'Active').length }
  ]

  // Toggle filter tag
  const toggleFilter = (tagId: string) => {
    const tag = filterTags.find(t => t.id === tagId)
    if (!tag) return

    setActiveFilters(prev => {
      const isActive = prev.includes(tag.label)
      if (isActive) {
        return prev.filter(f => f !== tag.label)
      } else {
        return [...prev, tag.label]
      }
    })
  }

  // Filter cases based on active filters
  const filteredCases = cases.filter(case_ => {
    if (activeFilters.length === 0) return true
    
    return filterTags.some(tag => 
      activeFilters.includes(tag.label) && tag.status.includes(case_.status)
    )
  })

  // Get action button for case based on status
  const getCaseActionButton = (case_: Case, taskType?: string) => {
    // Handle task-specific actions first
    if (taskType === 'request-assignment') {
      return (
        <button 
          onClick={() => handleSetupCase(case_)}
          className="action-btn small primary"
          title="Request SWCM Assignment"
        >
          <span className="icon">assignment_ind</span>
          Request Assignment
        </button>
      )
    }

    if (taskType === 'case-setup') {
      return (
        <button 
          onClick={() => handleStartCaseSetup(case_)}
          className="action-btn small primary"
          title={hasSavedProgress(case_.case_id) ? 'Resume case setup progress' : 'Start comprehensive case setup'}
        >
          <span className="icon">{hasSavedProgress(case_.case_id) ? 'play_arrow' : 'settings'}</span>
          {hasSavedProgress(case_.case_id) ? 'Resume Setup' : 'Start Setup'}
        </button>
      )
    }

    if (taskType === 'edits-required') {
      return (
        <button 
          onClick={() => console.log('Handle edits required for case:', case_.case_id)}
          className="action-btn small error"
          title="Address required edits"
        >
          <span className="icon">edit</span>
          Address Edits
        </button>
      )
    }

    // Fall back to status-based actions
    switch (case_.status) {
      case 'Draft':
        return (
          <button 
            onClick={() => handleSetupCase(case_)}
            className="action-btn small primary"
            title="Request SWCM Assignment"
          >
            <span className="icon">assignment_ind</span>
            Request Assignment
          </button>
        )
      case 'Pending Assignment':
        return (
          <button 
            className="action-btn small secondary"
            disabled
            title="Waiting for SWCM assignment"
          >
            <span className="icon">hourglass_empty</span>
            Pending
          </button>
        )
      case 'Case Setup':
        return (
          <button 
            onClick={() => handleStartCaseSetup(case_)}
            className="action-btn small primary"
            title={hasSavedProgress(case_.case_id) ? 'Resume case setup progress' : 'Start comprehensive case setup'}
          >
            <span className="icon">{hasSavedProgress(case_.case_id) ? 'play_arrow' : 'settings'}</span>
            {hasSavedProgress(case_.case_id) ? 'Resume Setup' : 'Start Setup'}
          </button>
        )
      case 'Pending Approval':
        return (
          <button 
            className="action-btn small secondary"
            disabled
            title="Case setup complete, awaiting supervisor approval"
          >
            <span className="icon">pending</span>
            Awaiting Approval
          </button>
        )
      case 'Active':
      case 'Closed':
        return (
          <Link href={`/cases/${case_.case_id}`} className="action-btn small primary">
            <span className="icon">visibility</span>
            View
          </Link>
        )
      default:
        return (
          <button className="action-btn small secondary" disabled>
            <span className="icon">help</span>
            Unknown Status
          </button>
        )
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">CPW Dashboard</h1>
          <p className="page-description">Loading cases...</p>
        </div>
      </div>
    )
  }

  // Helper function to convert MagicButtonData to Case format for display
  const convertIncidentToCase = (incident: MagicButtonData): Case => {
    const childName = `${incident.child_first_names} ${incident.child_last_names}`.trim()
    const caseName = childName || 'Unnamed Case'
    
    return {
      case_id: incident.incident_number,
      case_number: incident.incident_number,
      case_display_name: caseName,
      status: 'Draft',
      priority_level: 'Medium',
      primary_child: childName,
      family_name: caseName,
      allegation_type: incident.allegations || 'Unknown',
      allegation_description: incident.allegations || '',
      county: incident.residence_county || incident.county_of_assessment || '',
      created_date: incident.intake_date || new Date().toISOString(),
      last_updated: incident.intake_date || new Date().toISOString(),
      created_by: incident.cps_worker || 'Dana Scully',
      assigned_worker: undefined,
      assigned_supervisor: undefined,
      workflow_status: {
        current_stage: 'request_assignment',
        cpw_reviewed: false,
        cpw_supervisor_approved: false,
        swcm_assigned: false
      },
      persons: [
        {
          person_id: incident.person_id || `${incident.incident_number}-child`,
          first_name: incident.child_first_names || '',
          last_name: incident.child_last_names || '',
          date_of_birth: incident.date_of_birth || '',
          role: 'Client',
          contact_info: {
            phone: incident.phone_number || '',
            address: incident.current_address || incident.address || ''
          },
          indicators: [],
          relationship_to_primary_child: 'Self'
        }
      ]
    }
  }

  // Create unified task list sorted by due date
  const createTaskList = () => {
    const tasks: Array<{
      id: string
      type: 'request-assignment' | 'case-setup' | 'edits-required'
      case: Case
      incident?: MagicButtonData
      dueDate: Date
    }> = []

    // Add existing case setup tasks
    cases.forEach(case_ => {
      let taskType: 'request-assignment' | 'case-setup' | 'edits-required'
      let dueDate: Date

      switch (case_.status.toLowerCase()) {
        case 'draft':
          taskType = 'request-assignment'
          // Mock due date: 3 days from intake
          dueDate = new Date(case_.created_date)
          dueDate.setDate(dueDate.getDate() + 3)
          break
        case 'case setup':
          taskType = 'case-setup'
          // Mock due date: 7 days from status change
          dueDate = new Date(case_.created_date)
          dueDate.setDate(dueDate.getDate() + 10)
          break
        case 'edits required':
          taskType = 'edits-required'
          // Mock due date: 2 days from status change (urgent)
          dueDate = new Date(case_.created_date)
          dueDate.setDate(dueDate.getDate() + 12)
          break
        default:
          return // Skip cases that don't need tasks
      }

      tasks.push({
        id: `${case_.case_id}-${taskType}`,
        type: taskType,
        case: case_,
        dueDate
      })
    })

    // Add magic button incidents as request-assignment tasks
    draftIncidents.forEach(incident => {
      const dueDate = new Date(incident.due_date || incident.intake_date || new Date())
      const convertedCase = convertIncidentToCase(incident)
      
      tasks.push({
        id: `${incident.incident_number}-request-assignment`,
        type: 'request-assignment',
        case: convertedCase,
        incident: incident,
        dueDate
      })
    })

    // Sort by due date (earliest first)
    return tasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
  }

  const taskList = createTaskList()

  // Filter task list based on search query
  const filteredTaskList = taskList.filter(task => {
    if (!searchQuery) return true
    
    const searchLower = searchQuery.toLowerCase()
    const caseName = (task.case.case_display_name || task.case.family_name || '').toLowerCase()
    const caseNumber = (task.case.case_number || '').toLowerCase()
    const status = (task.case.status || '').toLowerCase()
    
    return caseName.includes(searchLower) || 
           caseNumber.includes(searchLower) || 
           status.includes(searchLower)
  })

  const getTaskName = (type: string) => {
    switch (type) {
      case 'request-assignment': return 'Request SWCM Assignment'
      case 'case-setup': return 'Complete Case Setup'
      case 'edits-required': return 'Address Required Edits'
      default: return 'Unknown Task'
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'request-assignment': return 'assignment_ind'
      case 'case-setup': return 'settings'
      case 'edits-required': return 'edit'
      default: return 'task'
    }
  }

  const handleTaskAction = (task: any) => {
    switch (task.type) {
      case 'request-assignment':
        // If this is a magic button incident, set both case and incident data
        if (task.incident) {
          setSelectedIncident(task.incident)
        }
        handleSetupCase(task.case)
        break
      case 'case-setup':
        handleStartCaseSetup(task.case)
        break
      case 'edits-required':
        console.log('Handle edits required for case:', task.case.case_id)
        break
    }
  }

  const isOverdue = (dueDate: Date) => {
    return dueDate < new Date()
  }

  const formatDueDate = (dueDate: Date) => {
    const today = new Date()
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    
    if (daysDiff < 0) return `${Math.abs(daysDiff)} days overdue`
    if (daysDiff === 0) return 'Due today'
    if (daysDiff === 1) return 'Due tomorrow'
    return `Due in ${daysDiff} days`
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Tasks</h1>
        <p className="page-description">Complete your assigned tasks in order of priority</p>
      </div>

      <div className="content-wrapper">
        {error && (
          <div className="error-message">
            <span className="icon">error</span>
            {error}
          </div>
        )}

        {taskList.length > 0 ? (
          <div className="task-table-container">
            <div className="task-table-header">
              <div className="search-bar">
                <span className="search-icon icon">search</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search for a case or status"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                  >
                    <span className="icon">close</span>
                  </button>
                )}
              </div>
              <div className="task-table-actions">
                <span className="task-table-count">{filteredTaskList.length} of {taskList.length} tasks</span>
                <button className="action-btn secondary" onClick={loadCases}>
                  <span className="icon">refresh</span>
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="table-container">
              <table className="data-table task-table">
                <thead>
                  <tr>
                    <th>Case Name / ID</th>
                    <th>Incident Number</th>
                    <th>Due Date</th>
                    <th>Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTaskList.map((task) => (
                    <tr 
                      key={task.id} 
                      className={isOverdue(task.dueDate) ? 'urgent' : ''}
                    >
                      <td>
                        <div className="case-name-cell">
                          <Link href={`/cases/${task.case.case_id}`} className="case-link">
                            <strong>{task.case.case_display_name || task.case.family_name}</strong>
                          </Link>
                          <div className="case-id-subtitle">Case ID: {task.case.case_id}</div>
                        </div>
                      </td>
                      <td>
                        <div className="incident-number">
                          {task.incident ? task.incident.incident_number : task.case.case_number}
                        </div>
                      </td>
                      <td>
                        <div className={`due-date-cell ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                          <div className="due-date">{task.dueDate.toLocaleDateString()}</div>
                          <div className="due-status">{formatDueDate(task.dueDate)}</div>
                        </div>
                      </td>
                      <td>
                        <div className="progress-cell">
                          {task.type === 'case-setup' && (() => {
                            const progress = getSetupProgress(task.case.case_id)
                            return (
                              <div className="setup-progress-indicator">
                                <div className="progress-bar-small">
                                  <div 
                                    className="progress-fill-small" 
                                    style={{ width: `${progress.percentage}%` }}
                                  ></div>
                                </div>
                                <div className="progress-text-small">
                                  {progress.step > 0 ? `Step ${progress.step}/${progress.total}` : 'Not Started'}
                                </div>
                              </div>
                            )
                          })()}
                          {task.type !== 'case-setup' && (
                            <span className="progress-na">—</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {getCaseActionButton(task.case, task.type)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <span className="icon large">check_circle</span>
            <h3>All Tasks Complete!</h3>
            <p>You have no pending tasks at this time.</p>
            <button className="action-btn primary" onClick={loadCases}>
              <span className="icon">refresh</span>
              Check for New Tasks
            </button>
          </div>
        )}
      </div>

      {/* Request SWCM Assignment Modal */}
      <RequestSWCMAssignmentModal
        isOpen={isSetupModalOpen}
        onClose={handleCloseModal}
        case_={selectedCase}
        incident={selectedIncident}
        onSuccess={handleSetupSuccess}
      />

    </div>
  )
}
