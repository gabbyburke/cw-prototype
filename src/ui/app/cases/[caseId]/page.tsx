'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Case, 
  Person, 
  TimelineEvent, 
  getCaseById 
} from '@/lib/api'
import CaseSetupView from '@/components/CaseSetupView'

export default function CaseDetailPage() {
  const params = useParams()
  const caseId = params.caseId as string
  
  const [caseData, setCaseData] = useState<Case | null>(null)
  const [persons, setPersons] = useState<Person[]>([])
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'people' | 'case-management' | 'legal' | 'timeline'>('overview')
  const [activeSubTab, setActiveSubTab] = useState<{[key: string]: string}>({
    'people': 'people',
    'case-management': 'services',
    'legal': 'court'
  })

  useEffect(() => {
    if (caseId) {
      loadCaseData()
    }
  }, [caseId])

  const loadCaseData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await getCaseById(caseId)
      
      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        setCaseData(response.data)
        setPersons(response.data.persons || [])
        setTimelineEvents(response.data.timeline_events || [])
      } else {
        setError('Case not found')
      }
    } catch (err) {
      setError('Failed to load case data')
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
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Loading Case Details...</h1>
          <p className="page-description">Please wait while we load the case information.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Error Loading Case</h1>
          <p className="page-description">{error}</p>
        </div>
        <div className="content-wrapper">
          <div className="error-message">
            <span className="icon">error</span>
            <p>Unable to load case details. Please try again or contact support if the problem persists.</p>
          </div>
          <Link href="/" className="action-btn primary">
            <span className="icon">arrow_back</span>
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Case Not Found</h1>
          <p className="page-description">The requested case could not be found.</p>
        </div>
        <div className="content-wrapper">
          <Link href="/" className="action-btn primary">
            <span className="icon">arrow_back</span>
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Route to CaseSetupView for cases in setup mode
  if (caseData.status === 'Case Setup') {
    return <CaseSetupView case_={caseData} onProgressUpdate={loadCaseData} />
  }

  // Regular case view for all other statuses
  return (
    <div className="page-container">
      {/* Case Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--unit-4)' }}>
          <div>
            <h1 className="page-title">{caseData.case_display_name || caseData.family_name}</h1>
            <p className="page-description" style={{ fontSize: '1.1rem', marginBottom: 'var(--unit-2)' }}>
              {caseData.case_number} • Primary Child: {caseData.primary_child}
            </p>
            <div style={{ display: 'flex', gap: 'var(--unit-2)', marginBottom: 'var(--unit-2)' }}>
              <span className={`badge ${getStatusColor(caseData.status)}`}>
                {caseData.status}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--unit-2)' }}>
            <Link href="/" className="action-btn secondary" style={{ width: '160px', flexShrink: 0 }}>
              <span className="icon">arrow_back</span>
              Back to Dashboard
            </Link>
            <button className="action-btn primary" style={{ width: '120px', flexShrink: 0 }}>
              <span className="icon">edit</span>
              Edit Case
            </button>
          </div>
        </div>
        
        <div className="case-summary">
          <div className="summary-item">
            <span className="icon">schedule</span>
            <div>
              <strong>Intake Date:</strong>
              <p>{new Date(caseData.created_date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="summary-item">
            <span className="icon">assignment_turned_in</span>
            <div>
              <strong>Assessment Approval Date:</strong>
              <p>{caseData.workflow_status?.cpw_supervisor_approved ? new Date(caseData.last_updated).toLocaleDateString() : 'Pending'}</p>
            </div>
          </div>
          <div className="summary-item">
            <span className="icon">report</span>
            <div>
              <strong>Allegation(s):</strong>
              <p>{caseData.allegation_type}</p>
              {caseData.allegation_description && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {caseData.allegation_description}
                </p>
              )}
            </div>
          </div>
          <div className="summary-item">
            <span className="icon">child_care</span>
            <div>
              <strong>Child(ren):</strong>
              <div>
                {persons.filter(person => person.role === 'Client' || person.role === 'child').length > 0 ? (
                  persons
                    .filter(person => person.role === 'Client' || person.role === 'child')
                    .map((child, index) => (
                      <span key={child.person_id}>
                        <Link 
                          href={`/persons/${child.person_id}`} 
                          className="child-link"
                          style={{ color: 'var(--primary)', textDecoration: 'none' }}
                        >
                          {child.first_name} {child.last_name}
                        </Link>
                        {index < persons.filter(person => person.role === 'Client' || person.role === 'child').length - 1 && ', '}
                      </span>
                    ))
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>No children listed</span>
                )}
              </div>
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
            <span className="icon">location_on</span>
            <div>
              <strong>County:</strong>
              <p>{caseData.county}</p>
            </div>
          </div>
        </div>
      </div>

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
          className={activeTab === 'people' ? 'active' : ''}
          onClick={() => setActiveTab('people')}
          data-tab="people"
        >
          <span className="icon">people</span>
          People & Associations ({persons.length})
        </button>
        <button 
          className={activeTab === 'case-management' ? 'active' : ''}
          onClick={() => setActiveTab('case-management')}
          data-tab="case-management"
        >
          <span className="icon">work</span>
          Case Management
        </button>
        <button 
          className={activeTab === 'legal' ? 'active' : ''}
          onClick={() => setActiveTab('legal')}
          data-tab="legal"
        >
          <span className="icon">gavel</span>
          Legal & Documentation
        </button>
        <button 
          className={activeTab === 'timeline' ? 'active' : ''}
          onClick={() => setActiveTab('timeline')}
        >
          <span className="icon">timeline</span>
          Timeline ({timelineEvents.length})
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

      {activeTab === 'people' && (
        <div className="tab-content">
          {/* Sub-tab navigation for People & Associations */}
          <div style={{ 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px', 
            padding: '8px', 
            marginBottom: 'var(--unit-4)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '4px',
              width: '100%'
            }}>
              <button 
                className={`sub-tab ${activeSubTab['people'] === 'people' ? 'active' : ''}`}
                onClick={() => setActiveSubTab({...activeSubTab, 'people': 'people'})}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeSubTab['people'] === 'people' ? '#dbeafe' : 'transparent',
                  color: activeSubTab['people'] === 'people' ? '#1e40af' : '#64748b',
                  fontWeight: activeSubTab['people'] === 'people' ? '600' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span className="icon" style={{ fontSize: '18px' }}>people</span>
                People
              </button>
              <button 
                className={`sub-tab ${activeSubTab['people'] === 'associations' ? 'active' : ''}`}
                onClick={() => setActiveSubTab({...activeSubTab, 'people': 'associations'})}
                data-subtab="associations"
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeSubTab['people'] === 'associations' ? '#dbeafe' : 'transparent',
                  color: activeSubTab['people'] === 'associations' ? '#1e40af' : '#64748b',
                  fontWeight: activeSubTab['people'] === 'associations' ? '600' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span className="icon" style={{ fontSize: '18px' }}>family_restroom</span>
                Associations
              </button>
              <button 
                className={`sub-tab ${activeSubTab['people'] === 'health' ? 'active' : ''}`}
                onClick={() => setActiveSubTab({...activeSubTab, 'people': 'health'})}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeSubTab['people'] === 'health' ? '#dbeafe' : 'transparent',
                  color: activeSubTab['people'] === 'health' ? '#1e40af' : '#64748b',
                  fontWeight: activeSubTab['people'] === 'health' ? '600' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span className="icon" style={{ fontSize: '18px' }}>medical_services</span>
                Health
              </button>
              <button 
                className={`sub-tab ${activeSubTab['people'] === 'education' ? 'active' : ''}`}
                onClick={() => setActiveSubTab({...activeSubTab, 'people': 'education'})}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeSubTab['people'] === 'education' ? '#dbeafe' : 'transparent',
                  color: activeSubTab['people'] === 'education' ? '#1e40af' : '#64748b',
                  fontWeight: activeSubTab['people'] === 'education' ? '600' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span className="icon" style={{ fontSize: '18px' }}>school</span>
                Education/Income
              </button>
            </div>
          </div>

          {activeSubTab['people'] === 'people' && (
            <article>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--unit-4)' }}>
                <h3>People Involved</h3>
                <button 
                  className="action-btn small primary"
                  style={{ 
                    padding: '8px 12px',
                    fontSize: '13px',
                    minWidth: 'auto',
                    width: 'auto',
                    flex: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span className="icon" style={{ fontSize: '16px' }}>person_add</span>
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
          )}

          {activeSubTab['people'] === 'associations' && (
            <article>
              <h3>Family Associations & Relationships</h3>
              <div style={{ textAlign: 'center', padding: 'var(--unit-8)', color: 'var(--text-secondary)' }}>
                <span className="icon" style={{ fontSize: '3rem', marginBottom: 'var(--unit-4)' }}>family_restroom</span>
                <p>Association management feature coming soon</p>
              </div>
            </article>
          )}

          {activeSubTab['people'] === 'health' && (
            <article>
              <h3>Health Information</h3>
              <div style={{ textAlign: 'center', padding: 'var(--unit-8)', color: 'var(--text-secondary)' }}>
                <span className="icon" style={{ fontSize: '3rem', marginBottom: 'var(--unit-4)' }}>medical_services</span>
                <p>Health information management feature coming soon</p>
              </div>
            </article>
          )}

          {activeSubTab['people'] === 'education' && (
            <article>
              <h3>Education & Income Information</h3>
              <div style={{ textAlign: 'center', padding: 'var(--unit-8)', color: 'var(--text-secondary)' }}>
                <span className="icon" style={{ fontSize: '3rem', marginBottom: 'var(--unit-4)' }}>school</span>
                <p>Education and income tracking feature coming soon</p>
              </div>
            </article>
          )}
        </div>
      )}

      {activeTab === 'case-management' && (
        <div className="tab-content">
          {/* Sub-tab navigation for Case Management */}
          <div style={{ 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px', 
            padding: '8px', 
            marginBottom: 'var(--unit-4)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '4px',
              width: '100%'
            }}>
              <button 
                className={`sub-tab ${activeSubTab['case-management'] === 'services' ? 'active' : ''}`}
                onClick={() => setActiveSubTab({...activeSubTab, 'case-management': 'services'})}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeSubTab['case-management'] === 'services' ? '#dbeafe' : 'transparent',
                  color: activeSubTab['case-management'] === 'services' ? '#1e40af' : '#64748b',
                  fontWeight: activeSubTab['case-management'] === 'services' ? '600' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span className="icon" style={{ fontSize: '18px' }}>support</span>
                Services
              </button>
              <button 
                className={`sub-tab ${activeSubTab['case-management'] === 'living' ? 'active' : ''}`}
                onClick={() => setActiveSubTab({...activeSubTab, 'case-management': 'living'})}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeSubTab['case-management'] === 'living' ? '#dbeafe' : 'transparent',
                  color: activeSubTab['case-management'] === 'living' ? '#1e40af' : '#64748b',
                  fontWeight: activeSubTab['case-management'] === 'living' ? '600' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span className="icon" style={{ fontSize: '18px' }}>home</span>
                Living Arrangements
              </button>
              <button 
                className={`sub-tab ${activeSubTab['case-management'] === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveSubTab({...activeSubTab, 'case-management': 'notes'})}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeSubTab['case-management'] === 'notes' ? '#dbeafe' : 'transparent',
                  color: activeSubTab['case-management'] === 'notes' ? '#1e40af' : '#64748b',
                  fontWeight: activeSubTab['case-management'] === 'notes' ? '600' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span className="icon" style={{ fontSize: '18px' }}>note</span>
                Notes
              </button>
            </div>
          </div>

          {activeSubTab['case-management'] === 'services' && (
            <article>
              <h3>Services & Support</h3>
              <div style={{ textAlign: 'center', padding: 'var(--unit-8)', color: 'var(--text-secondary)' }}>
                <span className="icon" style={{ fontSize: '3rem', marginBottom: 'var(--unit-4)' }}>support</span>
                <p>Services management feature coming soon</p>
              </div>
            </article>
          )}

          {activeSubTab['case-management'] === 'living' && (
            <article>
              <h3>Living Arrangements & Placements</h3>
              <div style={{ textAlign: 'center', padding: 'var(--unit-8)', color: 'var(--text-secondary)' }}>
                <span className="icon" style={{ fontSize: '3rem', marginBottom: 'var(--unit-4)' }}>home</span>
                <p>Living arrangements tracking feature coming soon</p>
              </div>
            </article>
          )}

          {activeSubTab['case-management'] === 'notes' && (
            <article>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--unit-4)' }}>
                <h3>Case Notes</h3>
                <button className="action-btn primary">
                  <span className="icon">note_add</span>
                  Add Note
                </button>
              </div>
              
              <div className="notes-list">
                {caseData.case_notes && caseData.case_notes.map((note) => (
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
            </article>
          )}
        </div>
      )}

      {activeTab === 'legal' && (
        <div className="tab-content">
          {/* Sub-tab navigation for Legal & Documentation */}
          <div style={{ 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px', 
            padding: '8px', 
            marginBottom: 'var(--unit-4)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '4px',
              width: '100%'
            }}>
              <button 
                className={`sub-tab ${activeSubTab['legal'] === 'court' ? 'active' : ''}`}
                onClick={() => setActiveSubTab({...activeSubTab, 'legal': 'court'})}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeSubTab['legal'] === 'court' ? '#dbeafe' : 'transparent',
                  color: activeSubTab['legal'] === 'court' ? '#1e40af' : '#64748b',
                  fontWeight: activeSubTab['legal'] === 'court' ? '600' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span className="icon" style={{ fontSize: '18px' }}>gavel</span>
                Court
              </button>
              <button 
                className={`sub-tab ${activeSubTab['legal'] === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveSubTab({...activeSubTab, 'legal': 'documents'})}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeSubTab['legal'] === 'documents' ? '#dbeafe' : 'transparent',
                  color: activeSubTab['legal'] === 'documents' ? '#1e40af' : '#64748b',
                  fontWeight: activeSubTab['legal'] === 'documents' ? '600' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span className="icon" style={{ fontSize: '18px' }}>folder</span>
                Electronic Case File
              </button>
            </div>
          </div>

          {activeSubTab['legal'] === 'court' && (
            <article>
              <h3>Court Information & Legal Documents</h3>
              <div style={{ textAlign: 'center', padding: 'var(--unit-8)', color: 'var(--text-secondary)' }}>
                <span className="icon" style={{ fontSize: '3rem', marginBottom: 'var(--unit-4)' }}>gavel</span>
                <p>Court management feature coming soon</p>
              </div>
            </article>
          )}

          {activeSubTab['legal'] === 'documents' && (
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
          )}
        </div>
      )}
    </div>
  )
}
