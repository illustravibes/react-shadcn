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
import { ManualJournal } from '../types'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

interface ManualJournalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  journal?: ManualJournal
}

export default function ManualJournalDialog({
  open,
  onOpenChange,
  journal,
}: ManualJournalDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [entries, setEntries] = useState(journal?.entries || [])
  const isEdit = !!journal

  const form = useForm<Partial<ManualJournal>>({
    defaultValues: journal || {
      journalNumber: '',
      journalDate: new Date().toISOString().split('T')[0],
      description: '',
      referenceNumber: '',
      status: 'DRAFT',
      entries: [],
    },
  })

  const onSubmit = async (data: Partial<ManualJournal>) => {
    if (entries.length < 2) {
      toast.error('Journal must have at least 2 entries')
      return
    }

    const totalDebits = entries.reduce((sum, e) => sum + (e.debit || 0), 0)
    const totalCredits = entries.reduce((sum, e) => sum + (e.credit || 0), 0)

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      toast.error('Debits and credits must balance')
      return
    }

    setIsSubmitting(true)
    try {
      console.log('[v0] Saving journal:', { ...data, entries })
      toast.success(isEdit ? 'Journal updated' : 'Journal created')
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('[v0] Error:', error)
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        id: `entry-${Date.now()}`,
        accountId: '',
        accountName: '',
        debit: 0,
        credit: 0,
        description: '',
        lineNumber: entries.length + 1,
      },
    ])
  }

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index))
  }

  const updateEntry = (index: number, field: string, value: any) => {
    const updated = [...entries]
    updated[index] = { ...updated[index], [field]: value }
    setEntries(updated)
  }

  const totalDebits = entries.reduce((sum, e) => sum + (e.debit || 0), 0)
  const totalCredits = entries.reduce((sum, e) => sum + (e.credit || 0), 0)
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Journal Entry' : 'Create Journal Entry'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the journal entry details'
              : 'Create a new manual journal entry'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="journalNumber"
                rules={{ required: 'Journal number is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., JNL-001" {...field} disabled={isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="journalDate"
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isEdit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter journal description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referenceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., INV-001" {...field} />
                  </FormControl>
                  <FormDescription>Optional reference to supporting document</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Journal Entries Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Journal Entries</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEntry}
                    disabled={isEdit}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Entry
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Account"
                        value={entry.accountName}
                        onChange={(e) =>
                          updateEntry(index, 'accountName', e.target.value)
                        }
                        disabled={isEdit}
                      />
                      <Input
                        placeholder="Debit"
                        type="number"
                        value={entry.debit}
                        onChange={(e) =>
                          updateEntry(index, 'debit', parseFloat(e.target.value) || 0)
                        }
                        disabled={isEdit}
                      />
                      <Input
                        placeholder="Credit"
                        type="number"
                        value={entry.credit}
                        onChange={(e) =>
                          updateEntry(index, 'credit', parseFloat(e.target.value) || 0)
                        }
                        disabled={isEdit}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Description"
                        value={entry.description || ''}
                        onChange={(e) =>
                          updateEntry(index, 'description', e.target.value)
                        }
                        disabled={isEdit}
                        className="flex-1"
                      />
                      {!isEdit && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEntry(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="border-t pt-3 mt-3 flex justify-end gap-4 text-sm font-semibold">
                  <div>Total Debits: {totalDebits.toFixed(2)}</div>
                  <div>Total Credits: {totalCredits.toFixed(2)}</div>
                  <div className={isBalanced ? 'text-green-600' : 'text-red-600'}>
                    {isBalanced ? '✓ Balanced' : '✗ Not Balanced'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isBalanced}>
                {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
