import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus } from 'lucide-react'

export default function TaxPage() {
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

      <Card>
        <CardHeader>
          <CardTitle>Tax Records</CardTitle>
          <CardDescription>
            Tax rates and computations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Tax management module coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
