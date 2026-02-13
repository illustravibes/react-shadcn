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
import {
  MoreHorizontal,
  Trash2,
  Eye,
  Mail,
  Download,
} from 'lucide-react'
import { Invoice } from '../types'
import { useState } from 'react'
import InvoiceDialog from './invoicing-dialog'
import InvoiceViewDialog from './invoicing-view-dialog'

interface RowActionsProps {
  row: Row<Invoice>
}

export default function InvoiceRowActions({ row }: RowActionsProps) {
  const invoice = row.original
  const [openEdit, setOpenEdit] = useState(false)
  const [openView, setOpenView] = useState(false)
  const isEditable = invoice.status === 'DRAFT'

  const handleEdit = () => {
    if (isEditable) {
      setOpenEdit(true)
    } else {
      setOpenView(true)
    }
  }

  const handleSend = () => {
    console.log('[v0] Sending invoice:', invoice.id)
  }

  const handleDownload = () => {
    console.log('[v0] Downloading invoice:', invoice.id)
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
            {isEditable ? 'Edit' : 'View'}
          </DropdownMenuItem>

          {isEditable && (
            <>
              <DropdownMenuItem onClick={handleSend}>
                <Mail className="mr-2 h-4 w-4" />
                Send Invoice
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InvoiceDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        invoice={isEditable ? invoice : undefined}
      />

      <InvoiceViewDialog
        open={openView}
        onOpenChange={setOpenView}
        invoice={invoice}
      />
    </>
  )
}
