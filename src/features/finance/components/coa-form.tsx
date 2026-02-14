'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { type Account } from '../data/schema'
import { validateAccountCode, validateAccountName } from '../utils/validators'

const coaFormSchema = z.object({
  code: z.string().min(1, 'Kode akun harus diisi'),
  name: z.string().min(1, 'Nama akun harus diisi'),
  type: z.enum(['Aset', 'Liabilitas', 'Ekuitas', 'Pendapatan', 'Beban']),
  description: z.string().optional(),
})

type CoaFormData = z.infer<typeof coaFormSchema>

interface CoaFormProps {
  account?: Account
  existingCodes: string[]
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export function CoaForm({
  account,
  existingCodes,
  onSubmit,
  isLoading = false,
}: CoaFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CoaFormData>({
    resolver: zodResolver(coaFormSchema),
    defaultValues: {
      code: account?.code || '',
      name: account?.name || '',
      type: account?.type || 'Aset',
      description: account?.description || '',
    },
  })

  useEffect(() => {
    if (account) {
      reset({
        code: account.code,
        name: account.name,
        type: account.type,
        description: account.description,
      })
    }
  }, [account, reset])

  const handleFormSubmit = (data: CoaFormData) => {
    // Validate code format and uniqueness
    const codeValidation = validateAccountCode(
      data.code,
      existingCodes.filter((c) => c !== account?.code)
    )
    if (!codeValidation.valid) {
      console.error('Code validation error:', codeValidation.error)
      return
    }

    // Validate name
    const nameValidation = validateAccountName(data.name)
    if (!nameValidation.valid) {
      console.error('Name validation error:', nameValidation.error)
      return
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <label className='block text-sm font-medium'>Kode Akun</label>
        <Controller
          name='code'
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder='Contoh: 1-1001'
              disabled={isLoading || !!account}
            />
          )}
        />
        {errors.code && <p className='text-sm text-red-500'>{errors.code.message}</p>}
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium'>Nama Akun</label>
        <Controller
          name='name'
          control={control}
          render={({ field }) => <Input {...field} placeholder='Kas Operasional' disabled={isLoading} />}
        />
        {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium'>Tipe Akun</label>
        <Controller
          name='type'
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Aset'>Aset</SelectItem>
                <SelectItem value='Liabilitas'>Liabilitas</SelectItem>
                <SelectItem value='Ekuitas'>Ekuitas</SelectItem>
                <SelectItem value='Pendapatan'>Pendapatan</SelectItem>
                <SelectItem value='Beban'>Beban</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && <p className='text-sm text-red-500'>{errors.type.message}</p>}
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium'>Deskripsi (Opsional)</label>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <Textarea {...field} placeholder='Deskripsi akun...' disabled={isLoading} rows={3} />
          )}
        />
        {errors.description && (
          <p className='text-sm text-red-500'>{errors.description.message}</p>
        )}
      </div>

      <div className='flex gap-2'>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}
