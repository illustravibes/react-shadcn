import { Invoice } from '../data/schema'

/**
 * Default empty invoices list
 * In production, this would be loaded from the backend
 */
export const initialInvoices: Invoice[] = []

/**
 * Get invoices from localStorage or use defaults
 */
export function getInvoicesFromStorage(): Invoice[] {
  if (typeof window === 'undefined') return initialInvoices

  try {
    const stored = localStorage.getItem('finance_invoices')
    if (stored) {
      const invoices = JSON.parse(stored) as Invoice[]
      // Convert date strings back to Date objects
      return invoices.map((inv) => ({
        ...inv,
        date: new Date(inv.date),
        dueDate: new Date(inv.dueDate),
        createdAt: new Date(inv.createdAt),
        updatedAt: new Date(inv.updatedAt),
      }))
    }
  } catch (error) {
    console.error('Failed to load invoices from storage:', error)
  }

  return initialInvoices
}

/**
 * Save invoices to localStorage
 */
export function saveInvoicesToStorage(invoices: Invoice[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('finance_invoices', JSON.stringify(invoices))
  } catch (error) {
    console.error('Failed to save invoices to storage:', error)
  }
}
