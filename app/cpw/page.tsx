'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Case, getCasesByWorker } from '../../lib/api'
import { getCurrentUser } from '../../lib/mockData'
import CPWCaseSetupModal from '../../components/CPWCaseSetupModal'

export default function CPWPage() {
  const [activeTab, setActiveTab] = useState('cpw-queue')
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)

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

  const hasSavedProgress = (caseId: string) => {
    try {
      const saved = localStorage.getItem(`cpw_setup_${caseId}`)
      return saved !== null
    } catch (error) {
      return false
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

  // Filter cases based on active tab
  const filteredCases = cases.filter(case_ => {
    if (activeTab === 'cpw-queue') return case_.status === 'Case Setup'
    if (activeTab === 'completed') return case_.status === 'Active' || case_.status === 'Closed'
    if (activeTab === 'overdue') return false // TODO: Implement overdue logic
    return true
  })

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
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'cpw-queue' ? 'active' : ''}`}
              onClick={() => setActiveTab('cpw-queue')}
            >
              <span className="icon">queue</span>
              CPW Queue ({cases.filter(c => c.status === 'Case Setup').length})
            </button>
            <button 
              className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              <span className="icon">check_circle</span>
              Completed ({cases.filter(c => c.status === 'Active' || c.status === 'Closed').length})
            </button>
            <button 
              className={`tab ${activeTab === 'overdue' ? 'active' : ''}`}
              onClick={() => setActiveTab('overdue')}
            >
              <span className="icon">warning</span>
              Overdue
            </button>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'cpw-queue' && (
            <div className="card">
              <div className="card-header">
                <h2>CPW Queue - Cases Requiring Setup</h2>
                <div className="card-actions">
                  <button className="action-btn secondary">
                    <span className="icon">filter_list</span>
                    Filter
                  </button>
                  <button className="action-btn primary" onClick={loadCases}>
                    <span className="icon">refresh</span>
                    Refresh
                  </button>
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
                                <Link href={`/cases/${case_.case_id}`} className="case-link">
                                  <strong>{case_.case_display_name || case_.family_name}</strong>
                                </Link>
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
                                <button 
                                  onClick={() => handleSetupCase(case_)}
                                  className="action-btn small primary"
                                  title={hasSavedProgress(case_.case_id) ? 'Resume saved progress' : 'Start case setup'}
                                >
                                  <span className="icon">{hasSavedProgress(case_.case_id) ? 'play_arrow' : 'settings'}</span>
                                  {hasSavedProgress(case_.case_id) ? 'Resume' : 'Setup'}
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
                    <span className="icon large">queue</span>
                    <h3>No Cases in CPW Queue</h3>
                    <p>All cases requiring setup have been processed</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="card">
              <div className="card-header">
                <h2>Completed Cases</h2>
                <div className="card-actions">
                  <button className="action-btn secondary">
                    <span className="icon">filter_list</span>
                    Filter
                  </button>
                  <button className="action-btn primary" onClick={loadCases}>
                    <span className="icon">refresh</span>
                    Refresh
                  </button>
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
                                <Link href={`/cases/${case_.case_id}`} className="case-link">
                                  <strong>{case_.case_display_name || case_.family_name}</strong>
                                </Link>
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
                                <button className="action-btn small secondary">
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
                    <span className="icon large">check_circle</span>
                    <h3>No Completed Cases</h3>
                    <p>No cases have been sent for SWCM assignment yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'overdue' && (
            <div className="card">
              <div className="card-header">
                <h2>Overdue Cases</h2>
              </div>
              <div className="card-content">
                <div className="empty-state">
                  <span className="icon large">warning</span>
                  <h3>No Overdue Cases</h3>
                  <p>All cases are within required timeframes</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CPW Case Setup Modal */}
      <CPWCaseSetupModal
        isOpen={isSetupModalOpen}
        onClose={handleCloseModal}
        case_={selectedCase}
        onSuccess={handleSetupSuccess}
      />
    </div>
  )
}
