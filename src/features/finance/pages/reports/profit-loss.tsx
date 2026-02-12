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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { reportsApi } from '@/features/finance/api'
import { Download } from 'lucide-react'

export default function ProfitLossPage() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])

  const { data: report, isLoading, refetch } = useQuery({
    queryKey: ['profitLoss', startDate, endDate],
    queryFn: async () => {
      console.log('[v0] Fetching profit & loss report...')
      try {
        const data = await reportsApi.getProfitLoss(startDate, endDate)
        return data
      } catch (error) {
        console.error('[v0] Error fetching P&L report:', error)
        return null
      }
    },
    enabled: !!startDate && !!endDate,
  })

  const handleExport = () => {
    console.log('[v0] Exporting P&L report...')
    if (!report) return

    const csv = [
      ['Profit & Loss Statement', `${startDate} to ${endDate}`],
      [],
      ['Revenue', report.revenue],
      ['Cost of Goods Sold', report.costOfGoodsSold],
      ['Gross Profit', report.grossProfit],
      ['Operating Expenses', report.operatingExpenses],
      ['Operating Income', report.operatingIncome],
      ['Other Income/Expense', report.otherIncomeExpense],
      [],
      ['Net Income', report.netIncome],
    ]
      .map((row) => (Array.isArray(row) ? row.join(',') : row))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'profit-loss-report.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profit & Loss Report</h1>
        <p className="text-muted-foreground mt-2">
          Income statement showing revenue, expenses, and net income
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Period</CardTitle>
          <CardDescription>Select the date range for the report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => refetch()}>Generate Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="flex justify-center py-8">Loading...</CardContent>
        </Card>
      )}

      {report && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Income Statement</CardTitle>
                  <CardDescription>Financial performance for the selected period</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="font-semibold">
                      <TableCell>Revenue</TableCell>
                      <TableCell className="text-right">{report.revenue?.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Cost of Goods Sold</TableCell>
                      <TableCell className="text-right">
                        ({report.costOfGoodsSold?.toLocaleString()})
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-semibold bg-slate-100">
                      <TableCell>Gross Profit</TableCell>
                      <TableCell className="text-right">{report.grossProfit?.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Operating Expenses</TableCell>
                      <TableCell className="text-right">
                        ({report.operatingExpenses?.toLocaleString()})
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-semibold">
                      <TableCell>Operating Income</TableCell>
                      <TableCell className="text-right">{report.operatingIncome?.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="pl-8">Other Income/Expense</TableCell>
                      <TableCell className="text-right">
                        {report.otherIncomeExpense?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-semibold border-t-2">
                      <TableCell>Net Income</TableCell>
                      <TableCell className="text-right">{report.netIncome?.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
