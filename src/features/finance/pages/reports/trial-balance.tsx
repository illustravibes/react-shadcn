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

export default function TrialBalancePage() {
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0])

  const { data: report, isLoading, refetch } = useQuery({
    queryKey: ['trialBalance', asOfDate],
    queryFn: async () => {
      console.log('[v0] Fetching trial balance...')
      try {
        const data = await reportsApi.getTrialBalance(asOfDate)
        return data
      } catch (error) {
        console.error('[v0] Error fetching trial balance:', error)
        return null
      }
    },
    enabled: !!asOfDate,
  })

  const handleExport = () => {
    console.log('[v0] Exporting trial balance...')
    if (!report) return

    const csv = [
      ['Trial Balance Report', `As of ${asOfDate}`],
      [],
      ['Account Number', 'Account Name', 'Account Type', 'Debit', 'Credit'],
      ...report.accounts.map((acc) => [
        acc.accountNumber,
        acc.accountName,
        acc.accountType,
        acc.debit,
        acc.credit,
      ]),
      [],
      ['', '', 'Total', report.totalDebits, report.totalCredits],
    ]
      .map((row) => (Array.isArray(row) ? row.join(',') : row))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'trial-balance.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trial Balance</h1>
        <p className="text-muted-foreground mt-2">
          List of all accounts with their debit and credit balances
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Date</CardTitle>
          <CardDescription>Select the date for the trial balance</CardDescription>
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
                <CardTitle>Trial Balance Report</CardTitle>
                <CardDescription>Verification that total debits equal total credits</CardDescription>
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
                    <TableHead>Account Number</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.accounts.map((account) => (
                    <TableRow key={account.accountNumber}>
                      <TableCell className="font-mono">{account.accountNumber}</TableCell>
                      <TableCell>{account.accountName}</TableCell>
                      <TableCell>{account.accountType}</TableCell>
                      <TableCell className="text-right">{account.debit?.toLocaleString() || '—'}</TableCell>
                      <TableCell className="text-right">{account.credit?.toLocaleString() || '—'}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold border-t-2">
                    <TableCell colSpan={3}>Totals</TableCell>
                    <TableCell className="text-right">{report.totalDebits?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{report.totalCredits?.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {report.totalDebits === report.totalCredits && (
              <p className="mt-4 text-sm text-green-700 font-semibold">
                ✓ Trial balance is balanced. Debits and credits are equal.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
