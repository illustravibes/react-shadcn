import { ColumnDef } from '@tanstack/react-table'
import { ManualJournal } from '../types'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import ManualJournalRowActions from './manual-journal-row-actions'
import { format } from 'date-fns'

export const manualJournalColumns: ColumnDef<ManualJournal>[] = [
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
    accessorKey: 'journalNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Journal #" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold">{row.getValue('journalNumber')}</div>
    ),
  },
  {
    accessorKey: 'journalDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('journalDate') as string)
      return <div>{format(date, 'MMM dd, yyyy')}</div>
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      const referenceNumber = row.original.referenceNumber
      return (
        <div>
          <p className="font-medium">{description}</p>
          {referenceNumber && (
            <p className="text-xs text-muted-foreground">Ref: {referenceNumber}</p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'entries',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Line Items" />
    ),
    cell: ({ row }) => {
      const entries = row.getValue('entries') as any[]
      return <div>{entries.length} entries</div>
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
        POSTED: 'bg-green-100 text-green-800',
        REVERSED: 'bg-red-100 text-red-800',
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
    cell: ({ row }) => <ManualJournalRowActions row={row} />,
  },
]
