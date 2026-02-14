'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { Invoice, InvoiceItem } from '../data/schema'
import {
  calculateInvoiceTotals,
  calculateItemAmount,
  formatCurrency,
} from '../utils/invoice-utils'
import { v4 as uuidv4 } from 'uuid'

interface InvoiceFormProps {
  invoice?: Invoice
  onSubmit: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void
  isLoading?: boolean
}

export function InvoiceForm({ invoice, onSubmit, isLoading = false }: InvoiceFormProps) {
  const [customerName, setCustomerName] = useState(invoice?.customerName || '')
  const [customerEmail, setCustomerEmail] = useState(invoice?.customerEmail || '')
  const [dueDate, setDueDate] = useState(
    invoice?.dueDate ? invoice.dueDate.toISOString().split('T')[0] : ''
  )
  const [taxRate, setTaxRate] = useState(invoice?.taxRate || 0)
  const [notes, setNotes] = useState(invoice?.notes || '')
  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items || [
      { id: uuidv4(), description: '', quantity: 1, unitPrice: 0, amount: 0 },
    ]
  )

  const totals = calculateInvoiceTotals(items, taxRate)

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: uuidv4(), description: '', quantity: 1, unitPrice: 0, amount: 0 },
    ])
  }

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item

        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          updated.amount = calculateItemAmount(updated.quantity, updated.unitPrice)
        }
        return updated
      })
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerName.trim()) {
      alert('Nama customer harus diisi')
      return
    }

    if (items.length === 0) {
      alert('Minimal ada 1 item')
      return
    }

    if (!dueDate) {
      alert('Tanggal jatuh tempo harus diisi')
      return
    }

    const invoiceDate = invoice?.date || new Date()
    onSubmit({
      invoiceNo: invoice?.invoiceNo || '',
      date: invoiceDate,
      dueDate: new Date(dueDate),
      customerName,
      customerEmail: customerEmail || undefined,
      items,
      subtotal: totals.subtotal,
      taxRate,
      taxAmount: totals.taxAmount,
      total: totals.total,
      notes: notes || undefined,
      status: invoice?.status || 'draft',
      autoPostJournal: invoice?.autoPostJournal || true,
      postedJournalId: invoice?.postedJournalId,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Customer</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='customerName'>Nama Customer</Label>
              <Input
                id='customerName'
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder='PT ABC, Toko XYZ'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='customerEmail'>Email (opsional)</Label>
              <Input
                id='customerEmail'
                type='email'
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder='customer@example.com'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='dueDate'>Tanggal Jatuh Tempo</Label>
            <Input
              id='dueDate'
              type='date'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0'>
          <CardTitle>Item Invoice</CardTitle>
          <Button
            type='button'
            onClick={handleAddItem}
            variant='outline'
            size='sm'
            className='gap-2'
          >
            <Plus className='h-4 w-4' />
            Tambah Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {items.map((item, index) => (
              <div key={item.id} className='flex gap-2 items-end pb-4 border-b last:border-0'>
                <div className='flex-1 space-y-2'>
                  <Label htmlFor={`desc-${item.id}`} className='text-xs'>
                    Deskripsi
                  </Label>
                  <Input
                    id={`desc-${item.id}`}
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                    placeholder='Deskripsi item/jasa'
                  />
                </div>
                <div className='w-20 space-y-2'>
                  <Label htmlFor={`qty-${item.id}`} className='text-xs'>
                    Qty
                  </Label>
                  <Input
                    id={`qty-${item.id}`}
                    type='number'
                    min='1'
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className='w-28 space-y-2'>
                  <Label htmlFor={`price-${item.id}`} className='text-xs'>
                    Harga Satuan
                  </Label>
                  <Input
                    id={`price-${item.id}`}
                    type='number'
                    min='0'
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className='w-28 space-y-2'>
                  <Label className='text-xs'>Jumlah</Label>
                  <div className='text-sm font-medium'>{formatCurrency(item.amount)}</div>
                </div>
                <Button
                  type='button'
                  onClick={() => handleRemoveItem(item.id)}
                  variant='ghost'
                  size='sm'
                  disabled={items.length === 1}
                  className='h-10 w-10'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardContent className='pt-6'>
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Subtotal</span>
              <span className='font-medium'>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-muted-foreground'>PPN ({taxRate}%)</span>
              <Input
                type='number'
                min='0'
                max='100'
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                className='w-20 h-8 text-right'
              />
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Pajak</span>
              <span className='font-medium'>{formatCurrency(totals.taxAmount)}</span>
            </div>
            <div className='border-t pt-3 flex justify-between'>
              <span className='font-semibold'>Total</span>
              <span className='font-bold text-lg'>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <div className='space-y-2'>
        <Label htmlFor='notes'>Catatan (opsional)</Label>
        <Textarea
          id='notes'
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder='Catatan tambahan untuk invoice'
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <Button type='submit' disabled={isLoading} className='w-full'>
        {isLoading ? 'Menyimpan...' : invoice ? 'Update Invoice' : 'Buat Invoice'}
      </Button>
    </form>
  )
}
