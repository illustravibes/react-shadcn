import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function CurrencyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Multi-Currency Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage currency rates and multi-currency transactions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exchange Rates</CardTitle>
          <CardDescription>
            Current exchange rates and currency conversions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Multi-currency module coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
