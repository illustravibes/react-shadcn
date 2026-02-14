'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useFinance } from './finance-provider'
import { JournalDialogs } from './journal-dialogs'
import { type JournalEntry } from '../data/schema'
import { Plus, Edit2, Trash2, Check } from 'lucide-react'

export function JournalPage() {
  const { state, postJournal, deleteJournal } = useFinance()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentJournal, setCurrentJournal] = useState<JournalEntry | null>(null)

  if (state.loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <p className='text-muted-foreground'>Memuat data...</p>
      </div>
    )
  }

  const handleOpenCreate = () => {
    setCurrentJournal(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (journal: JournalEntry) => {
    setCurrentJournal(journal)
    setIsDialogOpen(true)
  }

  const handleOpenDelete = (journal: JournalEntry) => {
    if (confirm(`Hapus jurnal "${journal.referenceNo}"? Aksi ini tidak dapat dibatalkan.`)) {
      deleteJournal(journal.id)
    }
  }

  const handlePostJournal = (journalId: string) => {
    if (confirm('Posting jurnal akan mengubah statusnya menjadi final. Lanjutkan?')) {
      postJournal(journalId)
    }
  }

  const sortedJournals = [...state.journals].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Jurnal Umum</h2>
          <p className='text-muted-foreground'>
            Kelola jurnal transaksi keuangan harian
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className='h-4 w-4 mr-2' />
          Jurnal Baru
        </Button>
      </div>

      <div className='rounded-lg border overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='border-b bg-muted/50'>
              <tr>
                <th className='text-left px-4 py-3 font-medium'>No. Referensi</th>
                <th className='text-left px-4 py-3 font-medium'>Tanggal</th>
                <th className='text-left px-4 py-3 font-medium'>Deskripsi</th>
                <th className='text-right px-4 py-3 font-medium'>Total Debit</th>
                <th className='text-right px-4 py-3 font-medium'>Total Kredit</th>
                <th className='text-center px-4 py-3 font-medium'>Status</th>
                <th className='text-center px-4 py-3 font-medium'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sortedJournals.length === 0 ? (
                <tr>
                  <td colSpan={7} className='px-4 py-8 text-center text-muted-foreground'>
                    Belum ada jurnal. Buat jurnal baru untuk memulai.
                  </td>
                </tr>
              ) : (
                sortedJournals.map((journal) => {
                  const totalDebit = journal.lines.reduce((sum, line) => sum + line.debit, 0)
                  const totalCredit = journal.lines.reduce((sum, line) => sum + line.credit, 0)

                  return (
                    <tr key={journal.id} className='border-b hover:bg-muted/50'>
                      <td className='px-4 py-3 font-mono text-xs'>
                        {journal.referenceNo}
                      </td>
                      <td className='px-4 py-3'>
                        {new Date(journal.date).toLocaleDateString('id-ID')}
                      </td>
                      <td className='px-4 py-3'>{journal.description}</td>
                      <td className='px-4 py-3 text-right font-mono'>
                        {totalDebit.toLocaleString('id-ID')}
                      </td>
                      <td className='px-4 py-3 text-right font-mono'>
                        {totalCredit.toLocaleString('id-ID')}
                      </td>
                      <td className='px-4 py-3 text-center'>
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                            journal.status === 'posted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {journal.status === 'posted' ? 'Posted' : 'Draft'}
                        </span>
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex items-center justify-center gap-1'>
                          {journal.status === 'draft' && (
                            <>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleOpenEdit(journal)}
                                title='Edit'
                              >
                                <Edit2 className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handlePostJournal(journal.id)}
                                title='Post'
                              >
                                <Check className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleOpenDelete(journal)}
                                title='Hapus'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </>
                          )}
                          {journal.status === 'posted' && (
                            <span className='text-xs text-muted-foreground'>
                              Tidak dapat diedit
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <JournalDialogs
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentJournal={currentJournal}
        onJournalSelect={setCurrentJournal}
      />
    </div>
  )
}
