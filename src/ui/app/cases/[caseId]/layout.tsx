import { mockCases } from '../../../lib/mockData'

// Generate static params for all case IDs
export async function generateStaticParams() {
  return mockCases.map((caseItem) => ({
    caseId: caseItem.case_id,
  }))
}

export default function CaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
