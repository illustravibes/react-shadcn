import { createFileRoute } from '@tanstack/react-router'
import PettyCashPage from '@/features/finance/pages/petty-cash'

export const Route = createFileRoute('/_authenticated/finance/petty-cash')({
  component: PettyCashPage,
})
