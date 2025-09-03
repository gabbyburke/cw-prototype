'use client'

import { useState, useEffect } from 'react'
import { Case, Person } from '../lib/api'

interface LivingArrangementsTableProps {
  case_: Case
}

interface PlacementData {
  placementType: string
  caregiverName: string
  startDate: string
  endDate: string
  circumstancesOfRemoval: string
  livingArrangementAtRemoval: string
  allegedSexTrafficking: boolean
  specialNeeds: boolean
  specialNeedsDetails: string
}

const PLACEMENT_TYPES = [
  'Home',
  'Safety Plan - In Home',
  'Safety Plan - Out of Home',
  'Detention',
  'Family Foster Care - Fictive Kin',
  'Family Foster Care - Relative',
  'Family Foster Care - Standard',
  'Family Foster Care - Therapeutic',
  'Habilitation Home',
  'Hospital',
  'Jail',
  'Job Corp',
  'Neurodevelopmental and Comorbid Conditions (NACC)',
  'Psychiatric Medical Institutions for Children (PMIC)',
  'Psychiatric Hospital',
  'Qualified Residential Treatment Program (QRTP)',
  'Runaway',
  'Shelter Care',
  'Substance Use Facility',
  'Supervised Apartment Living - Clustered (SAL)',
  'Supervised Apartment Living - Scattered (SAL)',
  'Specialized Juvenile Delinquent Program (SJDP)',
  'State Institution - Evaluation',
  'State Institution - Regular',
  'Trial Home Visit',
  'Other Living Arrangement'
]

export default function LivingArrangementsTable({ case_ }: LivingArrangementsTableProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)
  const [placementData, setPlacementData] = useState<Record<string, PlacementData>>({})

  // Get children from the case
  const getChildren = () => {
    if (!case_.persons) return []
    return case_.persons.filter(person => 
      person.role.toLowerCase() === 'client' || person.role.toLowerCase() === 'child'
    )
  }

  const children = getChildren()

  // Initialize placement data for each child
  useEffect(() => {
    const initialData: Record<string, PlacementData> = {}
    children.forEach(child => {
      initialData[child.person_id] = {
        placementType: 'Home',
        caregiverName: '',
        startDate: '',
        endDate: '',
        circumstancesOfRemoval: '',
        livingArrangementAtRemoval: '',
        allegedSexTrafficking: false,
        specialNeeds: false,
        specialNeedsDetails: ''
      }
    })
    setPlacementData(initialData)
  }, [children.length])

  const handleToggleExpand = (childId: string) => {
    setExpandedRowId(expandedRowId === childId ? null : childId)
  }

  const updatePlacementData = (childId: string, field: keyof PlacementData, value: any) => {
    setPlacementData(prev => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        [field]: value
      }
    }))
  }

  const getPermancencyGoal = (placementType: string) => {
    return placementType === 'Home' ? 'Remain in Home' : 'Return Home'
  }

  const getFlags = (childId: string) => {
    const data = placementData[childId]
    if (!data) return []
    
    const flags = []
    if (data.allegedSexTrafficking) flags.push('🚩 Sex Trafficking')
    if (data.specialNeeds) flags.push('⚠️ Special Needs')
    return flags
  }

  const isOutOfHome = (placementType: string) => {
    return placementType !== 'Home' && placementType !== 'Safety Plan - In Home'
  }

  const handleSavePlacement = (childId: string) => {
    // TODO: Save placement data to API
    console.log('Saving placement for child:', childId, placementData[childId])
    setExpandedRowId(null)
  }

  if (children.length === 0) {
    return (
      <div className="empty-state">
        <span className="icon">child_care</span>
        <h3>No Children Found</h3>
        <p>No children were found in this case. Please add children in the Associations tab first.</p>
      </div>
    )
  }

  return (
    <div className="living-arrangements-table">
      <div className="table-header">
        <h3>Living Arrangements</h3>
        <p>Manage current living arrangements and placement information for all children in this case.</p>
      </div>

      <table className="arrangements-table">
        <thead>
          <tr>
            <th>Child Name</th>
            <th>Current Placement</th>
            <th>Permanency Goal</th>
            <th>Flags</th>
            <th>Actions</th>
          </tr>
        </thead>
        {children.map(child => {
          const data = placementData[child.person_id] || {}
          const isExpanded = expandedRowId === child.person_id
          const flags = getFlags(child.person_id)

          return (
            <tbody key={child.person_id}>
              {/* Summary Row */}
              <tr className="summary-row">
                <td>
                  <strong>{child.first_name} {child.last_name}</strong>
                  {child.date_of_birth && (
                    <div className="child-age">
                      Age: {Math.floor((new Date().getTime() - new Date(child.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}
                    </div>
                  )}
                </td>
                <td>
                  <div className="placement-summary">
                    {data.placementType || 'Home'}
                    {data.caregiverName && (
                      <div className="caregiver-name">with {data.caregiverName}</div>
                    )}
                  </div>
                </td>
                <td>
                  <span className="permanency-goal">
                    {getPermancencyGoal(data.placementType || 'Home')}
                  </span>
                </td>
                <td>
                  <div className="flags-column">
                    {flags.map((flag, index) => (
                      <span key={index} className="flag-item">{flag}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <button 
                    onClick={() => handleToggleExpand(child.person_id)}
                    className="action-btn small secondary"
                  >
                    <span className="icon">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                    {isExpanded ? 'Hide Details' : 'Update Placement'}
                  </button>
                </td>
              </tr>

              {/* Expanded Form Row */}
              {isExpanded && (
                <tr className="expanded-row">
                  <td colSpan={5}>
                    <div className="placement-form">
                      <h4>Update Placement for {child.first_name} {child.last_name}</h4>
                      
                      <div className="form-section">
                        <h5>Current Placement</h5>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Placement Type *</label>
                            <select
                              value={data.placementType || 'Home'}
                              onChange={(e) => updatePlacementData(child.person_id, 'placementType', e.target.value)}
                              className="placement-type-select"
                            >
                              {PLACEMENT_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label>Caregiver/Facility Name</label>
                            <input
                              type="text"
                              value={data.caregiverName || ''}
                              onChange={(e) => updatePlacementData(child.person_id, 'caregiverName', e.target.value)}
                              placeholder="Enter caregiver or facility name"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Placement Start Date</label>
                            <input
                              type="date"
                              value={data.startDate || ''}
                              onChange={(e) => updatePlacementData(child.person_id, 'startDate', e.target.value)}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Placement End Date</label>
                            <input
                              type="date"
                              value={data.endDate || ''}
                              onChange={(e) => updatePlacementData(child.person_id, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Conditional Removal Information */}
                      {isOutOfHome(data.placementType || 'Home') && (
                        <div className="form-section">
                          <h5>Removal Information</h5>
                          <div className="form-grid">
                            <div className="form-group full-width">
                              <label>Living Arrangement at Time of Removal</label>
                              <input
                                type="text"
                                value={data.livingArrangementAtRemoval || ''}
                                onChange={(e) => updatePlacementData(child.person_id, 'livingArrangementAtRemoval', e.target.value)}
                                placeholder="Describe where the child was living before removal"
                              />
                            </div>
                            
                            <div className="form-group full-width">
                              <label>Circumstances of Removal</label>
                              <textarea
                                value={data.circumstancesOfRemoval || ''}
                                onChange={(e) => updatePlacementData(child.person_id, 'circumstancesOfRemoval', e.target.value)}
                                placeholder="Describe the circumstances that led to the child's removal"
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Special Considerations */}
                      <div className="form-section">
                        <h5>Special Considerations</h5>
                        <div className="form-grid">
                          <div className="form-group">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={data.allegedSexTrafficking || false}
                                onChange={(e) => updatePlacementData(child.person_id, 'allegedSexTrafficking', e.target.checked)}
                              />
                              Alleged Sex Trafficking Victim
                            </label>
                          </div>
                          
                          <div className="form-group">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={data.specialNeeds || false}
                                onChange={(e) => updatePlacementData(child.person_id, 'specialNeeds', e.target.checked)}
                              />
                              Special Needs
                            </label>
                          </div>
                          
                          {data.specialNeeds && (
                            <div className="form-group full-width">
                              <label>Special Needs Details</label>
                              <textarea
                                value={data.specialNeedsDetails || ''}
                                onChange={(e) => updatePlacementData(child.person_id, 'specialNeedsDetails', e.target.value)}
                                placeholder="Describe the child's special needs"
                                rows={2}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-actions">
                        <button 
                          onClick={() => handleSavePlacement(child.person_id)}
                          className="action-btn primary"
                        >
                          <span className="icon">save</span>
                          Save Placement
                        </button>
                        <button 
                          onClick={() => setExpandedRowId(null)}
                          className="action-btn secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          )
        })}
      </table>

      <style jsx>{`
        .living-arrangements-table {
          width: 100%;
        }

        .table-header {
          margin-bottom: var(--unit-4);
        }

        .table-header h3 {
          margin: 0 0 var(--unit-2) 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .table-header p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--on-surface-variant);
        }

        .arrangements-table {
          width: 100%;
          border-collapse: collapse;
          background-color: var(--surface);
          border-radius: var(--unit-2);
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .arrangements-table thead th {
          background-color: var(--surface-container);
          color: var(--on-surface-variant);
          font-weight: 600;
          text-align: left;
          padding: var(--unit-3);
          border-bottom: 1px solid var(--outline-variant);
          font-size: 0.875rem;
        }

        .summary-row td {
          padding: var(--unit-3);
          border-bottom: 1px solid var(--outline-variant);
          color: var(--on-surface);
          vertical-align: top;
        }

        .summary-row:hover {
          background-color: var(--surface-container-low);
        }

        .child-age {
          font-size: 0.75rem;
          color: var(--on-surface-variant);
          margin-top: var(--unit-1);
        }

        .placement-summary {
          font-weight: 500;
        }

        .caregiver-name {
          font-size: 0.75rem;
          color: var(--on-surface-variant);
          margin-top: var(--unit-1);
        }

        .permanency-goal {
          display: inline-block;
          padding: var(--unit-1) var(--unit-2);
          background-color: var(--primary-container);
          color: var(--on-primary-container);
          border-radius: var(--unit-1);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .flags-column {
          display: flex;
          flex-direction: column;
          gap: var(--unit-1);
        }

        .flag-item {
          font-size: 0.75rem;
          white-space: nowrap;
        }

        .expanded-row td {
          padding: 0;
          border-bottom: 1px solid var(--outline-variant);
        }

        .placement-form {
          padding: var(--unit-4);
          background-color: var(--surface-container-low);
        }

        .placement-form h4 {
          margin: 0 0 var(--unit-4) 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .form-section {
          margin-bottom: var(--unit-4);
        }

        .form-section h5 {
          margin: 0 0 var(--unit-3) 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--on-surface-variant);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--unit-3);
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

        .checkbox-label {
          flex-direction: row !important;
          align-items: center;
          gap: var(--unit-2) !important;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: var(--unit-2);
          border: 1px solid var(--outline-variant);
          border-radius: var(--unit-1);
          background-color: var(--surface);
          color: var(--on-surface);
          font-size: 0.875rem;
          font-family: var(--font);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
        }

        .placement-type-select {
          min-width: 250px;
        }

        .form-actions {
          display: flex;
          gap: var(--unit-2);
          justify-content: flex-end;
          margin-top: var(--unit-4);
          padding-top: var(--unit-4);
          border-top: 1px solid var(--outline-variant);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--unit-3);
          padding: var(--unit-8);
          color: var(--on-surface-variant);
          text-align: center;
        }

        .empty-state .icon {
          font-family: var(--font-icon);
          font-size: 3rem;
          color: var(--outline);
        }

        .empty-state h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .empty-state p {
          margin: 0;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .arrangements-table {
            font-size: 0.75rem;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
