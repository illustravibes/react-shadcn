import { createFileRoute } from '@tanstack/react-router'
import ExpensesPage from '@/features/finance/pages/expenses'

export const Route = createFileRoute('/_authenticated/finance/expenses')({
  component: ExpensesPage,
})
