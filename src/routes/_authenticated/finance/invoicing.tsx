import { createFileRoute } from '@tanstack/react-router'
import InvoicingPage from '@/features/finance/pages/invoicing'

export const Route = createFileRoute('/_authenticated/finance/invoicing')({
  component: InvoicingPage,
})
