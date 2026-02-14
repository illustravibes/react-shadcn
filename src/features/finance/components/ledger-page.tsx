'use client'

import { useState } from 'react'
import { useFinance } from './finance-provider'
import { getLedgerEntries, getAccountBalance } from '../utils/calculations'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

export function LedgerPage() {
  const { state } = useFinance()
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  if (state.loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <p className='text-muted-foreground'>Memuat data...</p>
      </div>
    )
  }

  const selectedAccount = state.accounts.find((a) => a.id === selectedAccountId)

  const ledgerEntries = selectedAccountId
    ? getLedgerEntries(
        selectedAccountId,
        state.journals,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      )
    : []

  const accountBalance = selectedAccountId
    ? getAccountBalance(selectedAccountId, state.journals)
    : 0

  const handleReset = () => {
    setSelectedAccountId('')
    setStartDate('')
    setEndDate('')
  }

  const activeAccounts = state.accounts.filter((a) => a.isActive)

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Buku Besar</h2>
        <p className='text-muted-foreground'>
          Lihat detail transaksi dan saldo setiap akun
        </p>
      </div>

      {/* Filters */}
      <div className='rounded-lg border bg-card p-4 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <label className='block text-sm font-medium'>Pilih Akun</label>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger>
                <SelectValue placeholder='Pilih akun...' />
              </SelectTrigger>
              <SelectContent>
                {activeAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium'>Dari Tanggal</label>
            <Input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium'>Sampai Tanggal</label>
            <Input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className='flex gap-2'>
          <Button variant='outline' onClick={handleReset} size='sm'>
            <RotateCcw className='h-4 w-4 mr-2' />
            Reset
          </Button>
        </div>
      </div>

      {/* Results */}
      {selectedAccountId ? (
        <div className='space-y-6'>
          {/* Account Summary */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='rounded-lg border bg-card p-4'>
              <div className='text-sm text-muted-foreground'>Kode Akun</div>
              <div className='text-2xl font-bold'>{selectedAccount?.code}</div>
            </div>
            <div className='rounded-lg border bg-card p-4'>
              <div className='text-sm text-muted-foreground'>Nama Akun</div>
              <div className='text-2xl font-bold'>{selectedAccount?.name}</div>
            </div>
            <div className='rounded-lg border bg-card p-4'>
              <div className='text-sm text-muted-foreground'>Saldo Akun</div>
              <div className='text-2xl font-bold'>
                {accountBalance.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className='rounded-lg border overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead className='border-b bg-muted/50'>
                  <tr>
                    <th className='text-left px-4 py-3 font-medium'>Tanggal</th>
                    <th className='text-left px-4 py-3 font-medium'>Deskripsi</th>
                    <th className='text-right px-4 py-3 font-medium'>Debit</th>
                    <th className='text-right px-4 py-3 font-medium'>Kredit</th>
                    <th className='text-right px-4 py-3 font-medium'>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerEntries.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className='px-4 py-8 text-center text-muted-foreground'
                      >
                        Tidak ada transaksi untuk akun ini pada periode yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    ledgerEntries.map((entry) => (
                      <tr key={entry.id} className='border-b hover:bg-muted/50'>
                        <td className='px-4 py-3'>
                          {new Date(entry.date).toLocaleDateString('id-ID')}
                        </td>
                        <td className='px-4 py-3'>{entry.description}</td>
                        <td className='px-4 py-3 text-right font-mono'>
                          {entry.debit > 0 ? entry.debit.toLocaleString('id-ID') : '-'}
                        </td>
                        <td className='px-4 py-3 text-right font-mono'>
                          {entry.credit > 0 ? entry.credit.toLocaleString('id-ID') : '-'}
                        </td>
                        <td className='px-4 py-3 text-right font-mono font-semibold'>
                          {entry.balance.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className='rounded-lg border bg-card p-12 text-center'>
          <p className='text-muted-foreground'>Pilih akun untuk melihat detail buku besar</p>
        </div>
      )}
    </div>
  )
}
