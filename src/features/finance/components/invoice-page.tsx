'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useFinance } from './finance-provider'
import { InvoiceDialogs } from './invoice-dialogs'
import { InvoiceList } from './invoice-list'
import { type Invoice } from '../data/schema'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function InvoicePage() {
  const { state } = useFinance()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  if (state.loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <p className='text-muted-foreground'>Memuat data...</p>
      </div>
    )
  }

  const handleOpenCreate = () => {
    setCurrentInvoice(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (invoice: Invoice) => {
    setCurrentInvoice(invoice)
    setIsDialogOpen(true)
  }

  const handleOpenView = (invoice: Invoice) => {
    setCurrentInvoice(invoice)
    setIsDialogOpen(true)
  }

  // Filter invoices by status
  const filteredInvoices =
    statusFilter === 'all'
      ? state.invoices
      : state.invoices.filter((inv) => inv.status === statusFilter)

  // Sort by date descending
  const sortedInvoices = [...filteredInvoices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const stats = {
    total: state.invoices.length,
    draft: state.invoices.filter((inv) => inv.status === 'draft').length,
    sent: state.invoices.filter((inv) => inv.status === 'sent').length,
    paid: state.invoices.filter((inv) => inv.status === 'paid').length,
    cancelled: state.invoices.filter((inv) => inv.status === 'cancelled').length,
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Invoice</h1>
          <p className='text-muted-foreground mt-2'>Kelola invoice penjualan Anda</p>
        </div>
        <Button onClick={handleOpenCreate} className='gap-2'>
          <Plus className='h-4 w-4' />
          Buat Invoice Baru
        </Button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-5 gap-4'>
        <Card>
          <CardContent className='pt-6'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>Total</p>
              <p className='text-2xl font-bold'>{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>Draft</p>
              <p className='text-2xl font-bold'>{stats.draft}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>Terkirim</p>
              <p className='text-2xl font-bold'>{stats.sent}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>Lunas</p>
              <p className='text-2xl font-bold'>{stats.paid}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>Dibatalkan</p>
              <p className='text-2xl font-bold'>{stats.cancelled}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center gap-4'>
            <span className='text-sm font-medium'>Filter Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-40'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua</SelectItem>
                <SelectItem value='draft'>Draft</SelectItem>
                <SelectItem value='sent'>Terkirim</SelectItem>
                <SelectItem value='paid'>Lunas</SelectItem>
                <SelectItem value='cancelled'>Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <InvoiceList
        invoices={sortedInvoices}
        onEdit={handleOpenEdit}
        onView={handleOpenView}
      />

      {/* Dialogs */}
      <InvoiceDialogs
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentInvoice={currentInvoice}
        onInvoiceSelect={setCurrentInvoice}
      />
    </div>
  )
}
