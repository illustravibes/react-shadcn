import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { Invoice } from '../types'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

interface InvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: Invoice
}

export default function InvoiceDialog({
  open,
  onOpenChange,
  invoice,
}: InvoiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [items, setItems] = useState(invoice?.items || [])
  const isEdit = !!invoice

  const form = useForm<Partial<Invoice>>({
    defaultValues: invoice || {
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      customerId: '',
      customerName: '',
      status: 'DRAFT',
      currency: 'USD',
      notes: '',
    },
  })

  const onSubmit = async (data: Partial<Invoice>) => {
    if (items.length === 0) {
      toast.error('Invoice must have at least one item')
      return
    }

    setIsSubmitting(true)
    try {
      const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
      const tax = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0)
      console.log('[v0] Saving invoice:', { ...data, items, subtotal, tax })
      toast.success(isEdit ? 'Invoice updated' : 'Invoice created')
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('[v0] Error:', error)
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }

    if (field === 'quantity' || field === 'unitPrice') {
      const qty = field === 'quantity' ? value : updated[index].quantity
      const price = field === 'unitPrice' ? value : updated[index].unitPrice
      updated[index].amount = qty * price
    }

    setItems(updated)
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxRate = items[0]?.taxRate || 10
  const tax = (subtotal * taxRate) / 100
  const total = subtotal + tax

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update invoice details' : 'Create a new invoice'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoiceNumber"
                rules={{ required: 'Invoice number is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., INV-001" {...field} disabled={isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoiceDate"
                rules={{ required: 'Invoice date is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                rules={{ required: 'Due date is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                rules={{ required: 'Customer name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CUST-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Line Items Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Line Items</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-3 space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(index, 'description', e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <Input
                        placeholder="Quantity"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, 'quantity', parseFloat(e.target.value) || 0)
                        }
                      />
                      <Input
                        placeholder="Unit Price"
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)
                        }
                      />
                      <Input
                        placeholder="Amount"
                        type="number"
                        value={item.amount}
                        disabled
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-3 mt-3 space-y-2 text-sm font-semibold">
                  <div className="flex justify-end gap-4">
                    <span>Subtotal:</span>
                    <span>{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-end gap-4">
                    <span>Tax ({taxRate}%):</span>
                    <span>{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-end gap-4 text-base font-bold">
                    <span>Total:</span>
                    <span>{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
