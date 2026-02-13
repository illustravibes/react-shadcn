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
import { pettyCashApi } from '../api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function PettyCashPage() {
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['pettyCashAccounts'],
    queryFn: async () => {
      console.log('[v0] Fetching petty cash accounts from API...')
      try {
        const data = await pettyCashApi.listAccounts()
        return data
      } catch (error) {
        console.error('[v0] Error fetching petty cash accounts:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Petty Cash</h1>
          <p className="text-muted-foreground mt-2">
            Manage petty cash accounts and transactions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Petty Cash Accounts</CardTitle>
          <CardDescription>
            Total accounts: {accounts.length} | Total balance: {totalBalance.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : accounts.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>No petty cash accounts found. Create your first account.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Initial Balance</TableHead>
                    <TableHead>Current Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.accountName}</TableCell>
                      <TableCell>{account.accountManager || '-'}</TableCell>
                      <TableCell>{account.currency}</TableCell>
                      <TableCell>{account.initialBalance?.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">{account.currentBalance?.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            account.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {account.status === 'ACTIVE' ? 'Active' : 'Closed'}
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
