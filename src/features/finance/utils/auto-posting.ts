import { v4 as uuidv4 } from 'uuid'
import { type Invoice, type JournalEntry, type Account } from '../data/schema'
import { findAccountByCode } from './calculations'

/**
 * Auto-posting configuration for invoice transactions
 * Maps invoice status changes to journal entry templates
 */
export const AUTO_POSTING_CONFIG = {
  invoiceCreated: {
    description: 'Auto-posting: Invoice created',
    getAccounts: (accounts: Account[]) => ({
      ar: findAccountByCode(accounts, '113'), // Accounts Receivable
      revenue: findAccountByCode(accounts, '411'), // Service Revenue
    }),
  },
  invoiceCancelled: {
    description: 'Auto-posting: Invoice cancelled (reversal)',
    getAccounts: (accounts: Account[]) => ({
      ar: findAccountByCode(accounts, '113'), // Accounts Receivable
      revenue: findAccountByCode(accounts, '411'), // Service Revenue
    }),
  },
  invoicePaid: {
    description: 'Auto-posting: Invoice paid',
    getAccounts: (accounts: Account[]) => ({
      ar: findAccountByCode(accounts, '113'), // Accounts Receivable
      cash: findAccountByCode(accounts, '111'), // Cash
    }),
  },
}

/**
 * Generate a journal entry when an invoice is created
 * Debit: Accounts Receivable
 * Credit: Service Revenue
 */
export function generateInvoiceCreationJournal(
  invoice: Invoice,
  accounts: Account[]
): JournalEntry {
  const arAccount = findAccountByCode(accounts, '113')
  const revenueAccount = findAccountByCode(accounts, '411')

  if (!arAccount || !revenueAccount) {
    throw new Error(
      'Required accounts not found: Accounts Receivable (113) or Service Revenue (411)'
    )
  }

  return {
    id: uuidv4(),
    date: invoice.date,
    referenceNo: `INV-${invoice.invoiceNo}`,
    description: `Invoice ${invoice.invoiceNo} - ${invoice.customerName}`,
    lines: [
      {
        id: uuidv4(),
        accountId: arAccount.id,
        accountCode: arAccount.code,
        accountName: arAccount.name,
        debit: invoice.total,
        credit: 0,
      },
      {
        id: uuidv4(),
        accountId: revenueAccount.id,
        accountCode: revenueAccount.code,
        accountName: revenueAccount.name,
        debit: 0,
        credit: invoice.total,
      },
    ],
    status: 'posted',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Generate a reversal journal entry when an invoice is cancelled
 * Reverses the original invoice creation entry
 */
export function generateInvoiceCancellationJournal(
  invoice: Invoice,
  accounts: Account[]
): JournalEntry {
  const arAccount = findAccountByCode(accounts, '113')
  const revenueAccount = findAccountByCode(accounts, '411')

  if (!arAccount || !revenueAccount) {
    throw new Error(
      'Required accounts not found: Accounts Receivable (113) or Service Revenue (411)'
    )
  }

  return {
    id: uuidv4(),
    date: new Date(),
    referenceNo: `INV-CANCEL-${invoice.invoiceNo}`,
    description: `Invoice Cancellation ${invoice.invoiceNo} - ${invoice.customerName}`,
    lines: [
      {
        id: uuidv4(),
        accountId: revenueAccount.id,
        accountCode: revenueAccount.code,
        accountName: revenueAccount.name,
        debit: invoice.total,
        credit: 0,
      },
      {
        id: uuidv4(),
        accountId: arAccount.id,
        accountCode: arAccount.code,
        accountName: arAccount.name,
        debit: 0,
        credit: invoice.total,
      },
    ],
    status: 'posted',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Generate a journal entry when an invoice is paid
 * Debit: Cash
 * Credit: Accounts Receivable
 */
export function generateInvoicePaidJournal(
  invoice: Invoice,
  accounts: Account[]
): JournalEntry {
  const arAccount = findAccountByCode(accounts, '113')
  const cashAccount = findAccountByCode(accounts, '111')

  if (!arAccount || !cashAccount) {
    throw new Error(
      'Required accounts not found: Accounts Receivable (113) or Cash (111)'
    )
  }

  return {
    id: uuidv4(),
    date: new Date(),
    referenceNo: `PAID-${invoice.invoiceNo}`,
    description: `Payment received for Invoice ${invoice.invoiceNo}`,
    lines: [
      {
        id: uuidv4(),
        accountId: cashAccount.id,
        accountCode: cashAccount.code,
        accountName: cashAccount.name,
        debit: invoice.total,
        credit: 0,
      },
      {
        id: uuidv4(),
        accountId: arAccount.id,
        accountCode: arAccount.code,
        accountName: arAccount.name,
        debit: 0,
        credit: invoice.total,
      },
    ],
    status: 'posted',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
