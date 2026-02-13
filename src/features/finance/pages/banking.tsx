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
import { bankAccountApi } from '../api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function BankingPage() {
  const [globalFilter] = useState('')

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['bankAccounts'],
    queryFn: async () => {
      console.log('[v0] Fetching bank accounts from API...')
      try {
        const data = await bankAccountApi.list()
        return data
      } catch (error) {
        console.error('[v0] Error fetching bank accounts:', error)
        return []
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
        account.bankName.toLowerCase().includes(searchLower)
      )
    })
  }, [accounts, globalFilter])

  const totalBalance = filteredAccounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banking & Payments</h1>
          <p className="text-muted-foreground mt-2">
            Manage bank accounts and payment transactions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bank Accounts</CardTitle>
          <CardDescription>
            Total balance: {totalBalance.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : filteredAccounts.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>No bank accounts found. Create your first bank account.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Bank Name</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-mono">{account.accountNumber}</TableCell>
                      <TableCell>{account.accountName}</TableCell>
                      <TableCell>{account.bankName}</TableCell>
                      <TableCell>{account.accountType}</TableCell>
                      <TableCell>{account.balance.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            account.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {account.status}
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
