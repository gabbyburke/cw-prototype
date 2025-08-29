'use client'

import { useState, useEffect } from 'react'
import { MagicButtonData, searchMagicButtonData } from '../lib/api'

interface MagicSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectIncident: (incident: MagicButtonData) => void
}

export default function MagicSearchModal({ isOpen, onClose, onSelectIncident }: MagicSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<MagicButtonData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    child_name: '',
    parent_name: '',
    county: '',
    allegation_type: '',
    date_from: '',
    date_to: ''
  })

  // Debounced search
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        handleSearch(searchQuery)
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleSearch = async (query: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await searchMagicButtonData(query)
      if (response.error) {
        setError(response.error)
        setSearchResults([])
      } else if (response.data) {
        setSearchResults(response.data.incidents)
      }
    } catch (err) {
      setError('Failed to search incidents')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleAdvancedSearch = () => {
    // For now, just use the child_name filter as a basic implementation
    if (advancedFilters.child_name) {
      handleSearch(advancedFilters.child_name)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const handleSelectIncident = (incident: MagicButtonData) => {
    onSelectIncident(incident)
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container large scrollable">
        <div className="modal-header magic-modal-header">
          <div className="magic-header-content">
            <div className="magic-header-icon">✨</div>
            <div>
              <h2>Magic Button</h2>
              <p>Search JARVIS incidents to import case data</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close">
            <span className="icon">close</span>
          </button>
        </div>

        <div className="modal-body">
          <div className="magic-search-section">
            <div className="magic-search-bar">
              <span className="search-icon icon">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter incident number (e.g., INC-2024-001234)..."
                className="magic-search-input"
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="clear-search-btn"
                >
                  <span className="icon">close</span>
                </button>
              )}
            </div>

            <div className="search-options">
              <button 
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className={`advanced-search-toggle ${showAdvancedSearch ? 'active' : ''}`}
              >
                <span className="icon">tune</span>
                Advanced Search
                <span className="icon">{showAdvancedSearch ? 'expand_less' : 'expand_more'}</span>
              </button>
            </div>

            {showAdvancedSearch && (
              <div className="advanced-search-form">
                <h4>Advanced Search Options</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Child Name</label>
                    <input
                      type="text"
                      value={advancedFilters.child_name}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, child_name: e.target.value})}
                      placeholder="Enter child's name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Parent Name</label>
                    <input
                      type="text"
                      value={advancedFilters.parent_name}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, parent_name: e.target.value})}
                      placeholder="Enter parent's name"
                    />
                  </div>
                  <div className="form-group">
                    <label>County</label>
                    <input
                      type="text"
                      value={advancedFilters.county}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, county: e.target.value})}
                      placeholder="Enter county"
                    />
                  </div>
                  <div className="form-group">
                    <label>Allegation Type</label>
                    <select
                      value={advancedFilters.allegation_type}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, allegation_type: e.target.value})}
                    >
                      <option value="">All Types</option>
                      <option value="Physical abuse">Physical Abuse</option>
                      <option value="Sexual abuse">Sexual Abuse</option>
                      <option value="Neglect">Neglect</option>
                      <option value="Emotional abuse">Emotional Abuse</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date From</label>
                    <input
                      type="date"
                      value={advancedFilters.date_from}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, date_from: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date To</label>
                    <input
                      type="date"
                      value={advancedFilters.date_to}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, date_to: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button onClick={handleAdvancedSearch} className="action-btn primary">
                    <span className="icon">search</span>
                    Search
                  </button>
                  <button 
                    onClick={() => setAdvancedFilters({
                      child_name: '', parent_name: '', county: '', 
                      allegation_type: '', date_from: '', date_to: ''
                    })}
                    className="action-btn secondary"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="search-results-section">
            {error && (
              <div className="error-message">
                <span className="icon">error</span>
                {error}
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <span className="icon">hourglass_empty</span>
                Searching JARVIS incidents...
              </div>
            )}

            {searchQuery.length >= 2 && !loading && searchResults.length === 0 && !error && (
              <div className="no-results">
                <span className="icon">search_off</span>
                <h3>No incidents found</h3>
                <p>No incidents match your search criteria. Try a different incident number or use advanced search.</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="results-container">
                <h4>Found {searchResults.length} incident(s)</h4>
                <div className="incidents-list">
                  {searchResults.map((incident) => (
                    <div key={incident.incident_number} className="incident-card">
                      <div className="incident-header">
                        <div className="incident-number">
                          <strong>{incident.incident_number}</strong>
                        </div>
                        <div className="incident-date">
                          Intake: {formatDate(incident.intake_date)}
                        </div>
                      </div>
                      
                      <div className="incident-details">
                        <div className="detail-row">
                          <span className="label">Child:</span>
                          <span className="value">{incident.child_first_names} {incident.child_last_names}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Age:</span>
                          <span className="value">{incident.age_calculated} years old</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Parents:</span>
                          <span className="value">{incident.parent_first_names} {incident.parent_last_names}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Allegations:</span>
                          <span className="value">{incident.allegations}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">County:</span>
                          <span className="value">{incident.residence_county}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">CPS Worker:</span>
                          <span className="value">{incident.cps_worker}</span>
                        </div>
                        {incident.perpetrators && (
                          <div className="detail-row">
                            <span className="label">Perpetrator:</span>
                            <span className="value perpetrator">{incident.perpetrators}</span>
                          </div>
                        )}
                      </div>

                      <div className="incident-actions">
                        <button 
                          onClick={() => handleSelectIncident(incident)}
                          className="action-btn primary"
                        >
                          <span className="icon">download</span>
                          Import Case Data
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchQuery.length < 2 && (
              <div className="search-help">
                <span className="icon">info</span>
                <h3>Search JARVIS Incidents</h3>
                <p>Enter an incident number to search for cases from the JARVIS intake system. The Magic Button will pull in all relevant case information to help with your case setup.</p>
                <ul>
                  <li>Start typing an incident number (minimum 2 characters)</li>
                  <li>Use advanced search for more specific criteria</li>
                  <li>Select an incident to import all case data automatically</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-actions">
            <button onClick={onClose} className="action-btn secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
