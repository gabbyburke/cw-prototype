'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Person, getPersonById } from '../../../lib/api'

interface PersonPageProps {
  params: {
    personId: string
  }
}

export default function PersonPage({ params }: PersonPageProps) {
  const [person, setPerson] = useState<Person | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPerson()
  }, [params.personId])

  const loadPerson = async () => {
    setLoading(true)
    setError(null)
    
    const response = await getPersonById(params.personId)
    
    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      setPerson(response.data)
    }
    
    setLoading(false)
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getIndicatorIcon = (indicator: string) => {
    switch (indicator.toLowerCase()) {
      case 'allergy': return 'medical_services'
      case 'icwa eligible': return 'diversity_3'
      case 'runaway': return 'directions_run'
      case 'worker safety': return 'security'
      case 'protective order': return 'gavel'
      case 'icpc': return 'swap_horiz'
      case 'safe haven': return 'shield'
      case 'chronic medical condition': return 'local_hospital'
      default: return 'flag'
    }
  }

  const getIndicatorColor = (indicator: string) => {
    switch (indicator.toLowerCase()) {
      case 'allergy': return 'error'
      case 'icwa eligible': return 'tertiary'
      case 'runaway': return 'error'
      case 'worker safety': return 'error'
      case 'protective order': return 'secondary'
      case 'chronic medical condition': return 'secondary'
      default: return 'primary'
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Loading Person Profile...</h1>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Error Loading Person</h1>
          <p className="page-description">{error}</p>
        </div>
        <div className="content-wrapper">
          <Link href="/cpw" className="action-btn secondary">
            <span className="icon">arrow_back</span>
            Back to CPW Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!person) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Person Not Found</h1>
          <p className="page-description">The requested person could not be found.</p>
        </div>
        <div className="content-wrapper">
          <Link href="/cpw" className="action-btn secondary">
            <span className="icon">arrow_back</span>
            Back to CPW Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-with-back">
          <Link href="/cpw" className="back-btn">
            <span className="icon">arrow_back</span>
          </Link>
          <div>
            <h1 className="page-title">{person.first_name} {person.last_name}</h1>
            <p className="page-description">Person Profile</p>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="overview-grid">
          {/* Basic Information */}
          <div className="overview-section">
            <h3>Basic Information</h3>
            <div className="detail-list">
              <div className="detail-item">
                <strong>Full Name</strong>
                <p>{person.first_name} {person.last_name}</p>
              </div>
              <div className="detail-item">
                <strong>Date of Birth</strong>
                <p>{formatDate(person.date_of_birth)}</p>
              </div>
              <div className="detail-item">
                <strong>Age</strong>
                <p>{calculateAge(person.date_of_birth)} years old</p>
              </div>
              <div className="detail-item">
                <strong>Role in Case</strong>
                <p className="person-role">{person.role}</p>
              </div>
              {person.relationship_to_primary_child && (
                <div className="detail-item">
                  <strong>Relationship to Primary Child</strong>
                  <p>{person.relationship_to_primary_child}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="overview-section">
            <h3>Contact Information</h3>
            <div className="detail-list">
              {person.contact_info.phone && (
                <div className="detail-item">
                  <strong>Phone</strong>
                  <p>{person.contact_info.phone}</p>
                </div>
              )}
              {person.contact_info.email && (
                <div className="detail-item">
                  <strong>Email</strong>
                  <p>{person.contact_info.email}</p>
                </div>
              )}
              {person.contact_info.address && (
                <div className="detail-item">
                  <strong>Address</strong>
                  <p>{person.contact_info.address}</p>
                </div>
              )}
              {!person.contact_info.phone && !person.contact_info.email && !person.contact_info.address && (
                <div className="detail-item">
                  <p className="no-data">No contact information available</p>
                </div>
              )}
            </div>
          </div>

          {/* Indicators */}
          {person.indicators && person.indicators.length > 0 && (
            <div className="overview-section">
              <h3>Safety & Risk Indicators</h3>
              <div className="indicators-grid">
                {person.indicators.map((indicator, index) => (
                  <div 
                    key={index}
                    className={`indicator-card ${getIndicatorColor(indicator)}`}
                  >
                    <span className="icon">{getIndicatorIcon(indicator)}</span>
                    <span className="indicator-text">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="person-actions">
          <button className="action-btn primary">
            <span className="icon">edit</span>
            Edit Person
          </button>
          <button className="action-btn secondary">
            <span className="icon">note_add</span>
            Add Note
          </button>
          <button className="action-btn secondary">
            <span className="icon">history</span>
            View History
          </button>
        </div>
      </div>
    </div>
  )
}
