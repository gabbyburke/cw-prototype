'use client'

import { useState, useEffect } from 'react'

interface Referral {
  referral_id: string
  referral_date: string
  referral_source: string
  child_name: string
  allegation_type: string
  screening_decision: string
  priority_level: string
  assigned_worker?: string
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for prototype
    setTimeout(() => {
      setReferrals([
        {
          referral_id: '1',
          referral_date: '2024-01-15T10:30:00Z',
          referral_source: 'School',
          child_name: 'John Doe',
          allegation_type: 'Neglect',
          screening_decision: 'Pending',
          priority_level: 'Medium',
          assigned_worker: 'worker@example.com'
        },
        {
          referral_id: '2',
          referral_date: '2024-01-14T14:20:00Z',
          referral_source: 'Hospital',
          child_name: 'Jane Smith',
          allegation_type: 'Physical Abuse',
          screening_decision: 'Accept',
          priority_level: 'High',
          assigned_worker: 'worker2@example.com'
        },
        {
          referral_id: '3',
          referral_date: '2024-01-13T09:15:00Z',
          referral_source: 'Anonymous',
          child_name: 'Mike Johnson',
          allegation_type: 'Emotional Abuse',
          screening_decision: 'Pending',
          priority_level: 'Low'
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
      case 'accept': return 'tertiary'
      case 'reject': return 'error'
      case 'pending': return 'secondary'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <div>
        <header>
          <h1>Referrals</h1>
          <p>Loading referrals...</p>
        </header>
      </div>
    )
  }

  return (
    <div>
      <header>
        <h1>Referrals</h1>
        <p>Manage and review child welfare referrals</p>
      </header>

      <article>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--unit-4)' }}>
          <h3>Recent Referrals</h3>
          <button>
            <span className="icon" style={{ marginRight: 'var(--unit-2)' }}>add</span>
            New Referral
          </button>
        </div>

        {referrals.length === 0 ? (
          <p>No referrals found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Child Name</th>
                <th>Source</th>
                <th>Allegation</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Worker</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral.referral_id}>
                  <td>
                    <time>{new Date(referral.referral_date).toLocaleDateString()}</time>
                  </td>
                  <td>{referral.child_name}</td>
                  <td>{referral.referral_source}</td>
                  <td>{referral.allegation_type}</td>
                  <td>
                    <span 
                      className={`stat-icon ${getPriorityColor(referral.priority_level)}`}
                      style={{ 
                        width: 'auto', 
                        height: 'auto', 
                        padding: 'var(--unit-1) var(--unit-2)', 
                        fontSize: '0.75rem',
                        borderRadius: 'var(--unit-1)'
                      }}
                    >
                      {referral.priority_level}
                    </span>
                  </td>
                  <td>
                    <span 
                      className={`stat-icon ${getStatusColor(referral.screening_decision)}`}
                      style={{ 
                        width: 'auto', 
                        height: 'auto', 
                        padding: 'var(--unit-1) var(--unit-2)', 
                        fontSize: '0.75rem',
                        borderRadius: 'var(--unit-1)'
                      }}
                    >
                      {referral.screening_decision}
                    </span>
                  </td>
                  <td>{referral.assigned_worker || 'Unassigned'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--unit-2)' }}>
                      <button 
                        style={{ 
                          padding: 'var(--unit-1) var(--unit-2)', 
                          fontSize: '0.875rem',
                          backgroundColor: 'var(--primary-container)',
                          color: 'var(--on-primary-container)'
                        }}
                      >
                        <span className="icon">visibility</span>
                      </button>
                      <button 
                        style={{ 
                          padding: 'var(--unit-1) var(--unit-2)', 
                          fontSize: '0.875rem',
                          backgroundColor: 'var(--secondary-container)',
                          color: 'var(--on-secondary-container)'
                        }}
                      >
                        <span className="icon">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </article>

      <article>
        <h3>Screening Actions</h3>
        <p>Select referrals above to perform screening actions such as accept, reject, or request more information.</p>
        
        <div style={{ display: 'flex', gap: 'var(--unit-3)', marginTop: 'var(--unit-4)' }}>
          <button style={{ backgroundColor: 'var(--tertiary)', color: 'var(--on-tertiary)' }}>
            <span className="icon" style={{ marginRight: 'var(--unit-2)' }}>check_circle</span>
            Accept for Investigation
          </button>
          <button style={{ backgroundColor: 'var(--error)', color: 'var(--on-error)' }}>
            <span className="icon" style={{ marginRight: 'var(--unit-2)' }}>cancel</span>
            Reject Referral
          </button>
          <button style={{ backgroundColor: 'var(--secondary)', color: 'var(--on-secondary)' }}>
            <span className="icon" style={{ marginRight: 'var(--unit-2)' }}>info</span>
            Request Information
          </button>
        </div>
      </article>
    </div>
  )
}
