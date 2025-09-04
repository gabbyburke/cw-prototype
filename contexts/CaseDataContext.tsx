'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Case } from '../lib/api'

interface CaseDataContextType {
  allCases: Case[]
  setAllCases: (cases: Case[]) => void
  getAllCasesAsJSON: () => string
}

export const CaseDataContext = createContext<CaseDataContextType | undefined>(undefined)

export function CaseDataProvider({ children }: { children: ReactNode }) {
  const [allCases, setAllCases] = useState<Case[]>([])

  const getAllCasesAsJSON = () => {
    // Format the cases data for clean JSON output
    const formattedCases = allCases.map(case_ => ({
      caseId: case_.case_id,
      caseNumber: case_.case_number,
      caseName: case_.case_display_name || case_.family_name,
      status: case_.status,
      intakeDate: case_.created_date,
      allegations: {
        type: case_.allegation_type,
        description: case_.allegation_description
      },
      children: case_.persons?.filter(p => p.role === 'child').map(child => ({
        firstName: child.first_name,
        lastName: child.last_name,
        dateOfBirth: child.date_of_birth,
        indicators: child.indicators || []
      })) || [],
      allIndicators: (() => {
        const indicators = new Set<string>()
        if (case_.persons) {
          case_.persons.forEach(person => {
            if (person.indicators) {
              person.indicators.forEach(indicator => indicators.add(indicator))
            }
          })
        }
        return Array.from(indicators)
      })(),
      assignedWorkers: {
        primary: case_.assigned_worker || 'Unassigned',
        supervisor: case_.assigned_supervisor || null
      },
      lastUpdated: case_.last_updated
    }))

    return JSON.stringify(formattedCases, null, 2)
  }

  return (
    <CaseDataContext.Provider value={{ allCases, setAllCases, getAllCasesAsJSON }}>
      {children}
    </CaseDataContext.Provider>
  )
}

export function useCaseData() {
  const context = useContext(CaseDataContext)
  if (context === undefined) {
    throw new Error('useCaseData must be used within a CaseDataProvider')
  }
  return context
}
