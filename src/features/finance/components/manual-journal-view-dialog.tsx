import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ManualJournal } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface ManualJournalViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  journal: ManualJournal
}

export default function ManualJournalViewDialog({
  open,
  onOpenChange,
  journal,
}: ManualJournalViewDialogProps) {
  const totalDebits = journal.entries.reduce((sum, e) => sum + (e.debit || 0), 0)
  const totalCredits = journal.entries.reduce((sum, e) => sum + (e.credit || 0), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Journal Entry Details</DialogTitle>
          <DialogDescription>
            View the details of this journal entry
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Journal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Journal Number</p>
                  <p className="font-semibold">{journal.journalNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {format(new Date(journal.journalDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-semibold">{journal.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="mt-1">
                    {journal.status === 'POSTED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'}
                  >
                    {journal.status}
                  </Badge>
                </div>
              </div>

              {journal.referenceNumber && (
                <div>
                  <p className="text-sm text-muted-foreground">Reference Number</p>
                  <p className="font-semibold">{journal.referenceNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Entries Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Journal Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-semibold">
                        Account
                      </th>
                      <th className="text-right py-2 px-2 font-semibold">
                        Debit
                      </th>
                      <th className="text-right py-2 px-2 font-semibold">
                        Credit
                      </th>
                      <th className="text-left py-2 px-2 font-semibold">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {journal.entries.map((entry) => (
                      <tr key={entry.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2 font-medium">
                          {entry.accountName}
                        </td>
                        <td className="text-right py-2 px-2">
                          {entry.debit > 0
                            ? entry.debit.toFixed(2)
                            : '-'}
                        </td>
                        <td className="text-right py-2 px-2">
                          {entry.credit > 0
                            ? entry.credit.toFixed(2)
                            : '-'}
                        </td>
                        <td className="py-2 px-2 text-muted-foreground">
                          {entry.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t font-semibold bg-muted/50">
                      <td className="py-2 px-2">Totals</td>
                      <td className="text-right py-2 px-2">
                        {totalDebits.toFixed(2)}
                      </td>
                      <td className="text-right py-2 px-2">
                        {totalCredits.toFixed(2)}
                      </td>
                      <td className="py-2 px-2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
