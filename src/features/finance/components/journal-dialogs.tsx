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
import { JournalForm } from './journal-form'
import { useFinance } from './finance-provider'
import { type JournalEntry } from '../data/schema'
import { v4 as uuidv4 } from 'uuid'

interface JournalDialogsProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentJournal: JournalEntry | null
  onJournalSelect: (journal: JournalEntry | null) => void
}

export function JournalDialogs({
  isOpen,
  onOpenChange,
  currentJournal,
  onJournalSelect,
}: JournalDialogsProps) {
  const { state, addJournal, updateJournal, deleteJournal } = useFinance()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleCloseDialog = () => {
    onJournalSelect(null)
    onOpenChange(false)
    setIsSubmitting(false)
    setShowDeleteConfirm(false)
  }

  const generateReferenceNo = () => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
    const sequence = (state.journals.filter((j) =>
      j.referenceNo.startsWith(`JNL/${dateStr}`)
    ).length + 1)
      .toString()
      .padStart(3, '0')
    return `JNL/${dateStr}/${sequence}`
  }

  const handleCreateJournal = async (formData: any) => {
    setIsSubmitting(true)
    try {
      const newJournal: JournalEntry = {
        id: uuidv4(),
        date: formData.date,
        referenceNo: generateReferenceNo(),
        description: formData.description,
        lines: formData.lines,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addJournal(newJournal)
      handleCloseDialog()
    } catch (error) {
      console.error('Error creating journal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateJournal = async (formData: any) => {
    if (!currentJournal) return

    setIsSubmitting(true)
    try {
      updateJournal(currentJournal.id, {
        date: formData.date,
        description: formData.description,
        lines: formData.lines,
        updatedAt: new Date(),
      })
      handleCloseDialog()
    } catch (error) {
      console.error('Error updating journal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteJournal = () => {
    if (!currentJournal) return
    deleteJournal(currentJournal.id)
    handleCloseDialog()
  }

  const isCreate = isOpen && !currentJournal
  const isEdit = isOpen && !!currentJournal && !showDeleteConfirm
  const isDelete = isOpen && !!currentJournal && showDeleteConfirm

  return (
    <>
      {/* Create/Edit Dialog */}
      <Dialog open={isCreate || isEdit} onOpenChange={(open) => {
        if (!open) handleCloseDialog()
      }}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>
              {isCreate ? 'Buat Jurnal Baru' : 'Edit Jurnal'}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? 'Buat jurnal baru untuk mencatat transaksi keuangan'
                : 'Ubah detail jurnal'}
            </DialogDescription>
          </DialogHeader>
          <JournalForm
            accounts={state.accounts}
            journal={currentJournal || undefined}
            onSubmit={isCreate ? handleCreateJournal : handleUpdateJournal}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDelete} onOpenChange={(open) => {
        if (!open) handleCloseDialog()
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jurnal?</AlertDialogTitle>
            <AlertDialogDescription>
              Jurnal "{currentJournal?.referenceNo}" akan dihapus permanen. Aksi ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex gap-2 justify-end'>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteJournal} className='bg-red-600'>
              Hapus
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
