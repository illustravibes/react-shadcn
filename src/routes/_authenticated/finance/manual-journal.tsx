import { createFileRoute } from '@tanstack/react-router'
import ManualJournalPage from '@/features/finance/pages/manual-journal'

export const Route = createFileRoute('/_authenticated/finance/manual-journal')({
  component: ManualJournalPage,
})
