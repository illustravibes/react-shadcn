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
import { fixedAssetsApi } from '../api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function FixedAssetsPage() {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['fixedAssets'],
    queryFn: async () => {
      console.log('[v0] Fetching fixed assets from API...')
      try {
        const data = await fixedAssetsApi.list()
        return data
      } catch (error) {
        console.error('[v0] Error fetching assets:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const totalNetValue = assets.reduce((sum, asset) => sum + asset.netBookValue, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fixed Assets</h1>
          <p className="text-muted-foreground mt-2">
            Manage fixed assets and depreciation
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fixed Assets</CardTitle>
          <CardDescription>
            Total assets: {assets.length} | Total net value: {totalNetValue.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : assets.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>No fixed assets found. Add your first asset.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Number</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Acquisition Cost</TableHead>
                    <TableHead>Depreciation</TableHead>
                    <TableHead>Net Book Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-mono">{asset.assetNumber}</TableCell>
                      <TableCell>{asset.assetName}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>{asset.acquisitionCost?.toLocaleString()}</TableCell>
                      <TableCell>{asset.depreciation?.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">{asset.netBookValue?.toLocaleString()}</TableCell>
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
