'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useFinance } from './finance-provider'
import { CoaTreeView } from './coa-tree-view'
import { CoaDialogs } from './coa-dialogs'
import { type Account } from '../data/schema'
import { Plus } from 'lucide-react'

export function CoaPage() {
  const { state } = useFinance()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null)

  if (state.loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <p className='text-muted-foreground'>Memuat data...</p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Chart of Accounts</h2>
          <p className='text-muted-foreground'>
            Kelola daftar akun untuk pencatatan transaksi keuangan
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Tambah Akun
        </Button>
      </div>

      <div className='rounded-lg border bg-card p-6'>
        <CoaTreeView
          accounts={state.accounts}
          journals={state.journals}
          onEdit={(account) => {
            setCurrentAccount(account)
            setIsDialogOpen(true)
          }}
          onDelete={(accountId) => {
            const account = state.accounts.find((a) => a.id === accountId)
            if (account) {
              setCurrentAccount(account)
              setIsDialogOpen(true)
            }
          }}
        />
      </div>

      <CoaDialogs
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentAccount={currentAccount}
        onAccountSelect={setCurrentAccount}
      />
    </div>
  )
}
