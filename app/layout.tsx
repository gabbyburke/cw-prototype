import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'VISION - Child Welfare Information System',
  description: 'VISION - Comprehensive Child Welfare Information System for state agencies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          {/* Left Sidebar Navigation */}
          <aside className="sidebar">
            <div className="sidebar-header">
              <h1 className="sidebar-brand">VISION</h1>
              <p className="sidebar-subtitle">Child Welfare System</p>
            </div>
            
            <nav className="sidebar-nav">
              <div className="nav-section">
                <div className="nav-section-header">
                  <span className="section-label">User Personas</span>
                </div>
                <ul className="nav-list">
                  <li><Link href="/cpw" className="nav-link">
                    <span className="icon">fact_check</span>
                    <span>CPW</span>
                  </Link></li>
                  <li><Link href="/cpw-supervisor" className="nav-link">
                    <span className="icon">approval</span>
                    <span>CPW Supervisor</span>
                  </Link></li>
                  <li><Link href="/swcm-supervisor" className="nav-link">
                    <span className="icon">supervisor_account</span>
                    <span>SWCM Supervisor</span>
                  </Link></li>
                  <li><Link href="/" className="nav-link">
                    <span className="icon">dashboard</span>
                    <span>SWCM</span>
                  </Link></li>
                </ul>
              </div>
            </nav>
            
          </aside>
          
          {/* Main Content Area */}
          <div className="main-layout">
            <header className="top-header">
              <div className="header-content">
                <div className="header-spacer"></div>
                <div className="header-actions">
                  <button className="action-btn secondary">
                    <span className="icon">notifications</span>
                  </button>
                  <button className="action-btn secondary">
                    <span className="icon">settings</span>
                  </button>
                  <button className="action-btn secondary">
                    <span className="icon">person</span>
                  </button>
                </div>
              </div>
            </header>
            
            <main className="main-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
