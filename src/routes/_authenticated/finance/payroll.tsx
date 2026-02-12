import { createFileRoute } from '@tanstack/react-router'
import PayrollPage from '@/features/finance/pages/payroll'

export const Route = createFileRoute('/_authenticated/finance/payroll')({
  component: PayrollPage,
})
