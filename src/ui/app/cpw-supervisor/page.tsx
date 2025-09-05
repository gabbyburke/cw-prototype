'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Case, getCasesByWorker } from '@/lib/api'

export default function CPWSupervisorPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = async () => {
    setLoading(true)
    setError(null)
    
    // Get cases with "Pending Assignment" status for CPW supervisor review
    const response = await getCasesByWorker('unassigned')
    
    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      // Filter for cases that are "Pending Assignment" (completed by CPW, awaiting supervisor approval)
      const pendingApprovalCases = response.data.cases.filter(case_ => case_.status === 'Pending Assignment')
      setCases(pendingApprovalCases)
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

  const getDaysPending = (case_: Case) => {
    if (!case_.last_updated) return 0
    return Math.floor((Date.now() - new Date(case_.last_updated).getTime()) / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">CPW Supervisor View</h1>
          <p className="page-description">Loading cases...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">CPW Supervisor View</h1>
        <p className="page-description">Review and approve cases from CPW workers</p>
      </div>

      <div className="content-wrapper">
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              <span className="icon">pending_actions</span>
              Pending Approval ({cases.length})
            </button>
            <button 
              className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              <span className="icon">check_circle</span>
              Approved Today
            </button>
            <button 
              className={`tab ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              <span className="icon">group</span>
              Team Workload
            </button>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'pending' && (
            <div className="card">
              <div className="card-header">
                <h2>Cases Pending CPW Supervisor Approval</h2>
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
                {cases.length > 0 ? (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Case Name</th>
                          <th>Intake Date</th>
                          <th>Key Allegations</th>
                          <th>Children Involved</th>
                          <th>Risk Level</th>
                          <th>Indicators</th>
                          <th>Days Pending</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cases.map((case_) => (
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
                              <span className={`risk-badge ${case_.risk_level?.toLowerCase().replace(' ', '-')}`}>
                                {case_.risk_level || 'Not Set'}
                              </span>
                            </td>
                            <td>
                              <div className="indicators-cell">
                                {getAllIndicators(case_).slice(0, 2).map((indicator, index) => (
                                  <span 
                                    key={index}
                                    className={`indicator-badge ${getIndicatorColor(indicator)}`}
                                    title={indicator}
                                  >
                                    <span className="icon">{getIndicatorIcon(indicator)}</span>
                                    {indicator}
                                  </span>
                                ))}
                                {getAllIndicators(case_).length > 2 && (
                                  <span className="indicator-more">
                                    +{getAllIndicators(case_).length - 2} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className="days-pending">
                                {getDaysPending(case_)}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button className="action-btn small success">
                                  <span className="icon">check</span>
                                  Approve
                                </button>
                                <button className="action-btn small warning">
                                  <span className="icon">close</span>
                                  Reject
                                </button>
                                <Link href={`/cases/${case_.case_id}`} className="action-btn small secondary">
                                  <span className="icon">visibility</span>
                                  Review
                                </Link>
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
                    <h3>No Cases Pending Approval</h3>
                    <p>All cases have been reviewed and approved</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'approved' && (
            <div className="card">
              <div className="card-header">
                <h2>Cases Approved Today</h2>
              </div>
              <div className="card-content">
                <div className="empty-state">
                  <span className="icon large">check_circle</span>
                  <h3>No Cases Approved Today</h3>
                  <p>No cases have been approved today</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="card">
              <div className="card-header">
                <h2>Team Workload Overview</h2>
              </div>
              <div className="card-content">
                <div className="workload-grid">
                  <div className="workload-card">
                    <div className="workload-header">
                      <h3>Jennifer Smith</h3>
                      <span className="worker-role">CPW</span>
                    </div>
                    <div className="workload-stats">
                      <div className="stat">
                        <span className="stat-number">12</span>
                        <span className="stat-label">Active Cases</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">3</span>
                        <span className="stat-label">Pending Review</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">2</span>
                        <span className="stat-label">Overdue</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="workload-card">
                    <div className="workload-header">
                      <h3>Mark Johnson</h3>
                      <span className="worker-role">CPW</span>
                    </div>
                    <div className="workload-stats">
                      <div className="stat">
                        <span className="stat-number">8</span>
                        <span className="stat-label">Active Cases</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">1</span>
                        <span className="stat-label">Pending Review</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">0</span>
                        <span className="stat-label">Overdue</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
