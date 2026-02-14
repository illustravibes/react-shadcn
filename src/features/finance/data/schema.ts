import { z } from 'zod'

// Chart of Accounts Schema
export const accountSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  type: z.enum(['Aset', 'Liabilitas', 'Ekuitas', 'Pendapatan', 'Beban']),
  description: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Account = z.infer<typeof accountSchema>

// Journal Line Schema
export const journalLineSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  accountCode: z.string(),
  accountName: z.string(),
  debit: z.number().default(0),
  credit: z.number().default(0),
})

export type JournalLine = z.infer<typeof journalLineSchema>

// Journal Entry Schema
export const journalEntrySchema = z.object({
  id: z.string(),
  date: z.date(),
  referenceNo: z.string(),
  description: z.string(),
  lines: z.array(journalLineSchema),
  status: z.enum(['draft', 'posted']).default('draft'),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type JournalEntry = z.infer<typeof journalEntrySchema>

// Ledger Entry Schema (computed from journals)
export const ledgerEntrySchema = z.object({
  id: z.string(),
  date: z.date(),
  journalId: z.string(),
  description: z.string(),
  debit: z.number(),
  credit: z.number(),
  balance: z.number(),
})

export type LedgerEntry = z.infer<typeof ledgerEntrySchema>
