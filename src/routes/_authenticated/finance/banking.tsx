import { createFileRoute } from '@tanstack/react-router'
import BankingPage from '@/features/finance/pages/banking'

export const Route = createFileRoute('/_authenticated/finance/banking')({
  component: BankingPage,
})
