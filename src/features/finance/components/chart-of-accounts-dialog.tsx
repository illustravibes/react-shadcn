import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { ChartOfAccount } from '../types'
import { toast } from 'sonner'

interface ChartOfAccountsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: ChartOfAccount
}

const accountTypes = [
  { value: 'ASSET', label: 'Asset' },
  { value: 'LIABILITY', label: 'Liability' },
  { value: 'EQUITY', label: 'Equity' },
  { value: 'INCOME', label: 'Income' },
  { value: 'EXPENSE', label: 'Expense' },
]

const accountSubTypes: Record<string, string[]> = {
  ASSET: ['Current Asset', 'Fixed Asset', 'Intangible Asset'],
  LIABILITY: ['Current Liability', 'Long-term Liability'],
  EQUITY: ['Common Stock', 'Retained Earnings', 'Contributed Capital'],
  INCOME: ['Operating Revenue', 'Non-operating Revenue'],
  EXPENSE: ['Cost of Sales', 'Operating Expense', 'Non-operating Expense'],
}

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD']

export default function ChartOfAccountsDialog({
  open,
  onOpenChange,
  account,
}: ChartOfAccountsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEdit = !!account

  const form = useForm<Partial<ChartOfAccount>>({
    defaultValues: account || {
      accountNumber: '',
      accountName: '',
      description: '',
      accountType: 'ASSET',
      accountSubType: 'Current Asset',
      currency: 'USD',
      status: 'ACTIVE',
    },
  })

  const selectedType = form.watch('accountType')

  const onSubmit = async (data: Partial<ChartOfAccount>) => {
    setIsSubmitting(true)
    try {
      if (isEdit) {
        console.log('[v0] Updating account:', data)
        toast.success('Account updated successfully')
      } else {
        console.log('[v0] Creating account:', data)
        toast.success('Account created successfully')
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('[v0] Error:', error)
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Account' : 'Add New Account'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the account details below'
              : 'Fill in the details to create a new chart of account entry'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="accountNumber"
              rules={{ required: 'Account number is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountName"
              rules={{ required: 'Account name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cash and Cash Equivalents" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter account description..." {...field} />
                  </FormControl>
                  <FormDescription>Optional description for this account</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accountTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountSubType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedType &&
                          accountSubTypes[selectedType]?.map((subType) => (
                            <SelectItem key={subType} value={subType}>
                              {subType}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr} value={curr}>
                            {curr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
