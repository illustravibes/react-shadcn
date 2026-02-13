import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus, AlertCircle } from 'lucide-react'
import { inventoryApi } from '../api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function InventoryPage() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      console.log('[v0] Fetching inventory from API...')
      try {
        const data = await inventoryApi.list()
        return data
      } catch (error) {
        console.error('[v0] Error fetching inventory:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const lowStockItems = items.filter((item) => item.quantity <= item.reorderLevel)
  const totalValue = items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-2">
            Track inventory items and stock levels
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-2 py-4">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              {lowStockItems.length} item(s) are below reorder level
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Total items: {items.length} | Total inventory value: {totalValue.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>No inventory items found. Add your first item.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.itemCode}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.reorderLevel}</TableCell>
                      <TableCell>{item.unitCost?.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            item.quantity > item.reorderLevel
                              ? 'bg-green-100 text-green-800'
                              : item.quantity <= item.reorderLevel && item.quantity > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.quantity > item.reorderLevel
                            ? 'In Stock'
                            : item.quantity > 0
                              ? 'Low Stock'
                              : 'Out of Stock'}
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
