import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { currencyApi } from '../api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function CurrencyPage() {
  const { data: rates = [], isLoading } = useQuery({
    queryKey: ['exchangeRates'],
    queryFn: async () => {
      console.log('[v0] Fetching exchange rates from API...')
      try {
        const data = await currencyApi.getExchangeRates()
        return data
      } catch (error) {
        console.error('[v0] Error fetching exchange rates:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5,
  })

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
          {isLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : rates.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>No exchange rates configured.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Base Currency</TableHead>
                    <TableHead>Target Currency</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Rate Date</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rates.map((rate, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono">{rate.baseCurrency}</TableCell>
                      <TableCell className="font-mono">{rate.targetCurrency}</TableCell>
                      <TableCell>{rate.rate.toFixed(4)}</TableCell>
                      <TableCell>{rate.rateDate}</TableCell>
                      <TableCell>{rate.source}</TableCell>
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
