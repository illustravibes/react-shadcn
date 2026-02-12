import { createFileRoute } from '@tanstack/react-router'
import ProfitLossPage from '@/features/finance/pages/reports/profit-loss'

export const Route = createFileRoute('/_authenticated/finance/reports/profit-loss')({
  component: ProfitLossPage,
})
