'use client'

import { Invoice } from '../data/schema'
import { formatCurrency, formatDate, getInvoiceStatusLabel, getInvoiceStatusColor } from '../utils/invoice-utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit2, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface InvoiceListProps {
  invoices: Invoice[]
  onEdit: (invoice: Invoice) => void
  onView: (invoice: Invoice) => void
}

export function InvoiceList({ invoices, onEdit, onView }: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Belum ada invoice</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      {invoices.map((invoice) => (
        <Card key={invoice.id} className='hover:shadow-md transition-shadow'>
          <CardContent className='pt-6'>
            <div className='grid grid-cols-12 gap-4 items-center'>
              {/* Invoice No & Customer */}
              <div className='col-span-3'>
                <p className='font-semibold text-sm'>{invoice.invoiceNo}</p>
                <p className='text-sm text-muted-foreground'>{invoice.customerName}</p>
              </div>

              {/* Dates */}
              <div className='col-span-2'>
                <p className='text-xs text-muted-foreground'>Tanggal</p>
                <p className='text-sm font-medium'>{formatDate(invoice.date)}</p>
              </div>

              {/* Due Date */}
              <div className='col-span-2'>
                <p className='text-xs text-muted-foreground'>Jatuh Tempo</p>
                <p className='text-sm font-medium'>{formatDate(invoice.dueDate)}</p>
              </div>

              {/* Amount */}
              <div className='col-span-2'>
                <p className='text-xs text-muted-foreground'>Total</p>
                <p className='text-sm font-bold'>{formatCurrency(invoice.total)}</p>
              </div>

              {/* Status */}
              <div className='col-span-2'>
                <Badge className={getInvoiceStatusColor(invoice.status)}>
                  {getInvoiceStatusLabel(invoice.status)}
                </Badge>
              </div>

              {/* Actions */}
              <div className='col-span-1 flex gap-2 justify-end'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onView(invoice)}
                  className='gap-1'
                >
                  <Eye className='h-4 w-4' />
                  <span className='hidden sm:inline'>Lihat</span>
                </Button>
                {invoice.status === 'draft' && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onEdit(invoice)}
                    className='gap-1'
                  >
                    <Edit2 className='h-4 w-4' />
                    <span className='hidden sm:inline'>Edit</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
