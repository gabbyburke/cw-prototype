'use client'

import { usePathname } from 'next/navigation'
import { useContext } from 'react'
import FloatingActionButton from './FloatingActionButton'
import { CaseDataContext } from '../contexts/CaseDataContext'

export default function ClientLayout() {
  const pathname = usePathname()
  // Try to get the context, but don't throw if it's not available
  const caseDataContext = useContext(CaseDataContext)

  const handleFabClick = () => {
    switch (pathname) {
      case '/cpw':
        console.log('CPW FAB clicked!');
        break;
      case '/cpw-supervisor':
        console.log('CPW Supervisor FAB clicked!');
        break;
      case '/swcm-supervisor':
        console.log('SWCM Supervisor FAB clicked!');
        break;
      case '/':
        console.log('SWCM FAB clicked!');
        // If we have access to the case data context, log all cases as JSON
        if (caseDataContext && caseDataContext.getAllCasesAsJSON) {
          const casesJSON = caseDataContext.getAllCasesAsJSON();
          console.log('=== ALL CASES DATA (JSON FORMAT) ===');
          console.log(casesJSON);
          console.log('=== END OF CASES DATA ===');
          
          // Also log a summary
          const allCases = caseDataContext.allCases;
          console.log(`Total cases in system: ${allCases.length}`);
          console.log(`Active cases: ${allCases.filter(c => c.status === 'Active').length}`);
          console.log(`Case Setup: ${allCases.filter(c => c.status === 'Case Setup').length}`);
          console.log(`Closed cases: ${allCases.filter(c => c.status === 'Closed').length}`);
        } else {
          console.log('Case data not available. Please ensure you are on the SWCM Dashboard page and cases have been loaded.');
        }
        break;
      default:
        console.log('AI Assistant FAB clicked!');
    }
  };

  return (
    <FloatingActionButton onClick={handleFabClick} />
  );
}
