import { createFileRoute } from '@tanstack/react-router'
import BalanceSheetPage from '@/features/finance/pages/reports/balance-sheet'

export const Route = createFileRoute('/_authenticated/finance/reports/balance-sheet')({
  component: BalanceSheetPage,
})
