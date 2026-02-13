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
import { MoreHorizontal, Trash2, Eye, CheckCircle2 } from 'lucide-react'
import { ManualJournal } from '../types'
import { useState } from 'react'
import ManualJournalDialog from './manual-journal-dialog'
import ManualJournalViewDialog from './manual-journal-view-dialog'

interface RowActionsProps {
  row: Row<ManualJournal>
}

export default function ManualJournalRowActions({ row }: RowActionsProps) {
  const journal = row.original
  const [openEdit, setOpenEdit] = useState(false)
  const [openView, setOpenView] = useState(false)

  const handleEdit = () => {
    if (journal.status === 'POSTED') {
      setOpenView(true)
    } else {
      setOpenEdit(true)
    }
  }

  const handlePost = () => {
    console.log('[v0] Posting journal:', journal.id)
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
            <Eye className="mr-2 h-4 w-4" />
            {journal.status === 'POSTED' ? 'View' : 'Edit'}
          </DropdownMenuItem>
          {journal.status === 'DRAFT' && (
            <>
              <DropdownMenuItem onClick={handlePost}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Post Journal
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ManualJournalDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        journal={journal}
      />
      <ManualJournalViewDialog
        open={openView}
        onOpenChange={setOpenView}
        journal={journal}
      />
    </>
  )
}
