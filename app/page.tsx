'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Case, getCasesByWorker, updateCase } from '../lib/api'
import { getCurrentUser } from '../lib/mockData'
import AddCaseNoteModal from '../components/AddCaseNoteModal'

export default function SWCMDashboard() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'active' | 'case-setup' | 'recently-closed'>('active')
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false)
  const [editingCase, setEditingCase] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{[key: string]: any}>({})

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

  const handleAddNoteSuccess = () => {
    // Optionally reload cases to show updated data
    loadCases()
  }

  const handleEditCase = (caseId: string, field: string, currentValue: any) => {
    setEditingCase(caseId)
    setEditValues({ [field]: currentValue })
  }

  const handleSaveEdit = async (caseId: string) => {
    try {
      const response = await updateCase(caseId, editValues)
      if (response.error) {
        setError(response.error)
      } else {
        // Update local state
        setCases(prevCases => 
          prevCases.map(case_ => 
            case_.case_id === caseId 
              ? { ...case_, ...editValues }
              : case_
          )
        )
        setEditingCase(null)
        setEditValues({})
      }
    } catch (err) {
      setError('Failed to update case')
    }
  }

  const handleCancelEdit = () => {
    setEditingCase(null)
    setEditValues({})
  }

  const filteredCases = cases.filter(case_ => {
    if (filter === 'active') return case_.status === 'Active'
    if (filter === 'case-setup') return case_.status === 'Case Setup'
    if (filter === 'recently-closed') return case_.status === 'Closed'
    return true
  })

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
    if (!case_.persons) return ''
    return case_.persons
      .filter(person => person.role === 'child')
      .map(child => `${child.first_name} ${child.last_name}`)
      .join(', ')
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

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">SWCM Dashboard</h1>
          <p className="page-description">Loading your cases...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">SWCM Dashboard</h1>
        <p className="page-description">Manage your assigned child welfare cases</p>
      </div>

      <div className="content-wrapper">
        {/* Quick Access Buttons */}
        <div className="quick-access-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <button 
              className="quick-action-btn primary"
              onClick={() => setIsAddNoteModalOpen(true)}
            >
              <span className="icon">note_add</span>
              <div className="action-content">
                <span className="action-title">Add Case Note</span>
                <span className="action-desc">Document case activities</span>
              </div>
            </button>
            <button className="quick-action-btn secondary">
              <span className="icon">upload_file</span>
              <div className="action-content">
                <span className="action-title">Upload Document</span>
                <span className="action-desc">Add files to case records</span>
              </div>
            </button>
            <button className="quick-action-btn tertiary">
              <span className="icon">event</span>
              <div className="action-content">
                <span className="action-title">Schedule Appointment</span>
                <span className="action-desc">Book visits and meetings</span>
              </div>
            </button>
          </div>
        </div>

        {/* Task Summary */}
        <div className="task-summary-section">
          <h3>Task Summary</h3>
          <div className="task-summary-grid">
            <div className="task-summary-card urgent">
              <div className="task-icon error">
                <span className="icon">warning</span>
              </div>
              <div className="task-content">
                <h4>3</h4>
                <p>Overdue Tasks</p>
                <span className="task-detail">Safety assessments due</span>
              </div>
            </div>
            <div className="task-summary-card">
              <div className="task-icon primary">
                <span className="icon">schedule</span>
              </div>
              <div className="task-content">
                <h4>7</h4>
                <p>Due Today</p>
                <span className="task-detail">Various case activities</span>
              </div>
            </div>
            <div className="task-summary-card">
              <div className="task-icon secondary">
                <span className="icon">upcoming</span>
              </div>
              <div className="task-content">
                <h4>12</h4>
                <p>This Week</p>
                <span className="task-detail">Scheduled activities</span>
              </div>
            </div>
            <div className="task-summary-card">
              <div className="task-icon tertiary">
                <span className="icon">gavel</span>
              </div>
              <div className="task-content">
                <h4>2</h4>
                <p>Court Hearings</p>
                <span className="task-detail">Next 7 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              <span className="icon">folder_open</span>
              Active Cases ({cases.filter(c => c.status === 'Active').length})
            </button>
            <button 
              className={`tab ${filter === 'case-setup' ? 'active' : ''}`}
              onClick={() => setFilter('case-setup')}
            >
              <span className="icon">settings</span>
              Case Setup ({cases.filter(c => c.status === 'Case Setup').length})
            </button>
            <button 
              className={`tab ${filter === 'recently-closed' ? 'active' : ''}`}
              onClick={() => setFilter('recently-closed')}
            >
              <span className="icon">check_circle</span>
              Recently Closed ({cases.filter(c => c.status === 'Closed').length})
            </button>
          </div>
        </div>

        {/* Cases List */}
        <div className="card">
          <div className="card-header">
            <h2>
              {filter === 'active' && 'Active Cases'}
              {filter === 'case-setup' && 'Case Setup'}
              {filter === 'recently-closed' && 'Recently Closed Cases'}
            </h2>
            <div className="card-actions">
              <button className="action-btn secondary">
                <span className="icon">filter_list</span>
                Filter
              </button>
              <button className="action-btn primary">
                <span className="icon">refresh</span>
                Refresh
              </button>
            </div>
          </div>
          <div className="card-content">
            {filteredCases.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Case Name</th>
                      <th>Intake Date</th>
                      <th>Key Allegations</th>
                      <th>Children Involved</th>
                      <th>Indicators</th>
                      <th>Assigned Workers</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.map((case_) => (
                      <tr key={case_.case_id}>
                        <td>
                          <div className="case-name-cell">
                            {editingCase === case_.case_id ? (
                              <div className="edit-field">
                                <input
                                  type="text"
                                  value={editValues.case_display_name || ''}
                                  onChange={(e) => setEditValues({...editValues, case_display_name: e.target.value})}
                                  className="edit-input"
                                  autoFocus
                                />
                                <div className="edit-actions">
                                  <button 
                                    onClick={() => handleSaveEdit(case_.case_id)}
                                    className="action-btn small primary"
                                  >
                                    <span className="icon">check</span>
                                  </button>
                                  <button 
                                    onClick={handleCancelEdit}
                                    className="action-btn small secondary"
                                  >
                                    <span className="icon">close</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="case-name-display">
                                <Link href={`/cases/${case_.case_id}`} className="case-link">
                                  <strong>{case_.case_display_name || case_.family_name}</strong>
                                </Link>
                                <button 
                                  onClick={() => handleEditCase(case_.case_id, 'case_display_name', case_.case_display_name || case_.family_name)}
                                  className="edit-btn"
                                  title="Edit case name"
                                >
                                  <span className="icon">edit</span>
                                </button>
                              </div>
                            )}
                            <div className="case-number">{case_.case_number}</div>
                          </div>
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
                            <Link href={`/cases/${case_.case_id}`} className="action-btn small primary">
                              <span className="icon">visibility</span>
                              View
                            </Link>
                            <button 
                              className="action-btn small secondary"
                              onClick={() => setIsAddNoteModalOpen(true)}
                            >
                              <span className="icon">note_add</span>
                              Note
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="icon large">folder_open</span>
                <h3>No Cases Found</h3>
                <p>
                  {filter === 'active' && 'No active cases are currently assigned to you.'}
                  {filter === 'case-setup' && 'No cases require setup at this time.'}
                  {filter === 'recently-closed' && 'No cases have been recently closed.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Case Note Modal */}
      <AddCaseNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onSuccess={handleAddNoteSuccess}
      />
    </div>
  )
}
