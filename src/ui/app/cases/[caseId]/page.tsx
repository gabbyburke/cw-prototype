'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Case, 
  Person, 
  TimelineEvent, 
  getCaseById 
} from '../../../lib/api'

export default function CaseDetailPage() {
  const params = useParams()
  const caseId = params.caseId as string
  
  const [caseData, setCaseData] = useState<Case | null>(null)
  const [persons, setPersons] = useState<Person[]>([])
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'persons' | 'documents'>('overview')

  useEffect(() => {
    if (caseId) {
      loadCaseData()
    }
  }, [caseId])

  const loadCaseData = async () => {
    setLoading(true)
    
    const response = await getCaseById(caseId)
    
    if (response.data) {
      setCaseData(response.data)
      setPersons(response.data.persons || [])
      setTimelineEvents(response.data.timeline_events || [])
    }
    
    setLoading(false)
  }

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
      case 'active': return 'primary'
      case 'pending assignment': return 'secondary'
      case 'closed': return 'tertiary'
      case 'draft': return 'tertiary'
      default: return 'secondary'
    }
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'case_note': return 'note'
      case 'visit': return 'home'
      case 'court_hearing': return 'gavel'
      case 'placement_change': return 'swap_horiz'
      case 'assessment': return 'assignment'
      case 'document_upload': return 'upload_file'
      case 'assignment_change': return 'person_add'
      default: return 'event'
    }
  }

  const getEventColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'secondary'
      default: return 'primary'
    }
  }

  if (loading) {
    return (
      <div>
        <header>
          <h1>Loading Case Details...</h1>
        </header>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div>
        <header>
          <h1>Case Not Found</h1>
          <p>The requested case could not be found.</p>
        </header>
        <Link href="/cases" className="action-btn primary">
          <span className="icon">arrow_back</span>
          Back to Cases
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Case Header */}
      <header style={{ marginBottom: 'var(--unit-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--unit-4)' }}>
          <div>
            <h1>{caseData.primary_child}</h1>
            <p className="case-number" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 'var(--unit-2)' }}>
              {caseData.case_number}
            </p>
            <div style={{ display: 'flex', gap: 'var(--unit-2)', marginBottom: 'var(--unit-2)' }}>
              <span className={`badge ${getPriorityColor(caseData.priority_level)}`}>
                {caseData.priority_level} Priority
              </span>
              <span className={`badge ${getStatusColor(caseData.status)}`}>
                {caseData.status}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--unit-2)' }}>
            <Link href="/cases" className="action-btn secondary">
              <span className="icon">arrow_back</span>
              Back to Cases
            </Link>
            <button className="action-btn primary">
              <span className="icon">edit</span>
              Edit Case
            </button>
          </div>
        </div>
        
        <div className="case-summary">
          <div className="summary-item">
            <span className="icon">report</span>
            <div>
              <strong>Allegation:</strong>
              <p>{caseData.allegation_type}</p>
            </div>
          </div>
          <div className="summary-item">
            <span className="icon">person</span>
            <div>
              <strong>Assigned Worker:</strong>
              <p>{caseData.assigned_worker || 'Unassigned'}</p>
            </div>
          </div>
          <div className="summary-item">
            <span className="icon">schedule</span>
            <div>
              <strong>Created:</strong>
              <p>{new Date(caseData.created_date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="summary-item">
            <span className="icon">location_on</span>
            <div>
              <strong>County:</strong>
              <p>{caseData.county}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation" style={{ marginBottom: 'var(--unit-6)' }}>
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          <span className="icon">dashboard</span>
          Overview
        </button>
        <button 
          className={activeTab === 'timeline' ? 'active' : ''}
          onClick={() => setActiveTab('timeline')}
        >
          <span className="icon">timeline</span>
          Timeline ({timelineEvents.length})
        </button>
        <button 
          className={activeTab === 'persons' ? 'active' : ''}
          onClick={() => setActiveTab('persons')}
        >
          <span className="icon">people</span>
          People ({persons.length})
        </button>
        <button 
          className={activeTab === 'documents' ? 'active' : ''}
          onClick={() => setActiveTab('documents')}
        >
          <span className="icon">folder</span>
          Documents
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="overview-grid">
            {/* Case Details */}
            <article className="overview-section">
              <h3>Case Information</h3>
              <div className="detail-list">
                <div className="detail-item">
                  <strong>Allegation Description:</strong>
                  <p>{caseData.allegation_description}</p>
                </div>
                <div className="detail-item">
                  <strong>Status:</strong>
                  <p>{caseData.status}</p>
                </div>
                <div className="detail-item">
                  <strong>Priority Level:</strong>
                  <p>{caseData.priority_level}</p>
                </div>
                <div className="detail-item">
                  <strong>Last Updated:</strong>
                  <p>{new Date(caseData.last_updated).toLocaleDateString()}</p>
                </div>
                <div className="detail-item">
                  <strong>Risk Level:</strong>
                  <p>{caseData.risk_level || 'Not assessed'}</p>
                </div>
              </div>
            </article>

            {/* Recent Activity */}
            <article className="overview-section">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {timelineEvents.slice(0, 3).map((event: TimelineEvent) => (
                  <div key={event.event_id} className="activity-item">
                    <div className={`activity-icon ${getEventColor(event.priority)}`}>
                      <span className="icon">{getEventIcon(event.event_type)}</span>
                    </div>
                    <div className="activity-content">
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                      <span className="activity-date">
                        {new Date(event.date).toLocaleDateString()} - {event.created_by}
                      </span>
                    </div>
                  </div>
                ))}
                {timelineEvents.length === 0 && (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--unit-4)' }}>
                    No recent activity
                  </p>
                )}
              </div>
            </article>

            {/* Case Notes */}
            <article className="overview-section">
              <h3>Recent Case Notes</h3>
              <div className="notes-list">
                {caseData.case_notes && caseData.case_notes.slice(0, 3).map((note) => (
                  <div key={note.note_id} className="note-item">
                    <div className="note-header">
                      <strong>{note.created_by}</strong>
                      <span className="note-date">
                        {new Date(note.created_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{note.text}</p>
                  </div>
                ))}
                {(!caseData.case_notes || caseData.case_notes.length === 0) && (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--unit-4)' }}>
                    No case notes yet
                  </p>
                )}
              </div>
              <button className="action-btn secondary" style={{ marginTop: 'var(--unit-4)' }}>
                <span className="icon">note_add</span>
                Add Case Note
              </button>
            </article>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="tab-content">
          <article>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--unit-4)' }}>
              <h3>Case Timeline</h3>
              <button className="action-btn primary">
                <span className="icon">add</span>
                Add Event
              </button>
            </div>
            
            <div className="timeline">
              {timelineEvents.map((event: TimelineEvent) => (
                <div key={event.event_id} className="timeline-item">
                  <div className={`timeline-marker ${getEventColor(event.priority)}`}>
                    <span className="icon">{getEventIcon(event.event_type)}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h4>{event.title}</h4>
                      <span className="timeline-date">
                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <p>{event.description}</p>
                    <div className="timeline-meta">
                      <span className="timeline-author">By: {event.created_by}</span>
                      <span className={`timeline-type ${event.event_type}`}>
                        {event.event_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {timelineEvents.length === 0 && (
                <div style={{ textAlign: 'center', padding: 'var(--unit-8)', color: 'var(--text-secondary)' }}>
                  <span className="icon" style={{ fontSize: '3rem', marginBottom: 'var(--unit-4)' }}>timeline</span>
                  <p>No timeline events yet</p>
                </div>
              )}
            </div>
          </article>
        </div>
      )}

      {activeTab === 'persons' && (
        <div className="tab-content">
          <article>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--unit-4)' }}>
              <h3>People Involved</h3>
              <button className="action-btn primary">
                <span className="icon">person_add</span>
                Add Person
              </button>
            </div>
            
            <div className="persons-grid">
              {persons.map((person: Person) => (
                <div key={person.person_id} className="person-card">
                  <div className="person-header">
                    <div className="person-info">
                      <h4>{person.first_name} {person.last_name}</h4>
                      <p className="person-role">{person.role.charAt(0).toUpperCase() + person.role.slice(1)}</p>
                      <p className="person-age">
                        Age: {Math.floor((new Date().getTime() - new Date(person.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}
                      </p>
                    </div>
                    {person.indicators && person.indicators.length > 0 && (
                      <div className="person-indicators">
                        {person.indicators.map((indicator, index) => (
                          <span key={index} className="indicator-badge">
                            {indicator}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="person-contact">
                    {person.contact_info.phone && (
                      <div className="contact-item">
                        <span className="icon">phone</span>
                        <span>{person.contact_info.phone}</span>
                      </div>
                    )}
                    {person.contact_info.address && (
                      <div className="contact-item">
                        <span className="icon">location_on</span>
                        <span>{person.contact_info.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="person-actions">
                    <button className="action-btn primary">
                      <span className="icon">visibility</span>
                      View Profile
                    </button>
                    <button className="action-btn secondary">
                      <span className="icon">edit</span>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
              
              {persons.length === 0 && (
                <div style={{ textAlign: 'center', padding: 'var(--unit-8)', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
                  <span className="icon" style={{ fontSize: '3rem', marginBottom: 'var(--unit-4)' }}>people</span>
                  <p>No people added to this case yet</p>
                </div>
              )}
            </div>
          </article>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="tab-content">
          <article>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--unit-4)' }}>
              <h3>Electronic Case File (ECF)</h3>
              <button className="action-btn primary">
                <span className="icon">upload_file</span>
                Upload Document
              </button>
            </div>
            
            <div style={{ textAlign: 'center', padding: 'var(--unit-8)', color: 'var(--text-secondary)' }}>
              <span className="icon" style={{ fontSize: '3rem', marginBottom: 'var(--unit-4)' }}>folder_open</span>
              <p>Document management feature coming soon</p>
              <p style={{ fontSize: '0.9rem', marginTop: 'var(--unit-2)' }}>
                This will include document upload, categorization, and management capabilities
              </p>
            </div>
          </article>
        </div>
      )}
    </div>
  )
}
