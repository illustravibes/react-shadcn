import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { payrollApi } from '../api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function PayrollPage() {
  const { data: payrolls = [], isLoading } = useQuery({
    queryKey: ['payroll'],
    queryFn: async () => {
      console.log('[v0] Fetching payroll records from API...')
      try {
        const data = await payrollApi.list()
        return data
      } catch (error) {
        console.error('[v0] Error fetching payroll:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const totalPayment = payrolls.reduce((sum, pr) => sum + pr.totalNetPay, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage employee payroll and compensation
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Process Payroll
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
          <CardDescription>
            Total payroll records: {payrolls.length} | Total payment: {totalPayment.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : payrolls.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>No payroll records found. Create your first payroll.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payroll #</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Total Gross</TableHead>
                    <TableHead>Total Net</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrolls.map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell className="font-mono">{payroll.payrollNumber}</TableCell>
                      <TableCell>{payroll.payrollPeriod}</TableCell>
                      <TableCell>{payroll.payrollDate}</TableCell>
                      <TableCell>{payroll.employees?.length || 0}</TableCell>
                      <TableCell>{payroll.totalGross?.toLocaleString()}</TableCell>
                      <TableCell>{payroll.totalNetPay?.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            payroll.status === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : payroll.status === 'APPROVED'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {payroll.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
