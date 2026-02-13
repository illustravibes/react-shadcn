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
import { DataTable } from '@/components/data-table'
import { manualJournalColumns } from '../components/manual-journal-columns'
import ManualJournalDialog from '../components/manual-journal-dialog'
import { manualJournalsData } from '../data/manual-journal-data'
import { manualJournalApi } from '../api'

export default function ManualJournalPage() {
  const [open, setOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])
  const [rowSelection, setRowSelection] = useState({})

  const { data: journals = [], isLoading } = useQuery({
    queryKey: ['manualJournals'],
    queryFn: async () => {
      console.log('[v0] Fetching manual journals from API...')
      try {
        const data = await manualJournalApi.list()
        return data
      } catch (error) {
        console.error('[v0] Error fetching journals:', error)
        return manualJournalsData
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const filteredJournals = useMemo(() => {
    return journals.filter((journal) => {
      const searchLower = globalFilter.toLowerCase()
      return (
        journal.journalNumber.toLowerCase().includes(searchLower) ||
        journal.description?.toLowerCase().includes(searchLower) ||
        journal.status.toLowerCase().includes(searchLower)
      )
    })
  }, [journals, globalFilter])

  const handleExport = () => {
    console.log('[v0] Exporting journals...')
    const csv = [
      ['Journal #', 'Date', 'Description', 'Entries', 'Status'],
      ...filteredJournals.map((j) => [
        j.journalNumber,
        j.journalDate,
        j.description,
        j.entries.length,
        j.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'manual-journals.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manual Journal</h1>
          <p className="text-muted-foreground mt-2">
            Record manual journal entries to the general ledger
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Journal Entry
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Journal Entries</CardTitle>
          <CardDescription>
            Total journals: {filteredJournals.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={manualJournalColumns}
            data={filteredJournals}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            sorting={sorting}
            setSorting={setSorting}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            isLoading={isLoading}
            filterPlaceholder="Search journals..."
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

      <ManualJournalDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
