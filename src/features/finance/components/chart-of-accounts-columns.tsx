import { ColumnDef } from '@tanstack/react-table'
import { ChartOfAccount } from '../types'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import DataTableColumnHeader from '@/components/data-table/column-header'
import DataTableRowActions from './chart-of-accounts-row-actions'

export const chartOfAccountsColumns: ColumnDef<ChartOfAccount>[] = [
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
    accessorKey: 'accountNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account #" />
    ),
    cell: ({ row }) => (
      <div className="font-semibold">{row.getValue('accountNumber')}</div>
    ),
  },
  {
    accessorKey: 'accountName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Name" />
    ),
    cell: ({ row }) => {
      const description = row.original.description
      return (
        <div>
          <p className="font-medium">{row.getValue('accountName')}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'accountType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue('accountType') as string
      const typeColors: Record<string, string> = {
        ASSET: 'bg-blue-100 text-blue-800',
        LIABILITY: 'bg-red-100 text-red-800',
        EQUITY: 'bg-purple-100 text-purple-800',
        INCOME: 'bg-green-100 text-green-800',
        EXPENSE: 'bg-orange-100 text-orange-800',
      }
      return (
        <Badge className={typeColors[type] || 'bg-gray-100 text-gray-800'}>
          {type}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'accountSubType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Type" />
    ),
    cell: ({ row }) => <div>{row.getValue('accountSubType')}</div>,
  },
  {
    accessorKey: 'currency',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
    cell: ({ row }) => <div>{row.getValue('currency')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>
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
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
