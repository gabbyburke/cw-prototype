'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Case, getCasesByWorker, getCurrentUser, getPersonById } from '../../lib/mockData'

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'high-priority'>('all')

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      const currentUser = getCurrentUser()
      const userCases = getCasesByWorker(currentUser.name)
      setCases(userCases)
      setLoading(false)
    }, 500)
  }, [])

  const filteredCases = cases.filter(case_ => {
    if (filter === 'active') return case_.status === 'Active'
    if (filter === 'high-priority') return case_.priority_level === 'High'
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error'
      case 'medium': return 'secondary'
      case 'low': return 'tertiary'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'tertiary'
      case 'investigation': return 'secondary'
      case 'closed': return 'primary'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <div>
        <header>
          <h1>My Cases</h1>
          <p>Loading your cases...</p>
        </header>
      </div>
    )
  }

  return (
    <div>
      <header>
        <h1>My Cases</h1>
        <p>Manage your assigned child welfare cases</p>
      </header>

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ marginBottom: 'var(--unit-6)' }}>
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Cases ({cases.length})
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active ({cases.filter((c: Case) => c.status === 'Active').length})
        </button>
        <button 
          className={filter === 'high-priority' ? 'active' : ''}
          onClick={() => setFilter('high-priority')}
        >
          High Priority ({cases.filter((c: Case) => c.priority_level === 'High').length})
        </button>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <span className="icon">folder_open</span>
          </div>
          <div className="stat-content">
            <h3>{cases.filter((c: Case) => c.status === 'Active').length}</h3>
            <p>Active Cases</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon error">
            <span className="icon">priority_high</span>
          </div>
          <div className="stat-content">
            <h3>{cases.filter((c: Case) => c.priority_level === 'High').length}</h3>
            <p>High Priority</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">
            <span className="icon">schedule</span>
          </div>
          <div className="stat-content">
            <h3>{cases.filter((c: Case) => c.safety_assessment_due).length}</h3>
            <p>Assessments Due</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon tertiary">
            <span className="icon">gavel</span>
          </div>
          <div className="stat-content">
            <h3>{cases.filter((c: Case) => c.next_court_date).length}</h3>
            <p>Court Hearings</p>
          </div>
        </div>
      </div>

      {/* Case Cards */}
      <article>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--unit-6)' }}>
          <h3>My Caseload</h3>
          <button>
            <span className="icon" style={{ marginRight: 'var(--unit-2)' }}>add</span>
            New Case
          </button>
        </div>

        <div className="case-grid">
          {filteredCases.map((caseItem: Case) => {
            const primaryChild = getPersonById(caseItem.involved_persons[0])
            return (
              <div key={caseItem.case_id} className="case-card">
                <div className="case-header">
                  <div className="case-title">
                    <h4>{caseItem.primary_child}</h4>
                    <p className="case-number">{caseItem.case_number}</p>
                  </div>
                  <div className="case-badges">
                    <span className={`badge ${getPriorityColor(caseItem.priority_level)}`}>
                      {caseItem.priority_level}
                    </span>
                    <span className={`badge ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </div>
                </div>
                
                <div className="case-details">
                  <div className="case-detail">
                    <span className="icon">report</span>
                    <span>{caseItem.allegation_type}</span>
                  </div>
                  <div className="case-detail">
                    <span className="icon">schedule</span>
                    <span>{new Date(caseItem.created_date).toLocaleDateString()}</span>
                  </div>
                  {caseItem.safety_assessment_due && (
                    <div className="case-detail urgent">
                      <span className="icon">warning</span>
                      <span>Assessment Due: {new Date(caseItem.safety_assessment_due).toLocaleDateString()}</span>
                    </div>
                  )}
                  {caseItem.next_court_date && (
                    <div className="case-detail">
                      <span className="icon">gavel</span>
                      <span>Court: {new Date(caseItem.next_court_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="case-actions">
                  <Link href={`/cases/${caseItem.case_id}`} className="action-btn primary">
                    <span className="icon">visibility</span>
                    View Details
                  </Link>
                  <button className="action-btn secondary">
                    <span className="icon">note_add</span>
                    Add Note
                  </button>
                  <button className="action-btn tertiary">
                    <span className="icon">edit</span>
                    Edit
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filteredCases.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--unit-8)', color: 'var(--text-secondary)' }}>
            <span className="icon" style={{ fontSize: '3rem', marginBottom: 'var(--unit-4)' }}>folder_open</span>
            <p>No cases match the current filter.</p>
          </div>
        )}
      </article>
    </div>
  )
}
