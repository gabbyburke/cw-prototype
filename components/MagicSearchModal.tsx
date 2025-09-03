'use client'

import { useState, useEffect } from 'react'
import { Person, searchPersons } from '../lib/api'

interface MagicSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPerson: (person: Person) => void
}

export default function MagicSearchModal({ isOpen, onClose, onSelectPerson }: MagicSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Person[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    state_id: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    phone_number: ''
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
      const response = await searchPersons(query)
      if (response.error) {
        setError(response.error)
        setSearchResults([])
      } else if (response.data) {
        setSearchResults(response.data.persons)
      }
    } catch (err) {
      setError('Failed to search people')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleAdvancedSearch = () => {
    // Combine all filled fields into a search query
    const searchTerms = []
    if (advancedFilters.first_name) searchTerms.push(advancedFilters.first_name)
    if (advancedFilters.last_name) searchTerms.push(advancedFilters.last_name)
    if (advancedFilters.state_id) searchTerms.push(advancedFilters.state_id)
    if (advancedFilters.phone_number) searchTerms.push(advancedFilters.phone_number)
    if (advancedFilters.city) searchTerms.push(advancedFilters.city)
    
    if (searchTerms.length > 0) {
      handleSearch(searchTerms.join(' '))
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const handleSelectPerson = (person: Person) => {
    onSelectPerson(person)
    onClose()
  }

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A'
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
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
            <div className="magic-header-icon">🔍</div>
            <div>
              <h2>Person Search</h2>
              <p>Search for existing people to add to this case</p>
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
                placeholder="Enter person details..."
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
                    <label>First Name</label>
                    <input
                      type="text"
                      value={advancedFilters.first_name}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, first_name: e.target.value})}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={advancedFilters.last_name}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, last_name: e.target.value})}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={advancedFilters.date_of_birth}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, date_of_birth: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>State ID Number</label>
                    <input
                      type="text"
                      value={advancedFilters.state_id}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, state_id: e.target.value})}
                      placeholder="Enter state ID"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={advancedFilters.address}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, address: e.target.value})}
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={advancedFilters.city}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, city: e.target.value})}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <select
                      value={advancedFilters.state}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, state: e.target.value})}
                    >
                      <option value="">Select State</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="WI">Wisconsin</option>
                      <option value="MI">Michigan</option>
                      <option value="IA">Iowa</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      value={advancedFilters.zipcode}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, zipcode: e.target.value})}
                      placeholder="Enter zip code"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={advancedFilters.phone_number}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, phone_number: e.target.value})}
                      placeholder="Enter phone number"
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
                      first_name: '', last_name: '', date_of_birth: '', 
                      state_id: '', address: '', city: '', state: '', 
                      zipcode: '', phone_number: ''
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
                Searching people...
              </div>
            )}

            {searchQuery.length >= 2 && !loading && searchResults.length === 0 && !error && (
              <div className="no-results">
                <span className="icon">search_off</span>
                <h3>No people found</h3>
                <p>No people match your search criteria. Try different search terms or use advanced search.</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="results-container">
                <h4>Found {searchResults.length} person(s)</h4>
                <div className="people-list">
                  {searchResults.map((person) => (
                    <div key={person.person_id} className="person-card">
                      <div className="person-header">
                        <div className="person-name">
                          <strong>{person.first_name} {person.last_name}</strong>
                        </div>
                        <div className="person-id">
                          ID: {person.person_id}
                        </div>
                      </div>
                      
                      <div className="person-details">
                        <div className="detail-row">
                          <span className="label">Date of Birth:</span>
                          <span className="value">{formatDate(person.date_of_birth)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Age:</span>
                          <span className="value">{calculateAge(person.date_of_birth)} years old</span>
                        </div>
                        {person.role && (
                          <div className="detail-row">
                            <span className="label">Current Role:</span>
                            <span className="value">{person.role}</span>
                          </div>
                        )}
                        {person.contact_info?.phone && (
                          <div className="detail-row">
                            <span className="label">Phone:</span>
                            <span className="value">{person.contact_info.phone}</span>
                          </div>
                        )}
                        {person.contact_info?.address && (
                          <div className="detail-row">
                            <span className="label">Address:</span>
                            <span className="value">{person.contact_info.address}</span>
                          </div>
                        )}
                        {person.contact_info?.email && (
                          <div className="detail-row">
                            <span className="label">Email:</span>
                            <span className="value">{person.contact_info.email}</span>
                          </div>
                        )}
                        {person.indicators && person.indicators.length > 0 && (
                          <div className="detail-row">
                            <span className="label">Indicators:</span>
                            <span className="value">{person.indicators.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      <div className="person-actions">
                        <button 
                          onClick={() => handleSelectPerson(person)}
                          className="action-btn primary"
                        >
                          <span className="icon">person_add</span>
                          Select Person
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
                <h3>Search for People Matches</h3>
                <p>Enter details about a person to search for them across JARVIS and VISION.</p>
                <ul>
                  <li>Add a person's name and date of birth to begin identifying matches</li>
                  <li>Use advanced search for more specific criteria</li>
                  <li>Select a person to import their information into the case automatically</li>
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
