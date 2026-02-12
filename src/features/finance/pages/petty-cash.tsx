import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default function PettyCashPage() {
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
          New Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Petty Cash Transactions</CardTitle>
          <CardDescription>
            Petty cash account transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Petty cash module coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
