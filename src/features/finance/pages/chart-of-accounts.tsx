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
import { chartOfAccountsColumns } from '../components/chart-of-accounts-columns'
import ChartOfAccountsDialog from '../components/chart-of-accounts-dialog'
import { chartOfAccountsData } from '../data/chart-of-accounts-data'
import { ChartOfAccount } from '../types'
import { chartOfAccountsApi } from '../api'

export default function ChartOfAccountsPage() {
  const [open, setOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])
  const [rowSelection, setRowSelection] = useState({})

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['chartOfAccounts'],
    queryFn: async () => {
      console.log('[v0] Fetching chart of accounts from API...')
      try {
        const data = await chartOfAccountsApi.list()
        return data
      } catch (error) {
        console.error('[v0] Error fetching accounts:', error)
        return chartOfAccountsData
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const searchLower = globalFilter.toLowerCase()
      return (
        account.accountNumber.toLowerCase().includes(searchLower) ||
        account.accountName.toLowerCase().includes(searchLower) ||
        account.accountType.toLowerCase().includes(searchLower) ||
        account.accountSubType.toLowerCase().includes(searchLower)
      )
    })
  }, [accounts, globalFilter])

  const handleExport = () => {
    console.log('[v0] Exporting chart of accounts...')
    const csv = [
      ['Account #', 'Name', 'Type', 'Sub Type', 'Currency', 'Status'],
      ...filteredAccounts.map((acc) => [
        acc.accountNumber,
        acc.accountName,
        acc.accountType,
        acc.accountSubType,
        acc.currency,
        acc.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chart-of-accounts.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chart of Accounts</h1>
          <p className="text-muted-foreground mt-2">
            Manage your accounts and account types for the general ledger
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>
            Total accounts: {filteredAccounts.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={chartOfAccountsColumns}
            data={filteredAccounts}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            sorting={sorting}
            setSorting={setSorting}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            isLoading={isLoading}
            filterPlaceholder="Search accounts..."
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

      <ChartOfAccountsDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
