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
                <ul className="nav-list">
                  <li><Link href="/" className="nav-link">
                    <span className="icon">dashboard</span>
                    <span>SWCM Dashboard</span>
                  </Link></li>
                  <li><Link href="/supervisor" className="nav-link">
                    <span className="icon">supervisor_account</span>
                    <span>SWCM Supervisor View</span>
                  </Link></li>
                  <li><Link href="/cpw" className="nav-link">
                    <span className="icon">fact_check</span>
                    <span>CPW Dashboard</span>
                  </Link></li>
                  <li><Link href="/cpw-supervisor" className="nav-link">
                    <span className="icon">approval</span>
                    <span>CPW Supervisor View</span>
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
                <h1 className="page-title">SWCM Dashboard</h1>
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
