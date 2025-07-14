'use client'

import { useState, useEffect } from 'react'

interface DashboardStats {
  totalReferrals: number
  pendingReferrals: number
  activeCases: number
  highPriorityCases: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReferrals: 0,
    pendingReferrals: 0,
    activeCases: 0,
    highPriorityCases: 0
  })

  useEffect(() => {
    // In a real implementation, this would fetch from the APIs
    // For now, we'll use mock data
    setStats({
      totalReferrals: 45,
      pendingReferrals: 12,
      activeCases: 28,
      highPriorityCases: 8
    })
  }, [])

  return (
    <div>
      <header>
        <h1>My Caseload</h1>
        <p>Welcome back, Olivia - You have 8 cases requiring attention today.</p>
      </header>

      {/* My Caseload Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <span className="icon">folder_open</span>
          </div>
          <div className="stat-content">
            <h3>15</h3>
            <p>My Active Cases</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon error">
            <span className="icon">schedule</span>
          </div>
          <div className="stat-content">
            <h3>3</h3>
            <p>Due Today</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">
            <span className="icon">event</span>
          </div>
          <div className="stat-content">
            <h3>5</h3>
            <p>Upcoming Visits</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon tertiary">
            <span className="icon">gavel</span>
          </div>
          <div className="stat-content">
            <h3>2</h3>
            <p>Court Hearings</p>
          </div>
        </div>
      </div>

      {/* New Referrals from CPS Hotline */}
      <article>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--unit-4)' }}>
          <h3>New Referrals Assigned to You</h3>
          <span style={{ 
            backgroundColor: 'var(--error)', 
            color: 'var(--on-error)', 
            padding: 'var(--unit-1) var(--unit-2)', 
            borderRadius: 'var(--unit-1)', 
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            3 NEW
          </span>
        </div>
        
        <div className="referral-list">
          <div className="referral-card urgent">
            <div className="referral-header">
              <div className="referral-info">
                <h4>Johnson Family - Physical Abuse Allegation</h4>
                <p className="referral-details">Child: Emma Johnson (Age 7) | Reporter: School Nurse</p>
                <p className="referral-time">Received: Today 8:45 AM | Response Required: Within 24 hours</p>
              </div>
              <div className="referral-actions">
                <button className="action-btn primary">
                  <span className="icon">visibility</span>
                  Review
                </button>
                <button className="action-btn secondary">
                  <span className="icon">check</span>
                  Accept
                </button>
              </div>
            </div>
          </div>

          <div className="referral-card">
            <div className="referral-header">
              <div className="referral-info">
                <h4>Martinez Family - Neglect Allegation</h4>
                <p className="referral-details">Child: Carlos Martinez (Age 5) | Reporter: Neighbor</p>
                <p className="referral-time">Received: Today 11:20 AM | Response Required: Within 72 hours</p>
              </div>
              <div className="referral-actions">
                <button className="action-btn primary">
                  <span className="icon">visibility</span>
                  Review
                </button>
                <button className="action-btn secondary">
                  <span className="icon">check</span>
                  Accept
                </button>
              </div>
            </div>
          </div>

          <div className="referral-card">
            <div className="referral-header">
              <div className="referral-info">
                <h4>Thompson Family - Educational Neglect</h4>
                <p className="referral-details">Child: Sarah Thompson (Age 12) | Reporter: School Counselor</p>
                <p className="referral-time">Received: Yesterday 3:15 PM | Response Required: Within 72 hours</p>
              </div>
              <div className="referral-actions">
                <button className="action-btn primary">
                  <span className="icon">visibility</span>
                  Review
                </button>
                <button className="action-btn secondary">
                  <span className="icon">check</span>
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Field Actions */}
      <article>
        <h3>Field Actions</h3>
        <div className="quick-actions">
          <a href="/cases/add-note" className="action-card">
            <span className="icon" style={{ fontSize: '2rem', marginBottom: 'var(--unit-2)' }}>note_add</span>
            <span>Quick Case Note</span>
          </a>
          <a href="/visits/schedule" className="action-card">
            <span className="icon" style={{ fontSize: '2rem', marginBottom: 'var(--unit-2)' }}>event</span>
            <span>Schedule Visit</span>
          </a>
          <a href="/safety/assessment" className="action-card">
            <span className="icon" style={{ fontSize: '2rem', marginBottom: 'var(--unit-2)' }}>security</span>
            <span>Safety Assessment</span>
          </a>
          <a href="/contacts/log" className="action-card">
            <span className="icon" style={{ fontSize: '2rem', marginBottom: 'var(--unit-2)' }}>contact_phone</span>
            <span>Log Contact</span>
          </a>
        </div>
      </article>

      {/* Today's Priority Tasks */}
      <article>
        <h3>Today's Priority Tasks</h3>
        <div className="task-list">
          <div className="task-item urgent">
            <span className="icon">warning</span>
            <div className="task-content">
              <h4>Safety Assessment Due - Johnson Family</h4>
              <p>72-hour assessment deadline: 2:00 PM today</p>
            </div>
          </div>
          <div className="task-item">
            <span className="icon">event</span>
            <div className="task-content">
              <h4>Home Visit - Smith Case</h4>
              <p>Scheduled for 10:00 AM - 123 Oak Street</p>
            </div>
          </div>
          <div className="task-item">
            <span className="icon">gavel</span>
            <div className="task-content">
              <h4>Court Hearing - Wilson Case</h4>
              <p>Family Court, Room 3A - 1:30 PM</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
