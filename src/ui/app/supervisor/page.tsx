'use client'

import { useState, useEffect } from 'react'
import { Case, getPendingAssignmentCases, mockUsers, User, mockCases } from '../../lib/mockData'

export default function SupervisorPage() {
  const [pendingCases, setPendingCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState<string | null>(null)
  const [assignmentWorker, setAssignmentWorker] = useState<string>('')

  const caseworkers = mockUsers.filter(user => user.role === 'caseworker')

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      const cases = getPendingAssignmentCases()
      setPendingCases(cases)
      setLoading(false)
    }, 500)
  }, [])

  const handleAssignCase = (caseId: string, workerId: string) => {
    // Find the worker name
    const worker = caseworkers.find(w => w.user_id === workerId)
    if (!worker) return

    // Update the case in our mock data (in a real app, this would be an API call)
    const updatedCases = mockCases.map(case_ => {
      if (case_.case_id === caseId) {
        return {
          ...case_,
          assigned_worker: worker.name,
          status: 'Active' as const,
          last_updated: new Date().toISOString()
        }
      }
      return case_
    })

    // Update the pending cases list
    setPendingCases(prev => prev.filter(case_ => case_.case_id !== caseId))
    setSelectedCase(null)
    setAssignmentWorker('')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error'
      case 'medium': return 'secondary'
      case 'low': return 'tertiary'
      default: return 'secondary'
    }
  }

  const getUrgencyLevel = (case_: Case) => {
    if (case_.safety_assessment_due) {
      const dueDate = new Date(case_.safety_assessment_due)
      const now = new Date()
      const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      
      if (hoursUntilDue < 24) return 'urgent'
      if (hoursUntilDue < 72) return 'soon'
    }
    return 'normal'
  }

  if (loading) {
    return (
      <div>
        <header>
          <h1>Case Assignment Dashboard</h1>
          <p>Loading pending assignments...</p>
        </header>
      </div>
    )
  }

  return (
    <div>
      <header>
        <h1>Case Assignment Dashboard</h1>
        <p>Assign pending cases to caseworkers</p>
      </header>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon error">
            <span className="icon">assignment_late</span>
          </div>
          <div className="stat-content">
            <h3>{pendingCases.length}</h3>
            <p>Pending Assignment</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">
            <span className="icon">schedule</span>
          </div>
          <div className="stat-content">
            <h3>{pendingCases.filter(c => getUrgencyLevel(c) === 'urgent').length}</h3>
            <p>Urgent (24hrs)</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">
            <span className="icon">people</span>
          </div>
          <div className="stat-content">
            <h3>{caseworkers.length}</h3>
            <p>Available Workers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon tertiary">
            <span className="icon">trending_up</span>
          </div>
          <div className="stat-content">
            <h3>{pendingCases.filter(c => c.priority_level === 'High').length}</h3>
            <p>High Priority</p>
          </div>
        </div>
      </div>

      {/* Pending Cases */}
      <article>
        <h3>Cases Pending Assignment</h3>
        
        {pendingCases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--unit-8)', color: 'var(--text-secondary)' }}>
            <span className="icon" style={{ fontSize: '3rem', marginBottom: 'var(--unit-4)' }}>check_circle</span>
            <p>All cases have been assigned!</p>
          </div>
        ) : (
          <div className="case-assignment-list">
            {pendingCases.map((case_: Case) => {
              const urgency = getUrgencyLevel(case_)
              return (
                <div key={case_.case_id} className={`assignment-card ${urgency}`}>
                  <div className="assignment-header">
                    <div className="case-info">
                      <h4>{case_.primary_child}</h4>
                      <p className="case-number">{case_.case_number}</p>
                      <div className="case-meta">
                        <span className={`badge ${getPriorityColor(case_.priority_level)}`}>
                          {case_.priority_level} Priority
                        </span>
                        <span className="allegation-type">{case_.allegation_type}</span>
                      </div>
                    </div>
                    
                    <div className="urgency-indicator">
                      {urgency === 'urgent' && (
                        <div className="urgent-badge">
                          <span className="icon">warning</span>
                          <span>URGENT - 24hrs</span>
                        </div>
                      )}
                      {urgency === 'soon' && (
                        <div className="soon-badge">
                          <span className="icon">schedule</span>
                          <span>Due Soon - 72hrs</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="case-details">
                    <div className="detail-item">
                      <span className="icon">schedule</span>
                      <span>Created: {new Date(case_.created_date).toLocaleDateString()}</span>
                    </div>
                    {case_.safety_assessment_due && (
                      <div className="detail-item urgent">
                        <span className="icon">assignment</span>
                        <span>Assessment Due: {new Date(case_.safety_assessment_due).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="icon">description</span>
                      <span>{case_.allegation_description}</span>
                    </div>
                  </div>

                  <div className="assignment-actions">
                    {selectedCase === case_.case_id ? (
                      <div className="assignment-form">
                        <select 
                          value={assignmentWorker} 
                          onChange={(e) => setAssignmentWorker(e.target.value)}
                          className="worker-select"
                        >
                          <option value="">Select Caseworker</option>
                          {caseworkers.map((worker: User) => (
                            <option key={worker.user_id} value={worker.user_id}>
                              {worker.name}
                            </option>
                          ))}
                        </select>
                        <div className="form-actions">
                          <button 
                            className="action-btn primary"
                            onClick={() => handleAssignCase(case_.case_id, assignmentWorker)}
                            disabled={!assignmentWorker}
                          >
                            <span className="icon">assignment_ind</span>
                            Assign Case
                          </button>
                          <button 
                            className="action-btn secondary"
                            onClick={() => {
                              setSelectedCase(null)
                              setAssignmentWorker('')
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="quick-actions">
                        <button 
                          className="action-btn primary"
                          onClick={() => setSelectedCase(case_.case_id)}
                        >
                          <span className="icon">assignment_ind</span>
                          Assign Worker
                        </button>
                        <button className="action-btn secondary">
                          <span className="icon">visibility</span>
                          View Details
                        </button>
                        <button className="action-btn tertiary">
                          <span className="icon">edit</span>
                          Edit Case
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </article>

      {/* Caseworker Workload Summary */}
      <article>
        <h3>Caseworker Workload</h3>
        <div className="workload-grid">
          {caseworkers.map((worker: User) => {
            const workerCases = mockCases.filter(case_ => case_.assigned_worker === worker.name)
            const activeCases = workerCases.filter(case_ => case_.status === 'Active')
            const highPriorityCases = workerCases.filter(case_ => case_.priority_level === 'High')
            
            return (
              <div key={worker.user_id} className="workload-card">
                <div className="worker-info">
                  <h4>{worker.name}</h4>
                  <p>{worker.email}</p>
                </div>
                <div className="workload-stats">
                  <div className="stat">
                    <span className="stat-number">{activeCases.length}</span>
                    <span className="stat-label">Active Cases</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{highPriorityCases.length}</span>
                    <span className="stat-label">High Priority</span>
                  </div>
                </div>
                <div className="workload-indicator">
                  <div className={`workload-bar ${activeCases.length > 15 ? 'high' : activeCases.length > 10 ? 'medium' : 'low'}`}>
                    <div 
                      className="workload-fill" 
                      style={{ width: `${Math.min((activeCases.length / 20) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="workload-label">
                    {activeCases.length > 15 ? 'High Load' : activeCases.length > 10 ? 'Medium Load' : 'Available'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </article>
    </div>
  )
}
