import { createFileRoute } from '@tanstack/react-router'
import CurrencyPage from '@/features/finance/pages/currency'

export const Route = createFileRoute('/_authenticated/finance/currency')({
  component: CurrencyPage,
})
