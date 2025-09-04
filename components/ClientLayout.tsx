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
        break;
      default:
        console.log('AI Assistant FAB clicked!');
    }
  };

  return (
    <FloatingActionButton onClick={handleFabClick} />
  );
}
