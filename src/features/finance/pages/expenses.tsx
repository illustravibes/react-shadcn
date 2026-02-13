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
import { Plus } from 'lucide-react'
import { expenseApi } from '../api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ExpensesPage() {
  const [globalFilter] = useState('')

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      console.log('[v0] Fetching expenses from API...')
      try {
        const data = await expenseApi.list()
        return data
      } catch (error) {
        console.error('[v0] Error fetching expenses:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const searchLower = globalFilter.toLowerCase()
      return (
        expense.expenseNumber.toLowerCase().includes(searchLower) ||
        expense.category.toLowerCase().includes(searchLower) ||
        expense.description.toLowerCase().includes(searchLower)
      )
    })
  }, [expenses, globalFilter])

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Management</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage business expenses
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Expense
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>
            Total expenses: {filteredExpenses.length} | Total amount: {totalExpenses.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : filteredExpenses.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>No expenses found. Create your first expense record.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expense #</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-mono">{expense.expenseNumber}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.expenseDate}</TableCell>
                      <TableCell>{expense.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            expense.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : expense.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {expense.status}
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
