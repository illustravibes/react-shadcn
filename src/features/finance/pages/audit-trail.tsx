import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { auditApi } from '../api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function AuditTrailPage() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      console.log('[v0] Fetching audit logs from API...')
      try {
        const data = await auditApi.list()
        return data
      } catch (error) {
        console.error('[v0] Error fetching audit logs:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Trail & Logs</h1>
        <p className="text-muted-foreground mt-2">
          Financial transaction logs and audit trail records
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>
            Complete audit trail of all financial activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>No audit logs found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.entityType}</TableCell>
                      <TableCell className="font-mono text-sm">{log.entityId}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            log.action === 'CREATE'
                              ? 'bg-green-100 text-green-800'
                              : log.action === 'UPDATE'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.userId}</TableCell>
                      <TableCell className="text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
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
