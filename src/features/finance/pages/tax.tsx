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
import { taxApi } from '../api'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function TaxPage() {
  const { data: rates = [], isLoading: ratesLoading } = useQuery({
    queryKey: ['taxRates'],
    queryFn: async () => {
      console.log('[v0] Fetching tax rates from API...')
      try {
        const data = await taxApi.getRates()
        return data
      } catch (error) {
        console.error('[v0] Error fetching tax rates:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const { data: computations = [], isLoading: computationsLoading } = useQuery({
    queryKey: ['taxComputations'],
    queryFn: async () => {
      console.log('[v0] Fetching tax computations from API...')
      try {
        const data = await taxApi.getComputations()
        return data
      } catch (error) {
        console.error('[v0] Error fetching computations:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage tax rates, computations, and compliance
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Computation
        </Button>
      </div>

      <Tabs defaultValue="rates">
        <TabsList>
          <TabsTrigger value="rates">Tax Rates</TabsTrigger>
          <TabsTrigger value="computations">Tax Computations</TabsTrigger>
        </TabsList>

        <TabsContent value="rates">
          <Card>
            <CardHeader>
              <CardTitle>Tax Rates</CardTitle>
              <CardDescription>Current tax rates and rules</CardDescription>
            </CardHeader>
            <CardContent>
              {ratesLoading ? (
                <div className="flex justify-center py-8">Loading...</div>
              ) : rates.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <p>No tax rates configured.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tax Type</TableHead>
                        <TableHead>Tax Code</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rates.map((rate) => (
                        <TableRow key={rate.id}>
                          <TableCell>{rate.taxType}</TableCell>
                          <TableCell>{rate.taxCode}</TableCell>
                          <TableCell>{rate.rate}%</TableCell>
                          <TableCell>
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                rate.status === 'ACTIVE'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {rate.status}
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
        </TabsContent>

        <TabsContent value="computations">
          <Card>
            <CardHeader>
              <CardTitle>Tax Computations</CardTitle>
              <CardDescription>Tax computation records and submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {computationsLoading ? (
                <div className="flex justify-center py-8">Loading...</div>
              ) : computations.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <p>No tax computations found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Computation #</TableHead>
                        <TableHead>Tax Type</TableHead>
                        <TableHead>Gross Income</TableHead>
                        <TableHead>Tax Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {computations.map((comp) => (
                        <TableRow key={comp.id}>
                          <TableCell className="font-mono">{comp.computationNumber}</TableCell>
                          <TableCell>{comp.taxType}</TableCell>
                          <TableCell>{comp.grossIncome?.toLocaleString()}</TableCell>
                          <TableCell>{comp.tax?.toLocaleString()}</TableCell>
                          <TableCell>{comp.computationDate}</TableCell>
                          <TableCell>
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                comp.status === 'APPROVED'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {comp.status}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
