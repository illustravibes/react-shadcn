import { Invoice, InvoiceItem } from '../data/schema'
import { v4 as uuidv4 } from 'uuid'

/**
 * Generate a unique invoice number in format: INV-YYYY-MM-00001
 */
export function generateInvoiceNumber(existingInvoices: Invoice[]): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const prefix = `INV-${year}-${month}`

  const monthInvoices = existingInvoices.filter(
    (inv) => inv.invoiceNo.startsWith(prefix)
  )

  const maxSequence = monthInvoices.length > 0
    ? Math.max(
        ...monthInvoices.map((inv) => {
          const parts = inv.invoiceNo.split('-')
          return parseInt(parts[parts.length - 1], 10)
        })
      )
    : 0

  const sequence = String(maxSequence + 1).padStart(5, '0')
  return `${prefix}-${sequence}`
}

/**
 * Calculate invoice totals
 */
export function calculateInvoiceTotals(items: InvoiceItem[], taxRate: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

/**
 * Calculate individual item amount
 */
export function calculateItemAmount(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice * 100) / 100
}

/**
 * Create a new invoice
 */
export function createInvoice(
  customerName: string,
  customerEmail: string | undefined,
  items: InvoiceItem[],
  taxRate: number = 0,
  existingInvoices: Invoice[] = [],
  notes: string = ''
): Invoice {
  const invoiceNo = generateInvoiceNumber(existingInvoices)
  const now = new Date()
  const dueDate = new Date(now)
  dueDate.setDate(dueDate.getDate() + 30) // Default 30 days payment term

  const { subtotal, taxAmount, total } = calculateInvoiceTotals(items, taxRate)

  return {
    id: uuidv4(),
    invoiceNo,
    date: now,
    dueDate,
    customerName,
    customerEmail,
    items,
    subtotal,
    taxRate,
    taxAmount,
    total,
    notes,
    status: 'draft',
    autoPostJournal: true,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Check if invoice can be sent (must have valid data)
 */
export function canSendInvoice(invoice: Invoice): boolean {
  return (
    invoice.customerName.trim() !== '' &&
    invoice.items.length > 0 &&
    invoice.status === 'draft'
  )
}

/**
 * Check if invoice can be marked as paid
 */
export function canMarkPaid(invoice: Invoice): boolean {
  return invoice.status === 'sent'
}

/**
 * Check if invoice can be cancelled
 */
export function canCancelInvoice(invoice: Invoice): boolean {
  return invoice.status === 'draft' || invoice.status === 'sent'
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format date to Indonesian format
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Get invoice status label in Indonesian
 */
export function getInvoiceStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    sent: 'Terkirim',
    paid: 'Lunas',
    cancelled: 'Dibatalkan',
  }
  return labels[status] || status
}

/**
 * Get invoice status color
 */
export function getInvoiceStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
