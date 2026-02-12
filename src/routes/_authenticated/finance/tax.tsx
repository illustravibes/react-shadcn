import { createFileRoute } from '@tanstack/react-router'
import TaxPage from '@/features/finance/pages/tax'

export const Route = createFileRoute('/_authenticated/finance/tax')({
  component: TaxPage,
})
