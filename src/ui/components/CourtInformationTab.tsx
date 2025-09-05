'use client'

import { useState, useEffect, useRef } from 'react'
import { Case, CourtDocumentData, processCourtDocument, CourtProcessingResponse } from '@/lib/api'

interface CourtInformationTabProps {
  case_: Case
}

interface CourtFormData {
  // Case & People
  caseMembers: Array<{
    name: string
    courtType: string
    docketNumber: string
    initialCourtOrderUrl: string | null
  }>
  courtProfessionals: {
    judge: { name: string; title: string }
    countyAttorney: { name: string; title: string }
    attorneys: Array<{ name: string; represents: string }>
    guardianAdLitem: { name: string }
    intervenors: any[]
    casas: any[]
  }
  // Current Order Details
  hearingDateTime: string
  location: string
  hearingType: string
  reasonsForAdjudication: string[]
  dispositionModification: string
  permanencyGoal: string
  legalStatus: string
  legalCustody: string
  underAppeal: boolean
  abilityToGiveConsent: string
  guardianship: string
  // Future Hearings
  upcomingHearings: Array<{
    nextCourtDate: string
    nextHearingType: string
    location: string
    startTime: string
    endTime: string
    duration: string
  }>
}

interface AIFieldMetadata {
  [fieldPath: string]: {
    isAIGenerated: boolean
    confidence: number
    source: string
  }
}

const HEARING_TYPES = [
  'Initial Hearing',
  'Removal Order',
  'Adjudication',
  'Disposition',
  'Review Hearing',
  'Permanency Hearing',
  'Termination of Parental Rights',
  'Adoption Hearing',
  'Other'
]

const LEGAL_STATUS_OPTIONS = [
  'Temporary Custody',
  'Permanent Custody',
  'Legal Guardianship',
  'Returned Home',
  'Adoption',
  'Other'
]

const PERMANENCY_GOALS = [
  'Return Home',
  'Adoption',
  'Legal Guardianship',
  'Permanent Placement with Relatives',
  'Another Planned Permanent Living Arrangement',
  'Other'
]

const ADJUDICATION_REASONS = [
  'Physical Abuse',
  'Sexual Abuse',
  'Emotional Abuse',
  'Neglect',
  'Medical Neglect',
  'Educational Neglect',
  'Inadequate Nutrition',
  'Parental Substance Abuse',
  'Domestic Violence',
  'Abandonment',
  'Other'
]

export default function CourtInformationTab({ case_ }: CourtInformationTabProps) {
  const [formData, setFormData] = useState<CourtFormData>({
    caseMembers: [],
    courtProfessionals: {
      judge: { name: '', title: '' },
      countyAttorney: { name: '', title: '' },
      attorneys: [],
      guardianAdLitem: { name: '' },
      intervenors: [],
      casas: []
    },
    hearingDateTime: '',
    location: '',
    hearingType: '',
    reasonsForAdjudication: [],
    dispositionModification: '',
    permanencyGoal: '',
    legalStatus: '',
    legalCustody: '',
    underAppeal: false,
    abilityToGiveConsent: '',
    guardianship: '',
    upcomingHearings: []
  })

  const [aiMetadata, setAiMetadata] = useState<AIFieldMetadata>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form with case data
  useEffect(() => {
    if (case_.persons) {
      const children = case_.persons.filter(p => p.role.toLowerCase() === 'client' || p.role.toLowerCase() === 'child')
      const caseMembers = children.map(child => ({
        name: `${child.first_name} ${child.last_name}`,
        courtType: 'CINA',
        docketNumber: '',
        initialCourtOrderUrl: null
      }))
      
      setFormData(prev => ({
        ...prev,
        caseMembers
      }))
    }
  }, [case_])

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsProcessing(true)
    setProcessingError(null)
    setUploadedFile(file)

    try {
      const response = await processCourtDocument(file, case_.case_id)
      
      if (response.error) {
        setProcessingError(response.error)
        return
      }

      if (response.data) {
        populateFormFromAI(response.data.data, response.data.metadata.filename)
      }
    } catch (error) {
      setProcessingError('Failed to process document. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Populate form with AI-extracted data
  const populateFormFromAI = (data: CourtDocumentData, filename: string) => {
    const newMetadata: AIFieldMetadata = {}
    const confidence = data._metadata?.confidence_score || 0.8

    // Helper to mark field as AI-generated
    const markAIField = (fieldPath: string) => {
      newMetadata[fieldPath] = {
        isAIGenerated: true,
        confidence,
        source: filename
      }
    }

    // Update form data
    setFormData(prev => ({
      ...prev,
      caseMembers: data.courtDetails.caseMembers || prev.caseMembers,
      courtProfessionals: data.courtProfessionals || prev.courtProfessionals,
      hearingDateTime: data.courtHearingOrder.hearingDateTime || prev.hearingDateTime,
      location: data.courtHearingOrder.location || prev.location,
      hearingType: data.courtHearingOrder.hearingType || prev.hearingType,
      reasonsForAdjudication: data.courtHearingOrder.reasonsForAdjudication || prev.reasonsForAdjudication,
      dispositionModification: data.courtHearingOrder.dispositionModification || prev.dispositionModification,
      permanencyGoal: data.courtHearingOrder.permanencyGoal || prev.permanencyGoal,
      legalStatus: data.courtHearingOrder.legalStatus || prev.legalStatus,
      legalCustody: data.courtHearingOrder.legalCustody || prev.legalCustody,
      underAppeal: data.courtHearingOrder.underAppeal || prev.underAppeal,
      abilityToGiveConsent: data.courtHearingOrder.abilityToGiveConsent || prev.abilityToGiveConsent,
      guardianship: data.courtHearingOrder.guardianship || prev.guardianship,
      upcomingHearings: data.upcomingCourtHearings.map(h => ({
        nextCourtDate: h.nextCourtDate || '',
        nextHearingType: h.nextHearingType || '',
        location: h.location || '',
        startTime: h.startTime || '',
        endTime: h.endTime || '',
        duration: h.duration || ''
      })) || prev.upcomingHearings
    }))

    // Mark fields as AI-generated
    if (data.courtHearingOrder.hearingDateTime) markAIField('hearingDateTime')
    if (data.courtHearingOrder.location) markAIField('location')
    if (data.courtHearingOrder.hearingType) markAIField('hearingType')
    if (data.courtHearingOrder.reasonsForAdjudication?.length) markAIField('reasonsForAdjudication')
    if (data.courtHearingOrder.legalStatus) markAIField('legalStatus')
    if (data.courtHearingOrder.legalCustody) markAIField('legalCustody')
    if (data.courtProfessionals.judge?.name) markAIField('judge.name')
    if (data.courtProfessionals.countyAttorney?.name) markAIField('countyAttorney.name')

    setAiMetadata(newMetadata)
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  // Clear AI highlighting when field is edited
  const handleFieldEdit = (fieldPath: string) => {
    setAiMetadata(prev => {
      const updated = { ...prev }
      delete updated[fieldPath]
      return updated
    })
  }

  // Get AI field styling
  const getAIFieldClass = (fieldPath: string) => {
    return aiMetadata[fieldPath]?.isAIGenerated ? 'ai-generated' : ''
  }

  // Get confidence tooltip
  const getConfidenceTooltip = (fieldPath: string) => {
    const metadata = aiMetadata[fieldPath]
    if (!metadata) return ''
    
    const confidence = Math.round(metadata.confidence * 100)
    return `Extracted from ${metadata.source} with ${confidence}% confidence`
  }

  // Handle form submission
  const handleSave = () => {
    // TODO: Save court information to backend
    console.log('Saving court information:', formData)
  }

  const handleReview = () => {
    // TODO: Open review modal
    console.log('Opening review modal')
  }

  return (
    <div className="court-information-tab">
      {/* File Upload Section */}
      <div className="upload-section">
        <div 
          className={`upload-area ${isDragOver ? 'drag-over' : ''} ${isProcessing ? 'processing' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp,.gif"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          
          {isProcessing ? (
            <div className="processing-state">
              <span className="icon spinning">hourglass_empty</span>
              <h3>Processing Document...</h3>
              <p>AI is extracting court information from your document</p>
            </div>
          ) : (
            <div className="upload-prompt">
              <span className="icon">cloud_upload</span>
              <h3>Upload Court Document</h3>
              <p>Drag and drop a court document here, or click to browse</p>
              <div className="supported-formats">
                Supports: PDF, PNG, JPG, TIFF
              </div>
            </div>
          )}
        </div>

        {processingError && (
          <div className="error-message">
            <span className="icon">error</span>
            {processingError}
          </div>
        )}

        {uploadedFile && !isProcessing && (
          <div className="uploaded-file">
            <span className="icon">description</span>
            <span className="filename">{uploadedFile.name}</span>
            <span className="file-size">({Math.round(uploadedFile.size / 1024)} KB)</span>
          </div>
        )}
      </div>

      {/* Section 1: Case & People */}
      <div className="court-section">
        <div className="section-header">
          <h2>Case & People</h2>
          <p>Court case details and professional participants</p>
        </div>

        <div className="section-content">
          {/* Case Members Card */}
          <div className="info-card">
            <h3>Case Members</h3>
            <div className="case-members-list">
              {formData.caseMembers.map((member, index) => (
                <div key={index} className="case-member-item">
                  <div className="member-info">
                    <strong>{member.name}</strong>
                    <div className="member-details">
                      <span>Court Type: {member.courtType}</span>
                      <span>Docket: {member.docketNumber || 'Not assigned'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Court Professionals Card */}
          <div className="info-card">
            <h3>Court Professionals</h3>
            <div className="professionals-list">
              {formData.courtProfessionals.judge.name && (
                <div className="professional-item">
                  <span className="icon">gavel</span>
                  <div className="professional-info">
                    <strong>{formData.courtProfessionals.judge.name}</strong>
                    <span>{formData.courtProfessionals.judge.title}</span>
                  </div>
                </div>
              )}
              
              {formData.courtProfessionals.countyAttorney.name && (
                <div className="professional-item">
                  <span className="icon">account_balance</span>
                  <div className="professional-info">
                    <strong>{formData.courtProfessionals.countyAttorney.name}</strong>
                    <span>{formData.courtProfessionals.countyAttorney.title}</span>
                  </div>
                </div>
              )}

              {formData.courtProfessionals.attorneys.map((attorney, index) => (
                <div key={index} className="professional-item">
                  <span className="icon">person</span>
                  <div className="professional-info">
                    <strong>{attorney.name}</strong>
                    <span>Attorney for {attorney.represents}</span>
                  </div>
                </div>
              ))}

              {formData.courtProfessionals.guardianAdLitem.name && (
                <div className="professional-item">
                  <span className="icon">shield</span>
                  <div className="professional-info">
                    <strong>{formData.courtProfessionals.guardianAdLitem.name}</strong>
                    <span>Guardian ad Litem</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Current Order Details */}
      <div className="court-section">
        <div className="section-header">
          <h2>Current Order Details</h2>
          <p>Information about the current court hearing and order</p>
        </div>

        <div className="section-content">
          <div className="form-grid">
            <div className="form-group">
              <label>Hearing Date & Time</label>
              <input
                type="datetime-local"
                value={formData.hearingDateTime}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, hearingDateTime: e.target.value }))
                  handleFieldEdit('hearingDateTime')
                }}
                className={getAIFieldClass('hearingDateTime')}
                title={getConfidenceTooltip('hearingDateTime')}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, location: e.target.value }))
                  handleFieldEdit('location')
                }}
                placeholder="Court location"
                className={getAIFieldClass('location')}
                title={getConfidenceTooltip('location')}
              />
            </div>

            <div className="form-group">
              <label>Hearing Type</label>
              <select
                value={formData.hearingType}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, hearingType: e.target.value }))
                  handleFieldEdit('hearingType')
                }}
                className={getAIFieldClass('hearingType')}
                title={getConfidenceTooltip('hearingType')}
              >
                <option value="">Select hearing type</option>
                {HEARING_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Legal Status</label>
              <select
                value={formData.legalStatus}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, legalStatus: e.target.value }))
                  handleFieldEdit('legalStatus')
                }}
                className={getAIFieldClass('legalStatus')}
                title={getConfidenceTooltip('legalStatus')}
              >
                <option value="">Select legal status</option>
                {LEGAL_STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Legal Custody</label>
              <input
                type="text"
                value={formData.legalCustody}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, legalCustody: e.target.value }))
                  handleFieldEdit('legalCustody')
                }}
                placeholder="Who has legal custody"
                className={getAIFieldClass('legalCustody')}
                title={getConfidenceTooltip('legalCustody')}
              />
            </div>

            <div className="form-group">
              <label>Permanency Goal</label>
              <select
                value={formData.permanencyGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, permanencyGoal: e.target.value }))}
              >
                <option value="">Select permanency goal</option>
                {PERMANENCY_GOALS.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Reasons for Adjudication</label>
              <div className="multi-select-chips">
                {ADJUDICATION_REASONS.map(reason => (
                  <label key={reason} className="chip-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.reasonsForAdjudication.includes(reason)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            reasonsForAdjudication: [...prev.reasonsForAdjudication, reason]
                          }))
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            reasonsForAdjudication: prev.reasonsForAdjudication.filter(r => r !== reason)
                          }))
                        }
                        handleFieldEdit('reasonsForAdjudication')
                      }}
                    />
                    <span className={`chip ${formData.reasonsForAdjudication.includes(reason) ? 'selected' : ''} ${getAIFieldClass('reasonsForAdjudication')}`}>
                      {reason}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={formData.underAppeal}
                  onChange={(e) => setFormData(prev => ({ ...prev, underAppeal: e.target.checked }))}
                />
                <span className="toggle-switch"></span>
                Under Appeal?
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Future Hearings */}
      <div className="court-section">
        <div className="section-header">
          <h2>Future Hearings</h2>
          <p>Upcoming court dates and scheduled hearings</p>
        </div>

        <div className="section-content">
          {formData.upcomingHearings.length > 0 ? (
            <div className="hearings-list">
              {formData.upcomingHearings.map((hearing, index) => (
                <div key={index} className="hearing-item">
                  <div className="hearing-info">
                    <strong>{hearing.nextHearingType}</strong>
                    <div className="hearing-details">
                      <span>{hearing.nextCourtDate}</span>
                      <span>{hearing.location}</span>
                      {hearing.startTime && <span>{hearing.startTime} - {hearing.endTime}</span>}
                    </div>
                  </div>
                  <div className="hearing-actions">
                    <button className="action-btn small secondary">
                      <span className="icon">edit</span>
                      Edit
                    </button>
                    <button className="action-btn small error">
                      <span className="icon">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="icon">event</span>
              <h3>No upcoming hearings scheduled</h3>
              <p>Future hearings will appear here when scheduled</p>
              <button className="action-btn primary">
                <span className="icon">add</span>
                Add Hearing
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky-action-bar">
        <div className="action-bar-content">
          <button onClick={handleSave} className="action-btn primary">
            <span className="icon">save</span>
            Save
          </button>
          <button onClick={handleReview} className="action-btn secondary">
            <span className="icon">visibility</span>
            Review
          </button>
          <button className="action-btn tertiary">
            Cancel
          </button>
        </div>
      </div>

      <style jsx>{`
        .court-information-tab {
          padding-bottom: 100px; /* Space for sticky action bar */
        }

        .upload-section {
          margin-bottom: var(--unit-6);
        }

        .upload-area {
          border: 2px dashed var(--outline-variant);
          border-radius: var(--unit-3);
          padding: var(--unit-8);
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: var(--surface-container-low);
        }

        .upload-area:hover {
          border-color: var(--primary);
          background-color: var(--surface-container);
        }

        .upload-area.drag-over {
          border-color: var(--primary);
          background-color: var(--primary-container);
        }

        .upload-area.processing {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .upload-prompt .icon,
        .processing-state .icon {
          font-family: var(--font-icon);
          font-size: 3rem;
          color: var(--primary);
          margin-bottom: var(--unit-3);
        }

        .processing-state .icon.spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .upload-prompt h3,
        .processing-state h3 {
          margin: 0 0 var(--unit-2) 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .upload-prompt p,
        .processing-state p {
          margin: 0 0 var(--unit-3) 0;
          color: var(--on-surface-variant);
        }

        .supported-formats {
          font-size: 0.875rem;
          color: var(--on-surface-variant);
        }

        .uploaded-file {
          display: flex;
          align-items: center;
          gap: var(--unit-2);
          margin-top: var(--unit-3);
          padding: var(--unit-3);
          background-color: var(--surface-container);
          border-radius: var(--unit-2);
        }

        .uploaded-file .icon {
          font-family: var(--font-icon);
          color: var(--primary);
        }

        .court-section {
          margin-bottom: var(--unit-6);
        }

        .section-header {
          margin-bottom: var(--unit-4);
        }

        .section-header h2 {
          margin: 0 0 var(--unit-2) 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .section-header p {
          margin: 0;
          color: var(--on-surface-variant);
        }

        .section-content {
          display: flex;
          flex-direction: column;
          gap: var(--unit-4);
        }

        .info-card {
          background-color: var(--surface-container-low);
          border: 1px solid var(--outline-variant);
          border-radius: var(--unit-3);
          padding: var(--unit-4);
        }

        .info-card h3 {
          margin: 0 0 var(--unit-3) 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .case-member-item,
        .professional-item {
          display: flex;
          align-items: center;
          gap: var(--unit-3);
          padding: var(--unit-3);
          border-radius: var(--unit-2);
          margin-bottom: var(--unit-2);
        }

        .case-member-item:last-child,
        .professional-item:last-child {
          margin-bottom: 0;
        }

        .professional-item .icon {
          font-family: var(--font-icon);
          font-size: 1.5rem;
          color: var(--primary);
        }

        .member-details {
          display: flex;
          gap: var(--unit-4);
          font-size: 0.875rem;
          color: var(--on-surface-variant);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--unit-4);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--unit-1);
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--on-surface-variant);
        }

        .form-group input,
        .form-group select {
          padding: var(--unit-3);
          border: 1px solid var(--outline-variant);
          border-radius: var(--unit-2);
          background-color: var(--surface);
          color: var(--on-surface);
          font-size: 0.875rem;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary);
        }

        .form-group input.ai-generated,
        .form-group select.ai-generated {
          background-color: var(--warning-container);
          border-color: var(--warning);
        }

        .multi-select-chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--unit-2);
        }

        .chip-checkbox {
          cursor: pointer;
        }

        .chip-checkbox input {
          display: none;
        }

        .chip {
          display: inline-block;
          padding: var(--unit-2) var(--unit-3);
          border: 1px solid var(--outline-variant);
          border-radius: var(--unit-4);
          background-color: var(--surface-container);
          color: var(--on-surface);
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .chip.selected {
          background-color: var(--primary);
          color: var(--on-primary);
          border-color: var(--primary);
        }

        .chip.ai-generated {
          background-color: var(--warning-container);
          border-color: var(--warning);
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: var(--unit-2);
          cursor: pointer;
        }

        .toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
          background-color: var(--outline-variant);
          border-radius: 12px;
          transition: background-color 0.2s ease;
        }

        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background-color: white;
          border-radius: 50%;
          transition: transform 0.2s ease;
        }

        .toggle-label input:checked + .toggle-switch {
          background-color: var(--primary);
        }

        .toggle-label input:checked + .toggle-switch::after {
          transform: translateX(20px);
        }

        .hearings-list {
          display: flex;
          flex-direction: column;
          gap: var(--unit-3);
        }

        .hearing-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--unit-4);
          background-color: var(--surface-container);
          border: 1px solid var(--outline-variant);
          border-radius: var(--unit-2);
        }

        .hearing-info strong {
          display: block;
          margin-bottom: var(--unit-1);
          color: var(--on-surface);
        }

        .hearing-details {
          display: flex;
          gap: var(--unit-3);
          font-size: 0.875rem;
          color: var(--on-surface-variant);
        }

        .hearing-actions {
          display: flex;
          gap: var(--unit-2);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--unit-3);
          padding: var(--unit-8);
          text-align: center;
          color: var(--on-surface-variant);
        }

        .empty-state .icon {
          font-family: var(--font-icon);
          font-size: 3rem;
          color: var(--outline);
        }

        .empty-state h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .empty-state p {
          margin: 0;
          font-size: 0.875rem;
        }

        .sticky-action-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: var(--surface);
          border-top: 1px solid var(--outline-variant);
          padding: var(--unit-4);
          z-index: 100;
        }

        .action-bar-content {
          display: flex;
          justify-content: flex-end;
          gap: var(--unit-3);
          max-width: 1200px;
          margin: 0 auto;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--unit-2);
          padding: var(--unit-3) var(--unit-4);
          border: none;
          border-radius: var(--unit-2);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          font-family: var(--font);
        }

        .action-btn.primary {
          background-color: var(--primary);
          color: var(--on-primary);
        }

        .action-btn.primary:hover {
          background-color: var(--primary-hover, var(--primary));
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .action-btn.secondary {
          background-color: var(--surface-container);
          color: var(--on-surface);
          border: 1px solid var(--outline-variant);
        }

        .action-btn.secondary:hover {
          background-color: var(--surface-container-high);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .action-btn.tertiary {
          background-color: transparent;
          color: var(--on-surface-variant);
        }

        .action-btn.tertiary:hover {
          background-color: var(--surface-container-low);
        }

        .action-btn.small {
          padding: var(--unit-2) var(--unit-3);
          font-size: 0.75rem;
        }

        .action-btn.error {
          background-color: var(--error);
          color: var(--on-error);
        }

        .action-btn.error:hover {
          background-color: var(--error-hover, var(--error));
        }

        .action-btn .icon {
          font-family: var(--font-icon);
          font-size: 1rem;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: var(--unit-2);
          margin-top: var(--unit-3);
          padding: var(--unit-3);
          background-color: var(--error-container);
          color: var(--on-error-container);
          border-radius: var(--unit-2);
        }

        .error-message .icon {
          font-family: var(--font-icon);
          color: var(--error);
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .section-content {
            flex-direction: column;
          }

          .action-bar-content {
            flex-direction: column;
          }

          .hearing-item {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--unit-3);
          }

          .hearing-actions {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  )
}
