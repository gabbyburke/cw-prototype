'use client'

import { useState } from 'react'

export default function IntakePage() {
  const [activeTab, setActiveTab] = useState('pending')

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Intake Management</h1>
        <p className="page-description">Manage incoming referrals and create new cases</p>
      </div>

      <div className="content-wrapper">
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              <span className="icon">pending</span>
              Pending Intake
            </button>
            <button 
              className={`tab ${activeTab === 'hotline' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotline')}
            >
              <span className="icon">phone</span>
              Hotline Calls
            </button>
            <button 
              className={`tab ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              <span className="icon">add_circle</span>
              Create Case
            </button>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'pending' && (
            <div className="card">
              <div className="card-header">
                <h2>Pending Intake Reviews</h2>
                <div className="card-actions">
                  <button className="action-btn primary">
                    <span className="icon">refresh</span>
                    Refresh
                  </button>
                </div>
              </div>
              <div className="card-content">
                <div className="empty-state">
                  <span className="icon large">inbox</span>
                  <h3>No Pending Intakes</h3>
                  <p>All intake referrals have been processed</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hotline' && (
            <div className="card">
              <div className="card-header">
                <h2>Recent Hotline Calls</h2>
                <div className="card-actions">
                  <button className="action-btn primary">
                    <span className="icon">add</span>
                    Log New Call
                  </button>
                </div>
              </div>
              <div className="card-content">
                <div className="empty-state">
                  <span className="icon large">phone</span>
                  <h3>No Recent Calls</h3>
                  <p>No hotline calls logged today</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="card">
              <div className="card-header">
                <h2>Create New Case</h2>
              </div>
              <div className="card-content">
                <form className="form-grid">
                  <div className="form-group">
                    <label htmlFor="pathway">Case Pathway</label>
                    <select id="pathway" className="form-control">
                      <option value="">Select pathway...</option>
                      <option value="jarvis">JARVIS Referral</option>
                      <option value="manual">Manual Entry</option>
                      <option value="hotline">Hotline Call</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="county">County</label>
                    <select id="county" className="form-control">
                      <option value="">Select county...</option>
                      <option value="polk">Polk County</option>
                      <option value="linn">Linn County</option>
                      <option value="scott">Scott County</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="incident">Incident Number</label>
                    <input 
                      type="text" 
                      id="incident" 
                      className="form-control"
                      placeholder="Enter incident number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="intake-date">Intake Date</label>
                    <input 
                      type="date" 
                      id="intake-date" 
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="action-btn secondary">
                      Cancel
                    </button>
                    <button type="submit" className="action-btn primary">
                      <span className="icon">add</span>
                      Create Case
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
