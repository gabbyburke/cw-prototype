'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Case, getCasesPendingAssignment, assignCaseToSWCM } from '@/lib/api'
import { mockUsers } from '@/lib/mockData'

interface CaseAssignmentActionsProps {
  case_: Case
  swcmWorkers: any[]
  onAssign: (caseId: string, assignedWorker: string) => void
  isAssigning: boolean
}

function CaseAssignmentActions({ case_, swcmWorkers, onAssign, isAssigning }: CaseAssignmentActionsProps) {
  const [selectedWorker, setSelectedWorker] = useState('')

  const handleAssign = () => {
    if (selectedWorker) {
      onAssign(case_.case_id, selectedWorker)
      setSelectedWorker('')
    }
  }

  return (
    <div className="action-buttons">
      <select 
        className="form-control small"
        value={selectedWorker}
        onChange={(e) => setSelectedWorker(e.target.value)}
        disabled={isAssigning}
      >
        <option value="">Assign to...</option>
        {swcmWorkers.map(worker => (
          <option key={worker.user_id} value={worker.name}>
            {worker.name}
          </option>
        ))}
      </select>
      <button 
        className="action-btn small primary"
        onClick={handleAssign}
        disabled={!selectedWorker || isAssigning}
      >
        <span className="icon">
          {isAssigning ? 'hourglass_empty' : 'assignment'}
        </span>
        {isAssigning ? 'Assigning...' : 'Assign'}
      </button>
      <Link href={`/cases/${case_.case_id}`} className="action-btn small secondary">
        <span className="icon">visibility</span>
        Review
      </Link>
    </div>
  )
}

export default function SWCMSupervisorPage() {
  const [activeTab, setActiveTab] = useState('assignment')
  const [pendingCases, setPendingCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assigningCases, setAssigningCases] = useState<Set<string>>(new Set())
  const swcmWorkers = mockUsers.filter(user => user.role === 'caseworker')

  useEffect(() => {
    loadPendingCases()
  }, [])

  const loadPendingCases = async () => {
    setLoading(true)
    setError(null)
    
    const response = await getCasesPendingAssignment()
    
    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      setPendingCases(response.data.cases)
    }
    
    setLoading(false)
  }

  const handleAssignCase = async (caseId: string, assignedWorker: string) => {
    if (!assignedWorker) return

    setAssigningCases(prev => new Set(prev).add(caseId))
    
    const response = await assignCaseToSWCM(caseId, assignedWorker, 'Sarah Williams')
    
    if (response.error) {
      setError(response.error)
    } else {
      // Remove the assigned case from the pending list
      setPendingCases(prev => prev.filter(case_ => case_.case_id !== caseId))
    }
    
    setAssigningCases(prev => {
      const newSet = new Set(prev)
      newSet.delete(caseId)
      return newSet
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">SWCM Supervisor Dashboard</h1>
        <p className="page-description">Assign cases to SWCM workers and manage team workload</p>
      </div>

      <div className="content-wrapper">
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'assignment' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignment')}
            >
              <span className="icon">assignment_ind</span>
              Pending Assignment ({pendingCases.length})
            </button>
            <button 
              className={`tab ${activeTab === 'workload' ? 'active' : ''}`}
              onClick={() => setActiveTab('workload')}
            >
              <span className="icon">analytics</span>
              Team Workload
            </button>
            <button 
              className={`tab ${activeTab === 'assigned' ? 'active' : ''}`}
              onClick={() => setActiveTab('assigned')}
            >
              <span className="icon">check_circle</span>
              Assigned Today
            </button>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'assignment' && (
            <div className="card">
              <div className="card-header">
                <h2>Cases Pending SWCM Assignment</h2>
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
                {error && (
                  <div className="error-message">
                    <span className="icon">error</span>
                    <p>Error loading cases: {error}</p>
                    <button onClick={loadPendingCases} className="action-btn primary">
                      Retry
                    </button>
                  </div>
                )}
                
                {loading ? (
                  <div className="loading-state">
                    <span className="icon large">hourglass_empty</span>
                    <p>Loading pending cases...</p>
                  </div>
                ) : pendingCases.length > 0 ? (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Case ID</th>
                          <th>Family Name</th>
                          <th>County</th>
                          <th>Risk Level</th>
                          <th>Allegation Type</th>
                          <th>Created Date</th>
                          <th>Days Pending</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingCases.map((case_: Case) => (
                          <tr key={case_.case_id}>
                            <td>
                              <Link href={`/cases/${case_.case_id}`} className="case-link">
                                {case_.case_number || case_.case_id}
                              </Link>
                            </td>
                            <td>{case_.family_name}</td>
                            <td>{case_.county}</td>
                            <td>
                              <span className={`risk-badge ${case_.risk_level?.toLowerCase() || 'medium'}`}>
                                {case_.risk_level || 'Medium'}
                              </span>
                            </td>
                            <td>{case_.allegation_type}</td>
                            <td>
                              {new Date(case_.created_date).toLocaleDateString()}
                            </td>
                            <td>
                              <span className="days-pending">
                                {Math.floor((Date.now() - new Date(case_.created_date).getTime()) / (1000 * 60 * 60 * 24))}
                              </span>
                            </td>
                            <td>
                              <CaseAssignmentActions 
                                case_={case_}
                                swcmWorkers={swcmWorkers}
                                onAssign={handleAssignCase}
                                isAssigning={assigningCases.has(case_.case_id)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <span className="icon large">assignment_turned_in</span>
                    <h3>No Cases Pending Assignment</h3>
                    <p>All approved cases have been assigned to SWCM workers</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'workload' && (
            <div className="card">
              <div className="card-header">
                <h2>SWCM Team Workload Analysis</h2>
                <div className="card-actions">
                  <button className="action-btn secondary">
                    <span className="icon">download</span>
                    Export Report
                  </button>
                </div>
              </div>
              <div className="card-content">
                <div className="workload-grid">
                  <div className="workload-card">
                    <div className="workload-header">
                      <h3>Olivia Rodriguez</h3>
                      <span className="worker-role">SWCM</span>
                    </div>
                    <div className="workload-stats">
                      <div className="stat">
                        <span className="stat-number">15</span>
                        <span className="stat-label">Active Cases</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">3</span>
                        <span className="stat-label">High Risk</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">85%</span>
                        <span className="stat-label">Capacity</span>
                      </div>
                    </div>
                    <div className="workload-actions">
                      <button className="action-btn small secondary">View Details</button>
                    </div>
                  </div>
                  
                  <div className="workload-card">
                    <div className="workload-header">
                      <h3>Michael Chen</h3>
                      <span className="worker-role">SWCM</span>
                    </div>
                    <div className="workload-stats">
                      <div className="stat">
                        <span className="stat-number">12</span>
                        <span className="stat-label">Active Cases</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">2</span>
                        <span className="stat-label">High Risk</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">68%</span>
                        <span className="stat-label">Capacity</span>
                      </div>
                    </div>
                    <div className="workload-actions">
                      <button className="action-btn small secondary">View Details</button>
                    </div>
                  </div>
                  
                  <div className="workload-card">
                    <div className="workload-header">
                      <h3>David Thompson</h3>
                      <span className="worker-role">SWCM</span>
                    </div>
                    <div className="workload-stats">
                      <div className="stat">
                        <span className="stat-number">9</span>
                        <span className="stat-label">Active Cases</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">1</span>
                        <span className="stat-label">High Risk</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">51%</span>
                        <span className="stat-label">Capacity</span>
                      </div>
                    </div>
                    <div className="workload-actions">
                      <button className="action-btn small secondary">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assigned' && (
            <div className="card">
              <div className="card-header">
                <h2>Cases Assigned Today</h2>
              </div>
              <div className="card-content">
                <div className="empty-state">
                  <span className="icon large">assignment_turned_in</span>
                  <h3>No Cases Assigned Today</h3>
                  <p>No cases have been assigned to SWCM workers today</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
