import { createFileRoute } from '@tanstack/react-router'
import InventoryPage from '@/features/finance/pages/inventory'

export const Route = createFileRoute('/_authenticated/finance/inventory')({
  component: InventoryPage,
})
