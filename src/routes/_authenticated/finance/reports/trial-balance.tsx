import { createFileRoute } from '@tanstack/react-router'
import TrialBalancePage from '@/features/finance/pages/reports/trial-balance'

export const Route = createFileRoute('/_authenticated/finance/reports/trial-balance')({
  component: TrialBalancePage,
})
