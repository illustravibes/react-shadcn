import { Row } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit2, Trash2, Copy } from 'lucide-react'
import { ChartOfAccount } from '../types'
import { useState } from 'react'
import ChartOfAccountsDialog from './chart-of-accounts-dialog'

interface DataTableRowActionsProps {
  row: Row<ChartOfAccount>
}

export default function DataTableRowActions({
  row,
}: DataTableRowActionsProps) {
  const account = row.original
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<'edit' | 'add'>('edit')

  const handleEdit = () => {
    setAction('edit')
    setOpen(true)
  }

  const handleDuplicate = () => {
    setAction('add')
    setOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChartOfAccountsDialog
        open={open}
        onOpenChange={setOpen}
        account={action === 'edit' ? account : undefined}
      />
    </>
  )
}
