import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Invoice } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface InvoiceViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice
}

export default function InvoiceViewDialog({
  open,
  onOpenChange,
  invoice,
}: InvoiceViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice {invoice.invoiceNumber}</DialogTitle>
          <DialogDescription>View invoice details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="font-semibold">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <Badge>{invoice.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Date</p>
                  <p className="font-semibold">
                    {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-semibold">
                    {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-semibold">{invoice.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-semibold">{invoice.currency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-semibold">
                        Description
                      </th>
                      <th className="text-right py-2 px-2 font-semibold">
                        Qty
                      </th>
                      <th className="text-right py-2 px-2 font-semibold">
                        Unit Price
                      </th>
                      <th className="text-right py-2 px-2 font-semibold">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2">{item.description}</td>
                        <td className="text-right py-2 px-2">{item.quantity}</td>
                        <td className="text-right py-2 px-2">
                          {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="text-right py-2 px-2">
                          {item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="flex justify-end gap-4">
                <span className="font-semibold">Subtotal:</span>
                <span className="font-semibold">
                  {invoice.currency} {invoice.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-end gap-4">
                <span className="font-semibold">Tax:</span>
                <span className="font-semibold">
                  {invoice.currency} {invoice.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-end gap-4 text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>
                  {invoice.currency} {invoice.total.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
