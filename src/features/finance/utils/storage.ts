import { type Account, type JournalEntry, type Invoice } from '../data/schema'
import { initialAccounts, initialJournals } from '../data/initial-data'

const ACCOUNTS_STORAGE_KEY = 'finance_accounts'
const JOURNALS_STORAGE_KEY = 'finance_journals'
const INVOICES_STORAGE_KEY = 'finance_invoices'

export function loadAccounts(): Account[] {
  try {
    if (typeof window === 'undefined') return initialAccounts
    const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY)
    if (!stored) {
      saveAccounts(initialAccounts)
      return initialAccounts
    }
    const parsed = JSON.parse(stored)
    // Convert date strings back to Date objects
    return parsed.map((acc: any) => ({
      ...acc,
      createdAt: new Date(acc.createdAt),
      updatedAt: new Date(acc.updatedAt),
    }))
  } catch (error) {
    console.error('Error loading accounts from storage:', error)
    return initialAccounts
  }
}

export function saveAccounts(accounts: Account[]): void {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts))
  } catch (error) {
    console.error('Error saving accounts to storage:', error)
  }
}

export function loadJournals(): JournalEntry[] {
  try {
    if (typeof window === 'undefined') return initialJournals
    const stored = localStorage.getItem(JOURNALS_STORAGE_KEY)
    if (!stored) {
      saveJournals(initialJournals)
      return initialJournals
    }
    const parsed = JSON.parse(stored)
    // Convert date strings back to Date objects
    return parsed.map((journal: any) => ({
      ...journal,
      date: new Date(journal.date),
      createdAt: new Date(journal.createdAt),
      updatedAt: new Date(journal.updatedAt),
    }))
  } catch (error) {
    console.error('Error loading journals from storage:', error)
    return initialJournals
  }
}

export function saveJournals(journals: JournalEntry[]): void {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(JOURNALS_STORAGE_KEY, JSON.stringify(journals))
  } catch (error) {
    console.error('Error saving journals to storage:', error)
  }
}

export function loadInvoices(): Invoice[] {
  try {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(INVOICES_STORAGE_KEY)
    if (!stored) {
      return []
    }
    const parsed = JSON.parse(stored)
    // Convert date strings back to Date objects
    return parsed.map((invoice: any) => ({
      ...invoice,
      date: new Date(invoice.date),
      dueDate: new Date(invoice.dueDate),
      createdAt: new Date(invoice.createdAt),
      updatedAt: new Date(invoice.updatedAt),
    }))
  } catch (error) {
    console.error('Error loading invoices from storage:', error)
    return []
  }
}

export function saveInvoices(invoices: Invoice[]): void {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices))
  } catch (error) {
    console.error('Error saving invoices to storage:', error)
  }
}
