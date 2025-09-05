'use client'

import { useState, useEffect } from 'react'
import { Case, getCasesByWorker, addCaseNote } from '@/lib/api'
import { getCurrentUser } from '@/lib/mockData'

interface AddCaseNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddCaseNoteModal({ isOpen, onClose, onSuccess }: AddCaseNoteModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [noteText, setNoteText] = useState('')
  const [noteType, setNoteType] = useState('General')
  const [cases, setCases] = useState<Case[]>([])
  const [filteredCases, setFilteredCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadCases()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCases(cases)
    } else {
      const filtered = cases.filter(case_ => 
        case_.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.primary_child.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.case_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCases(filtered)
    }
  }, [searchTerm, cases])

  const loadCases = async () => {
    setLoading(true)
    setError(null)
    
    const currentUser = getCurrentUser()
    const response = await getCasesByWorker(currentUser.name)
    
    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      setCases(response.data.cases)
      setFilteredCases(response.data.cases)
    }
    
    setLoading(false)
  }

  const handleCaseSelect = (case_: Case) => {
    setSelectedCase(case_)
    setSearchTerm(`${case_.family_name} (${case_.case_number})`)
    setFilteredCases([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCase || !noteText.trim()) {
      setError('Please select a case and enter a note')
      return
    }

    setSubmitting(true)
    setError(null)

    const response = await addCaseNote(selectedCase.case_id, noteText.trim(), noteType)

    if (response.error) {
      setError(response.error)
    } else {
      // Reset form
      setSelectedCase(null)
      setSearchTerm('')
      setNoteText('')
      setNoteType('General')
      setFilteredCases(cases)
      onSuccess()
      onClose()
    }

    setSubmitting(false)
  }

  const handleClose = () => {
    setSelectedCase(null)
    setSearchTerm('')
    setNoteText('')
    setNoteType('General')
    setError(null)
    setFilteredCases(cases)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Case Note</h2>
          <button className="modal-close" onClick={handleClose}>
            <span className="icon">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="error-message">
              <span className="icon">error</span>
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="case-search">Select Case</label>
            <div className="case-search-container">
              <input
                id="case-search"
                type="text"
                placeholder="Search by family name, case number, or child name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                disabled={loading}
              />
              {loading && (
                <div className="search-loading">
                  <span className="icon">hourglass_empty</span>
                </div>
              )}
            </div>

            {filteredCases.length > 0 && searchTerm && !selectedCase && (
              <div className="case-search-results">
                {filteredCases.slice(0, 10).map((case_) => (
                  <div
                    key={case_.case_id}
                    className="case-search-result"
                    onClick={() => handleCaseSelect(case_)}
                  >
                    <div className="case-result-main">
                      <strong>{case_.family_name}</strong>
                      <span className="case-number">({case_.case_number})</span>
                    </div>
                    <div className="case-result-details">
                      <span>Primary Child: {case_.primary_child}</span>
                      <span className={`status-badge ${case_.status.toLowerCase().replace(' ', '-')}`}>
                        {case_.status}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredCases.length > 10 && (
                  <div className="case-search-more">
                    +{filteredCases.length - 10} more results. Continue typing to narrow down.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="note-type">Note Type</label>
            <select
              id="note-type"
              value={noteType}
              onChange={(e) => setNoteType(e.target.value)}
              className="form-control"
            >
              <option value="General">General</option>
              <option value="Contact">Contact</option>
              <option value="Assessment">Assessment</option>
              <option value="Visit">Visit</option>
              <option value="Court">Court</option>
              <option value="Safety">Safety</option>
              <option value="Service">Service</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="note-text">Case Note</label>
            <textarea
              id="note-text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your case note here..."
              className="form-control"
              rows={6}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="action-btn secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-btn primary"
              disabled={!selectedCase || !noteText.trim() || submitting}
            >
              {submitting ? (
                <>
                  <span className="icon">hourglass_empty</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="icon">save</span>
                  Save Note
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
