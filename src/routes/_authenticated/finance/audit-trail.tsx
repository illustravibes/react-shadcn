import { createFileRoute } from '@tanstack/react-router'
import AuditTrailPage from '@/features/finance/pages/audit-trail'

export const Route = createFileRoute('/_authenticated/finance/audit-trail')({
  component: AuditTrailPage,
})
