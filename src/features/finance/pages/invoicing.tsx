import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus, Download } from 'lucide-react'
import DataTable from '@/components/data-table'
import { invoicingColumns } from '../components/invoicing-columns'
import { invoicingData } from '../data/invoicing-data'
import { invoiceApi } from '../api'

export default function InvoicingPage() {
  const [open, setOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])
  const [rowSelection, setRowSelection] = useState({})

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      console.log('[v0] Fetching invoices from API...')
      try {
        const data = await invoiceApi.list()
        return data
      } catch (error) {
        console.error('[v0] Error fetching invoices:', error)
        return invoicingData
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const searchLower = globalFilter.toLowerCase()
      return (
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.customerName.toLowerCase().includes(searchLower) ||
        invoice.status.toLowerCase().includes(searchLower)
      )
    })
  }, [invoices, globalFilter])

  const handleExport = () => {
    console.log('[v0] Exporting invoices...')
    const csv = [
      ['Invoice #', 'Customer', 'Date', 'Due Date', 'Total', 'Status'],
      ...filteredInvoices.map((inv) => [
        inv.invoiceNumber,
        inv.customerName,
        inv.invoiceDate,
        inv.dueDate,
        inv.total,
        inv.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'invoices.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoicing</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage customer invoices
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            Total invoices: {filteredInvoices.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={invoicingColumns}
            data={filteredInvoices}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            sorting={sorting}
            setSorting={setSorting}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            isLoading={isLoading}
            filterPlaceholder="Search invoices..."
            showViewOptions={true}
            showPagination={true}
            customToolbarActions={
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={isLoading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </>
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
