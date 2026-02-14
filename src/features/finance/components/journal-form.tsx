'use client'

import { useState } from 'react'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type Account, type JournalEntry } from '../data/schema'
import { calculateTotalDebitsCredits, validateJournalBalance } from '../utils/calculations'
import { Trash2, Plus } from 'lucide-react'

const journalFormSchema = z.object({
  date: z.string(),
  description: z.string().min(1, 'Deskripsi harus diisi'),
  lines: z.array(
    z.object({
      accountId: z.string().min(1, 'Akun harus dipilih'),
      debit: z.coerce.number().min(0, 'Debit harus 0 atau lebih besar'),
      credit: z.coerce.number().min(0, 'Kredit harus 0 atau lebih besar'),
    })
  ),
})

type JournalFormData = z.infer<typeof journalFormSchema>

interface JournalFormProps {
  accounts: Account[]
  journal?: JournalEntry
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export function JournalForm({
  accounts,
  journal,
  onSubmit,
  isLoading = false,
}: JournalFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JournalFormData>({
    resolver: zodResolver(journalFormSchema),
    defaultValues: {
      date: journal?.date
        ? new Date(journal.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      description: journal?.description || '',
      lines: journal?.lines
        ? journal.lines.map((line) => ({
            accountId: line.accountId,
            debit: line.debit,
            credit: line.credit,
          }))
        : [
            { accountId: '', debit: 0, credit: 0 },
            { accountId: '', debit: 0, credit: 0 },
          ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lines',
  })

  const lines = watch('lines')
  const { totalDebit, totalCredit } = calculateTotalDebitsCredits(lines)
  const isBalanced = validateJournalBalance(totalDebit, totalCredit)

  const handleFormSubmit = (formData: JournalFormData) => {
    if (!isBalanced) {
      alert('Jurnal tidak balance. Jumlah debit dan kredit harus sama.')
      return
    }

    if (fields.length < 2) {
      alert('Jurnal harus memiliki minimal 2 baris transaksi.')
      return
    }

    // Prepare data with account names
    const journalLines = formData.lines.map((line) => {
      const account = accounts.find((a) => a.id === line.accountId)
      return {
        id: crypto.randomUUID(),
        accountId: line.accountId,
        accountCode: account?.code || '',
        accountName: account?.name || '',
        debit: line.debit,
        credit: line.credit,
      }
    })

    const data = {
      date: new Date(formData.date),
      description: formData.description,
      lines: journalLines,
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      {/* Date and Description */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium'>Tanggal</label>
          <Controller
            name='date'
            control={control}
            render={({ field }) => (
              <Input type='date' {...field} disabled={isLoading} />
            )}
          />
          {errors.date && <p className='text-sm text-red-500'>{errors.date.message}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium'>Deskripsi</label>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder='Deskripsi transaksi...'
              disabled={isLoading}
              rows={2}
            />
          )}
        />
        {errors.description && (
          <p className='text-sm text-red-500'>{errors.description.message}</p>
        )}
      </div>

      {/* Journal Lines */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium'>Detail Transaksi</label>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => append({ accountId: '', debit: 0, credit: 0 })}
            disabled={isLoading}
          >
            <Plus className='h-4 w-4 mr-1' />
            Tambah Baris
          </Button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b'>
                <th className='text-left px-3 py-2 font-medium'>Akun</th>
                <th className='text-right px-3 py-2 font-medium'>Debit</th>
                <th className='text-right px-3 py-2 font-medium'>Kredit</th>
                <th className='text-center px-3 py-2 font-medium'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className='border-b hover:bg-muted/50'>
                  <td className='px-3 py-2'>
                    <Controller
                      name={`lines.${index}.accountId`}
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                          <SelectTrigger>
                            <SelectValue placeholder='Pilih akun' />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((acc) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.code} - {acc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </td>
                  <td className='px-3 py-2'>
                    <Controller
                      name={`lines.${index}.debit`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='number'
                          {...field}
                          placeholder='0'
                          disabled={isLoading}
                          className='text-right'
                        />
                      )}
                    />
                  </td>
                  <td className='px-3 py-2'>
                    <Controller
                      name={`lines.${index}.credit`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type='number'
                          {...field}
                          placeholder='0'
                          disabled={isLoading}
                          className='text-right'
                        />
                      )}
                    />
                  </td>
                  <td className='px-3 py-2 text-center'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => remove(index)}
                      disabled={isLoading || fields.length <= 2}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr className='font-semibold bg-muted/50'>
                <td className='px-3 py-2'>Total</td>
                <td className='px-3 py-2 text-right'>
                  {totalDebit.toLocaleString('id-ID')}
                </td>
                <td className='px-3 py-2 text-right'>
                  {totalCredit.toLocaleString('id-ID')}
                </td>
                <td className='px-3 py-2 text-center'>
                  {isBalanced ? (
                    <span className='text-xs font-medium text-green-600'>Balance ✓</span>
                  ) : (
                    <span className='text-xs font-medium text-red-600'>Belum Balance</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className='flex gap-2'>
        <Button type='submit' disabled={isLoading || !isBalanced}>
          {isLoading ? 'Menyimpan...' : 'Simpan Jurnal'}
        </Button>
      </div>
    </form>
  )
}
