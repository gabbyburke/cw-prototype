'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Case, getCasesByWorker } from '../../lib/api'
import { getCurrentUser } from '../../lib/mockData'
import RequestSWCMAssignmentModal from '../../components/RequestSWCMAssignmentModal'
import TaskTable from '../../components/TaskTable'

export default function CPWPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>(['Draft Cases'])
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [activeTask, setActiveTask] = useState<string | null>(null)

  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = async () => {
    setLoading(true)
    setError(null)
    
    // For demo: show unassigned cases since no workers are assigned yet in the workflow
    const response = await getCasesByWorker('unassigned')
    
    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      setCases(response.data.cases)
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

  // Handle task table action clicks
  const handleTaskAction = (case_: Case) => {
    if (activeTask === 'request-assignment') {
      handleSetupCase(case_)
    } else if (activeTask === 'edits-required') {
      // TODO: Handle edits required action
      console.log('Handle edits required for case:', case_.case_id)
    } else if (activeTask === 'case-setup') {
      handleStartCaseSetup(case_)
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
  const getCaseActionButton = (case_: Case) => {
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

  return (
    <div className="page-container">
      <div className="page-header modern-header">
        <h1 className="greeting-title">Hi Dana! What can I help you with today?</h1>
        <div className="search-container">
          <div className="search-bar">
            <span className="search-icon icon">search</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Ask me anything about your cases, or search for specific information..."
            />
            <button className="search-submit">
              <span className="icon">send</span>
            </button>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        {/* My Tasks Section */}
        <div className="my-tasks-section">
          <h2 className="section-title">My Tasks</h2>
          <div className="task-cards-grid">
            <div 
              className={`task-card primary ${activeTask === 'request-assignment' ? 'active' : ''}`} 
              onClick={() => handleTaskCardClick('request-assignment')}
            >
              <div className="task-card-icon">
                <span className="icon">assignment_ind</span>
              </div>
              <div className="task-card-content">
                <h3>Ready to Request SWCM Assignment</h3>
                <p className="task-count">{cases.filter(c => c.status.toLowerCase() === 'draft').length} cases</p>
                <p className="task-description">New cases ready for assignment request</p>
              </div>
              <div className="task-card-action">
                <span className="icon">arrow_forward</span>
              </div>
            </div>

            <div 
              className={`task-card secondary ${activeTask === 'case-setup' ? 'active' : ''}`} 
              onClick={() => handleTaskCardClick('case-setup')}
            >
              <div className="task-card-icon">
                <span className="icon">settings</span>
              </div>
              <div className="task-card-content">
                <h3>Ready for Setup</h3>
                <p className="task-count">{cases.filter(c => c.status.toLowerCase() === 'case setup').length} cases</p>
                <p className="task-description">Cases assigned and ready for setup</p>
              </div>
              <div className="task-card-action">
                <span className="icon">arrow_forward</span>
              </div>
            </div>

            <div 
              className={`task-card error ${activeTask === 'edits-required' ? 'active' : ''}`} 
              onClick={() => handleTaskCardClick('edits-required')}
            >
              <div className="task-card-icon">
                <span className="icon">edit</span>
              </div>
              <div className="task-card-content">
                <h3>Edits Required</h3>
                <p className="task-count">{cases.filter(c => c.status.toLowerCase() === 'edits required').length} cases</p>
                <p className="task-description">Cases returned by supervisor for changes</p>
              </div>
              <div className="task-card-action">
                <span className="icon">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Table or Filter Section */}
        {activeTask ? (
          <TaskTable
            taskType={activeTask}
            cases={getTaskCases(activeTask)}
            onActionClick={handleTaskAction}
          />
        ) : (
          <div className="filter-container">
            <div className="filter-header">
              <h3 className="section-subtitle">My Cases</h3>
              <div className="filter-actions">
                <button 
                  className="action-btn secondary"
                  onClick={() => setActiveFilters([])}
                  disabled={activeFilters.length === 0}
                >
                  <span className="icon">clear_all</span>
                  Clear Filters
                </button>
                <button className="action-btn primary" onClick={loadCases}>
                  <span className="icon">refresh</span>
                  Refresh
                </button>
              </div>
            </div>
            <div className="filter-tags">
              {filterTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleFilter(tag.id)}
                  className={`filter-tag ${activeFilters.includes(tag.label) ? 'active' : ''}`}
                  disabled={tag.count === 0}
                >
                  <span className="tag-label">{tag.label}</span>
                  <span className="tag-count">({tag.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Cases Table - only show when no task is active */}
        {!activeTask && (
        <div className="content-area">
          <div className="card">
            <div className="card-header">
              <h2>
                {activeFilters.length === 0 
                  ? 'My Cases' 
                  : activeFilters.length === 1 
                    ? activeFilters[0] 
                    : `${activeFilters.length} Filters Active`
                }
                {activeFilters.length > 1 && (
                  <span className="filter-summary"> ({activeFilters.join(', ')})</span>
                )}
              </h2>
              <div className="card-actions">
                <span className="case-count">{filteredCases.length} cases</span>
              </div>
            </div>
            <div className="card-content">
              {error && (
                <div className="error-message">
                  <span className="icon">error</span>
                  {error}
                </div>
              )}
              {filteredCases.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Case Name</th>
                        <th>Status</th>
                        <th>Intake Date</th>
                        <th>Key Allegations</th>
                        <th>Children Involved</th>
                        <th>Indicators</th>
                        <th>Progress</th>
                        <th>Assigned Workers</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCases.map((case_) => (
                        <tr key={case_.case_id}>
                          <td>
                            <div className="case-name-cell">
                              <Link href={`/cases/${case_.case_id}`} className="case-link">
                                <strong>{case_.case_display_name || case_.family_name}</strong>
                              </Link>
                              <div className="case-number">{case_.case_number}</div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${case_.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {case_.status}
                            </span>
                          </td>
                          <td>{new Date(case_.created_date).toLocaleDateString()}</td>
                          <td>
                            <div className="allegation-cell">
                              <span className="allegation-type">{case_.allegation_type}</span>
                              <div className="allegation-desc">{case_.allegation_description}</div>
                            </div>
                          </td>
                          <td>
                            <div className="children-list">
                              {getChildrenNames(case_) || 'No children listed'}
                            </div>
                          </td>
                          <td>
                            <div className="indicators-cell">
                              {getAllIndicators(case_).slice(0, 3).map((indicator, index) => (
                                <span 
                                  key={index}
                                  className={`indicator-badge ${getIndicatorColor(indicator)}`}
                                  title={indicator}
                                >
                                  <span className="icon">{getIndicatorIcon(indicator)}</span>
                                  {indicator}
                                </span>
                              ))}
                              {getAllIndicators(case_).length > 3 && (
                                <span className="indicator-more">
                                  +{getAllIndicators(case_).length - 3} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="progress-cell">
                              {case_.status === 'Case Setup' && (() => {
                                const progress = getSetupProgress(case_.case_id)
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
                              {case_.status !== 'Case Setup' && (
                                <span className="progress-na">—</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="workers-cell">
                              <div className="primary-worker">
                                <strong>Primary:</strong> {case_.assigned_worker || 'Unassigned'}
                              </div>
                              {case_.assigned_supervisor && (
                                <div className="supervisor">
                                  <strong>Supervisor:</strong> {case_.assigned_supervisor}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {getCaseActionButton(case_)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <span className="icon large">filter_list</span>
                  <h3>No Cases Match Current Filters</h3>
                  <p>
                    {activeFilters.length === 0 
                      ? 'No cases found in the system'
                      : `Try adjusting your filters or clearing them to see more cases`
                    }
                  </p>
                  {activeFilters.length > 0 && (
                    <button 
                      className="action-btn primary"
                      onClick={() => setActiveFilters([])}
                    >
                      <span className="icon">clear_all</span>
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Request SWCM Assignment Modal */}
      <RequestSWCMAssignmentModal
        isOpen={isSetupModalOpen}
        onClose={handleCloseModal}
        case_={selectedCase}
        onSuccess={handleSetupSuccess}
      />

    </div>
  )
}
