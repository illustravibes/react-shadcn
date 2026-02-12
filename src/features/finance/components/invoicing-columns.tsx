import { ColumnDef } from '@tanstack/react-table'
import { Invoice } from '../types'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import DataTableColumnHeader from '@/components/data-table/column-header'
import InvoiceRowActions from './invoicing-row-actions'
import { format } from 'date-fns'

export const invoicingColumns: ColumnDef<Invoice>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'invoiceNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice #" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold">{row.getValue('invoiceNumber')}</div>
    ),
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.getValue('customerName')}</p>
      </div>
    ),
  },
  {
    accessorKey: 'invoiceDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('invoiceDate') as string)
      return <div>{format(date, 'MMM dd, yyyy')}</div>
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('dueDate') as string)
      return <div>{format(date, 'MMM dd, yyyy')}</div>
    },
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const invoice = row.original
      return (
        <div className="font-semibold">
          {invoice.currency} {invoice.total.toFixed(2)}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const statusColors: Record<string, string> = {
        DRAFT: 'bg-gray-100 text-gray-800',
        SENT: 'bg-blue-100 text-blue-800',
        PAID: 'bg-green-100 text-green-800',
        OVERDUE: 'bg-red-100 text-red-800',
        CANCELLED: 'bg-yellow-100 text-yellow-800',
      }
      return (
        <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <InvoiceRowActions row={row} />,
  },
]
