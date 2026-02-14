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
import { useFinance } from './finance-provider'
import { CoaForm } from './coa-form'
import { type Account } from '../data/schema'
import { canDeleteAccount } from '../utils/validators'
import { v4 as uuidv4 } from 'uuid'

type DialogType = 'create' | 'edit' | 'delete' | null

interface CoaDialogsProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentAccount: Account | null
  onAccountSelect: (account: Account | null) => void
}

export function CoaDialogs({
  isOpen,
  onOpenChange,
  currentAccount,
  onAccountSelect,
}: CoaDialogsProps) {
  const { state, addAccount, updateAccount, deleteAccount } = useFinance()
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenCreateDialog = () => {
    setDialogType('create')
    onAccountSelect(null)
  }

  const handleOpenEditDialog = (account: Account) => {
    onAccountSelect(account)
    setDialogType('edit')
  }

  const handleOpenDeleteDialog = (account: Account) => {
    onAccountSelect(account)
    setDialogType('delete')
  }

  const handleCloseDialog = () => {
    setDialogType(null)
    onAccountSelect(null)
    onOpenChange(false)
    setIsSubmitting(false)
  }

  const handleCreateAccount = async (formData: any) => {
    setIsSubmitting(true)
    try {
      const newAccount: Account = {
        id: formData.code,
        code: formData.code,
        name: formData.name,
        type: formData.type,
        description: formData.description || undefined,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addAccount(newAccount)
      handleCloseDialog()
    } catch (error) {
      console.error('Error creating account:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateAccount = async (formData: any) => {
    if (!currentAccount) return

    setIsSubmitting(true)
    try {
      updateAccount(currentAccount.id, {
        ...formData,
        updatedAt: new Date(),
      })
      handleCloseDialog()
    } catch (error) {
      console.error('Error updating account:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = () => {
    if (!currentAccount) return

    const { canDelete, reason } = canDeleteAccount(currentAccount.id, state.journals)
    if (!canDelete) {
      alert(reason)
      return
    }

    deleteAccount(currentAccount.id)
    handleCloseDialog()
  }

  const existingCodes = state.accounts.map((acc) => acc.code)

  return (
    <>
      {/* Create/Edit Dialog */}
      <Dialog open={dialogType === 'create' || dialogType === 'edit'} onOpenChange={(open) => {
        if (!open) handleCloseDialog()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'create' ? 'Tambah Akun' : 'Edit Akun'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'create'
                ? 'Buat akun baru dalam Chart of Accounts'
                : 'Ubah detail akun'}
            </DialogDescription>
          </DialogHeader>
          <CoaForm
            account={currentAccount || undefined}
            existingCodes={existingCodes}
            onSubmit={dialogType === 'create' ? handleCreateAccount : handleUpdateAccount}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={dialogType === 'delete'} onOpenChange={(open) => {
        if (!open) handleCloseDialog()
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Akun?</AlertDialogTitle>
            <AlertDialogDescription>
              Akun "{currentAccount?.name}" akan dihapus permanen. Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex gap-2 justify-end'>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className='bg-red-600'>
              Hapus
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
