import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'CCWIS - Child Welfare Information System',
  description: 'Comprehensive Child Welfare Information System for state agencies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <div className="nav-container">
            <div className="nav-brand">
              <h1>CCWIS</h1>
            </div>
            <ul className="nav-links">
              <li><Link href="/">My Caseload</Link></li>
              <li><Link href="/cases">Cases</Link></li>
              <li><Link href="/supervisor">Supervisor Dashboard</Link></li>
              <li><Link href="/referrals">Referrals</Link></li>
            </ul>
            <div className="nav-user">
              <div className="user-info">
                <span className="user-name">Olivia Rodriguez</span>
                <span className="user-role">Caseworker</span>
              </div>
            </div>
          </div>
        </nav>
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--unit-4)' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
