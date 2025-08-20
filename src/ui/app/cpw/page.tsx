'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getCasesPendingCPWReview } from '@/lib/mockData'

export default function CPWPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const pendingCases = getCasesPendingCPWReview()

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">CPW Dashboard</h1>
        <p className="page-description">Review and process cases requiring CPW attention</p>
      </div>

      <div className="content-wrapper">
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              <span className="icon">pending</span>
              Pending Review ({pendingCases.length})
            </button>
            <button 
              className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              <span className="icon">check_circle</span>
              Completed Today
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
          {activeTab === 'pending' && (
            <div className="card">
              <div className="card-header">
                <h2>Cases Pending CPW Review</h2>
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
                {pendingCases.length > 0 ? (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Case ID</th>
                          <th>Family Name</th>
                          <th>County</th>
                          <th>Risk Level</th>
                          <th>Received</th>
                          <th>Days Pending</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingCases.map((case_) => (
                          <tr key={case_.case_id}>
                            <td>
                              <Link href={`/cases/${case_.case_id}`} className="case-link">
                                {case_.case_id}
                              </Link>
                            </td>
                            <td>{case_.family_name}</td>
                            <td>{case_.county}</td>
                            <td>
                              <span className={`risk-badge ${case_.risk_level?.toLowerCase()}`}>
                                {case_.risk_level}
                              </span>
                            </td>
                            <td>{new Date(case_.created_date).toLocaleDateString()}</td>
                            <td>
                              <span className="days-pending">
                                {Math.floor((Date.now() - new Date(case_.created_date).getTime()) / (1000 * 60 * 60 * 24))}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button className="action-btn small primary">
                                  <span className="icon">visibility</span>
                                  Review
                                </button>
                                <button className="action-btn small secondary">
                                  <span className="icon">assignment</span>
                                  Assign
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
                    <h3>No Cases Pending Review</h3>
                    <p>All cases have been reviewed and processed</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="card">
              <div className="card-header">
                <h2>Cases Completed Today</h2>
              </div>
              <div className="card-content">
                <div className="empty-state">
                  <span className="icon large">check_circle</span>
                  <h3>No Cases Completed Today</h3>
                  <p>No cases have been completed today</p>
                </div>
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
    </div>
  )
}
