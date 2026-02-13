import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { reportsApi } from '@/features/finance/api'
import { Download } from 'lucide-react'

export default function BalanceSheetPage() {
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0])

  const { data: report, isLoading, refetch } = useQuery({
    queryKey: ['balanceSheet', asOfDate],
    queryFn: async () => {
      console.log('[v0] Fetching balance sheet...')
      try {
        const data = await reportsApi.getBalanceSheet(asOfDate)
        return data
      } catch (error) {
        console.error('[v0] Error fetching balance sheet:', error)
        return null
      }
    },
    enabled: !!asOfDate,
  })

  const handleExport = () => {
    console.log('[v0] Exporting balance sheet...')
    if (!report) return

    const csv = [
      ['Balance Sheet', `As of ${asOfDate}`],
      [],
      ['ASSETS'],
      ['Current Assets', report.assets.currentAssets],
      ['Non-Current Assets', report.assets.nonCurrentAssets],
      ['Total Assets', report.assets.totalAssets],
      [],
      ['LIABILITIES'],
      ['Current Liabilities', report.liabilities.currentLiabilities],
      ['Non-Current Liabilities', report.liabilities.nonCurrentLiabilities],
      ['Total Liabilities', report.liabilities.totalLiabilities],
      [],
      ['EQUITY'],
      ['Total Equity', report.equity.totalEquity],
      [],
      ['Total Liabilities & Equity', report.liabilities.totalLiabilities + report.equity.totalEquity],
    ]
      .map((row) => (Array.isArray(row) ? row.join(',') : row))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'balance-sheet.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Balance Sheet</h1>
        <p className="text-muted-foreground mt-2">
          Statement of financial position showing assets, liabilities, and equity
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Date</CardTitle>
          <CardDescription>Select the date for the balance sheet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>As of Date</Label>
              <Input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
              />
            </div>
            <Button onClick={() => refetch()}>Generate Report</Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="flex justify-center py-8">Loading...</CardContent>
        </Card>
      )}

      {report && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Balance Sheet Report</CardTitle>
                <CardDescription>Financial position as of the selected date</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-4">ASSETS</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Current Assets</TableCell>
                      <TableCell className="text-right">
                        {report.assets.currentAssets?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Non-Current Assets</TableCell>
                      <TableCell className="text-right">
                        {report.assets.nonCurrentAssets?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-bold border-t-2">
                      <TableCell>Total Assets</TableCell>
                      <TableCell className="text-right">
                        {report.assets.totalAssets?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">LIABILITIES & EQUITY</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">Liabilities</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Current Liabilities</TableCell>
                      <TableCell className="text-right">
                        {report.liabilities.currentLiabilities?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Non-Current Liabilities</TableCell>
                      <TableCell className="text-right">
                        {report.liabilities.nonCurrentLiabilities?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-slate-100">
                      <TableCell className="pl-8 font-semibold">Total Liabilities</TableCell>
                      <TableCell className="text-right">
                        {report.liabilities.totalLiabilities?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Equity</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Total Equity</TableCell>
                      <TableCell className="text-right">
                        {report.equity.totalEquity?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-bold border-t-2">
                      <TableCell>Total Liabilities & Equity</TableCell>
                      <TableCell className="text-right">
                        {(report.liabilities.totalLiabilities + report.equity.totalEquity)?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
