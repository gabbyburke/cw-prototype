'use client'

import { useState, useEffect } from 'react'

interface Case {
  case_id: string
  case_number: string
  status: string
  priority_level: string
  assigned_worker: string
  created_date: string
  child_name: string
  allegation_type: string
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for prototype
    setTimeout(() => {
      setCases([
        {
          case_id: '1',
          case_number: 'CASE-20240115103000',
          status: 'Open',
          priority_level: 'High',
          assigned_worker: 'Olivia Rodriguez',
          created_date: '2024-01-15T10:30:00Z',
          child_name: 'Jane Smith',
          allegation_type: 'Physical Abuse'
        },
        {
          case_id: '2',
          case_number: 'CASE-20240110143000',
          status: 'Investigation',
          priority_level: 'Medium',
          assigned_worker: 'Olivia Rodriguez',
          created_date: '2024-01-10T14:30:00Z',
          child_name: 'John Doe',
          allegation_type: 'Neglect'
        },
        {
          case_id: '3',
          case_number: 'CASE-20240105091500',
          status: 'Closed',
          priority_level: 'Low',
          assigned_worker: 'Olivia Rodriguez',
          created_date: '2024-01-05T09:15:00Z',
          child_name: 'Sarah Wilson',
          allegation_type: 'Educational Neglect'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

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

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <span className="icon">folder_open</span>
          </div>
          <div className="stat-content">
            <h3>{cases.filter(c => c.status === 'Open').length}</h3>
            <p>Open Cases</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">
            <span className="icon">search</span>
          </div>
          <div className="stat-content">
            <h3>{cases.filter(c => c.status === 'Investigation').length}</h3>
            <p>Under Investigation</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon error">
            <span className="icon">priority_high</span>
          </div>
          <div className="stat-content">
            <h3>{cases.filter(c => c.priority_level === 'High').length}</h3>
            <p>High Priority</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon tertiary">
            <span className="icon">check_circle</span>
          </div>
          <div className="stat-content">
            <h3>{cases.filter(c => c.status === 'Closed').length}</h3>
            <p>Closed Cases</p>
          </div>
        </div>
      </div>

      {/* Case Cards */}
      <article>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--unit-6)' }}>
          <h3>Active Cases</h3>
          <button>
            <span className="icon" style={{ marginRight: 'var(--unit-2)' }}>add</span>
            New Case
          </button>
        </div>

        <div className="case-grid">
          {cases.map((caseItem) => (
            <div key={caseItem.case_id} className="case-card">
              <div className="case-header">
                <div className="case-title">
                  <h4>{caseItem.child_name}</h4>
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
              </div>

              <div className="case-actions">
                <button className="action-btn primary">
                  <span className="icon">visibility</span>
                  View
                </button>
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
          ))}
        </div>
      </article>
    </div>
  )
}
