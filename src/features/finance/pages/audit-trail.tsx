import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function AuditTrailPage() {
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
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Audit trail module coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
