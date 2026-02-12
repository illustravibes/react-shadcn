import { createFileRoute } from '@tanstack/react-router'
import FixedAssetsPage from '@/features/finance/pages/fixed-assets'

export const Route = createFileRoute('/_authenticated/finance/fixed-assets')({
  component: FixedAssetsPage,
})
