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
                <h3 className="nav-section-title">Case Management</h3>
                <ul className="nav-list">
                  <li><Link href="/cases" className="nav-link">
                    <span className="icon">folder</span>
                    <span>Cases</span>
                  </Link></li>
                  <li><Link href="/supervisor" className="nav-link">
                    <span className="icon">supervisor_account</span>
                    <span>Supervisor Dashboard</span>
                  </Link></li>
                </ul>
              </div>
              
              <div className="nav-section">
                <h3 className="nav-section-title">Intake & Referrals</h3>
                <ul className="nav-list">
                  <li><Link href="/referrals" className="nav-link">
                    <span className="icon">assignment</span>
                    <span>Referrals</span>
                  </Link></li>
                  <li><Link href="/intake" className="nav-link">
                    <span className="icon">call</span>
                    <span>Intake</span>
                  </Link></li>
                </ul>
              </div>
              
              <div className="nav-section">
                <h3 className="nav-section-title">Workflow</h3>
                <ul className="nav-list">
                  <li><Link href="/cpw" className="nav-link">
                    <span className="icon">fact_check</span>
                    <span>CPW Review</span>
                  </Link></li>
                  <li><Link href="/cpw-supervisor" className="nav-link">
                    <span className="icon">approval</span>
                    <span>CPW Supervisor</span>
                  </Link></li>
                  <li><Link href="/swcm-supervisor" className="nav-link">
                    <span className="icon">assignment_ind</span>
                    <span>SWCM Assignment</span>
                  </Link></li>
                </ul>
              </div>
            </nav>
            
            <div className="sidebar-footer">
              <div className="user-info">
                <div className="user-avatar">
                  <span className="icon">person</span>
                </div>
                <div className="user-details">
                  <span className="user-name">Olivia Rodriguez</span>
                  <span className="user-role">SWCM</span>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main Content Area */}
          <div className="main-layout">
            <header className="top-header">
              <div className="header-content">
                <h1 className="page-title">Dashboard</h1>
                <div className="header-actions">
                  <button className="action-btn secondary">
                    <span className="icon">notifications</span>
                  </button>
                  <button className="action-btn secondary">
                    <span className="icon">settings</span>
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
