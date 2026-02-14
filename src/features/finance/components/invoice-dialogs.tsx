'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { InvoiceForm } from './invoice-form'
import { useFinance } from './finance-provider'
import { type Invoice } from '../data/schema'
import { v4 as uuidv4 } from 'uuid'
import { generateInvoiceNumber, createInvoice } from '../utils/invoice-utils'
import { generateInvoiceCreationJournal, generateInvoiceCancellationJournal, generateInvoicePaidJournal } from '../utils/auto-posting'

interface InvoiceDialogsProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentInvoice: Invoice | null
  onInvoiceSelect: (invoice: Invoice | null) => void
}

export function InvoiceDialogs({
  isOpen,
  onOpenChange,
  currentInvoice,
  onInvoiceSelect,
}: InvoiceDialogsProps) {
  const { state, addInvoice, updateInvoice, deleteInvoice, updateInvoiceStatus, addJournal } =
    useFinance()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [emailDialog, setEmailDialog] = useState<'send' | null>(null)
  const [sendEmail, setSendEmail] = useState('')

  const isCreate = isOpen && !currentInvoice
  const isEdit = isOpen && !!currentInvoice && !showDeleteConfirm && !emailDialog
  const isDelete = isOpen && !!currentInvoice && showDeleteConfirm

  const handleCloseDialog = () => {
    onInvoiceSelect(null)
    onOpenChange(false)
    setIsSubmitting(false)
    setShowDeleteConfirm(false)
    setEmailDialog(null)
    setSendEmail('')
  }

  const handleCreateInvoice = async (
    data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    setIsSubmitting(true)
    try {
      const invoiceNo = generateInvoiceNumber(state.invoices)
      const now = new Date()

      const newInvoice: Invoice = {
        id: uuidv4(),
        ...data,
        invoiceNo,
        date: now,
        createdAt: now,
        updatedAt: now,
      }

      addInvoice(newInvoice)
      handleCloseDialog()
    } catch (error) {
      console.error('Error creating invoice:', error)
      alert('Gagal membuat invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateInvoice = async (
    data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!currentInvoice) return

    setIsSubmitting(true)
    try {
      updateInvoice(currentInvoice.id, {
        ...data,
        updatedAt: new Date(),
      })
      handleCloseDialog()
    } catch (error) {
      console.error('Error updating invoice:', error)
      alert('Gagal mengupdate invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteInvoice = () => {
    if (!currentInvoice) return
    deleteInvoice(currentInvoice.id)
    handleCloseDialog()
  }

  const handleSendInvoice = () => {
    if (!currentInvoice) return
    updateInvoiceStatus(currentInvoice.id, 'sent')

    // Auto-post journal if enabled
    if (currentInvoice.autoPostJournal && !currentInvoice.postedJournalId) {
      try {
        const journal = generateInvoiceCreationJournal(currentInvoice, state.accounts)
        addJournal(journal)
        updateInvoiceStatus(currentInvoice.id, 'sent', journal.id)
      } catch (error) {
        console.error('Error auto-posting journal:', error)
      }
    }

    handleCloseDialog()
  }

  const handleMarkPaid = () => {
    if (!currentInvoice) return
    updateInvoiceStatus(currentInvoice.id, 'paid')

    // Auto-post payment journal if enabled
    if (currentInvoice.autoPostJournal) {
      try {
        const journal = generateInvoicePaidJournal(currentInvoice, state.accounts)
        addJournal(journal)
      } catch (error) {
        console.error('Error auto-posting payment journal:', error)
      }
    }

    handleCloseDialog()
  }

  const handleCancelInvoice = () => {
    if (!currentInvoice) return
    updateInvoiceStatus(currentInvoice.id, 'cancelled')

    // Auto-post reversal journal if enabled
    if (currentInvoice.autoPostJournal && currentInvoice.postedJournalId) {
      try {
        const journal = generateInvoiceCancellationJournal(currentInvoice, state.accounts)
        addJournal(journal)
      } catch (error) {
        console.error('Error auto-posting cancellation journal:', error)
      }
    }

    handleCloseDialog()
  }

  return (
    <>
      {/* Create/Edit Dialog */}
      <Dialog open={isCreate || isEdit} onOpenChange={(open) => {
        if (!open) handleCloseDialog()
      }}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {isCreate ? 'Buat Invoice Baru' : 'Edit Invoice'}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? 'Buat invoice baru untuk customer'
                : `Edit invoice ${currentInvoice?.invoiceNo}`}
            </DialogDescription>
          </DialogHeader>
          <InvoiceForm
            invoice={currentInvoice || undefined}
            onSubmit={isCreate ? handleCreateInvoice : handleUpdateInvoice}
            isLoading={isSubmitting}
          />
          
          {/* Action Buttons for Sent Invoices */}
          {currentInvoice && currentInvoice.status === 'sent' && (
            <div className='flex gap-2 pt-4 border-t'>
              <Button
                variant='outline'
                onClick={handleMarkPaid}
                className='flex-1'
              >
                Tandai Lunas
              </Button>
              <Button
                variant='destructive'
                onClick={() => setShowDeleteConfirm(true)}
                className='flex-1'
              >
                Batalkan Invoice
              </Button>
            </div>
          )}
          
          {/* Action Buttons for Draft Invoices */}
          {currentInvoice && currentInvoice.status === 'draft' && (
            <div className='flex gap-2 pt-4 border-t'>
              <Button
                variant='default'
                onClick={handleSendInvoice}
                className='flex-1'
              >
                Kirim Invoice
              </Button>
              <Button
                variant='destructive'
                onClick={() => setShowDeleteConfirm(true)}
                className='flex-1'
              >
                Hapus Invoice
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDelete} onOpenChange={(open) => {
        if (!open) handleCloseDialog()
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              Invoice "{currentInvoice?.invoiceNo}" akan dihapus permanen. Aksi ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex gap-2 justify-end'>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvoice} className='bg-red-600'>
              Hapus
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
