'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getCasesPendingCPWSupervisorApproval } from '../../lib/mockData'

export default function CPWSupervisorPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const pendingApprovalCases = getCasesPendingCPWSupervisorApproval()

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
              Pending Approval ({pendingApprovalCases.length})
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
                  <button className="action-btn primary">
                    <span className="icon">refresh</span>
                    Refresh
                  </button>
                </div>
              </div>
              <div className="card-content">
                {pendingApprovalCases.length > 0 ? (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Case ID</th>
                          <th>Family Name</th>
                          <th>County</th>
                          <th>Risk Level</th>
                          <th>CPW Reviewed By</th>
                          <th>Review Date</th>
                          <th>Days Pending</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApprovalCases.map((case_) => (
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
                            <td>{case_.workflow_status.cpw_reviewed_by}</td>
                            <td>
                              {case_.workflow_status.cpw_reviewed_date 
                                ? new Date(case_.workflow_status.cpw_reviewed_date).toLocaleDateString()
                                : 'N/A'
                              }
                            </td>
                            <td>
                              <span className="days-pending">
                                {case_.workflow_status.cpw_reviewed_date
                                  ? Math.floor((Date.now() - new Date(case_.workflow_status.cpw_reviewed_date).getTime()) / (1000 * 60 * 60 * 24))
                                  : 0
                                }
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
                                <button className="action-btn small secondary">
                                  <span className="icon">visibility</span>
                                  Review
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
