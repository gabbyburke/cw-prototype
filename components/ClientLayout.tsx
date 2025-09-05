'use client'

import { usePathname } from 'next/navigation'
import FloatingActionButton from './FloatingActionButton'

export default function ClientLayout() {
  const pathname = usePathname()

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
        const allCasesData = localStorage.getItem('allCases');
        if (allCasesData) {
          const allCases = JSON.parse(allCasesData);
          if (allCases && allCases.length > 0) {
            console.log('=== ALL CASES DATA (JSON FORMAT) ===');
            console.log(JSON.stringify(allCases, null, 2));
            console.log('=== END OF CASES DATA ===');
            
            // Also log a summary
            console.log(`Total cases in system: ${allCases.length}`);
            console.log(`Active cases: ${allCases.filter(c => c.status === 'Active').length}`);
            console.log(`Case Setup: ${allCases.filter(c => c.status === 'Case Setup').length}`);
            console.log(`Closed cases: ${allCases.filter(c => c.status === 'Closed').length}`);
          } else {
            console.log('No cases found in the system. The case data array is empty.');
          }
        } else {
          console.log('Case data not available in local storage. Please ensure you have loaded the SWCM Dashboard page at least once.');
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
