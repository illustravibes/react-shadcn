import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function TrialBalancePage() {
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
          <CardTitle>Trial Balance Report</CardTitle>
          <CardDescription>
            Verification that total debits equal total credits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Trial Balance report coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
