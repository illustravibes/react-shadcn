import { apiClient } from '@/lib/api-client'
import type {
  ChartOfAccount,
  ManualJournal,
  JournalEntry,
  Invoice,
  InvoiceItem,
  IncomeStatement,
  BalanceSheet,
  TrialBalance,
  Expense,
  BankAccount,
  BankTransaction,
  InventoryItem,
  FixedAsset,
  Employee,
  Payroll,
  PayrollEntry,
  TaxRate,
  TaxComputation,
  PettyCashAccount,
  PettyCashTransaction,
  ExchangeRate,
  AuditLog,
} from '../types'

// Chart of Accounts API
export const chartOfAccountsApi = {
  list: () => apiClient.get<ChartOfAccount[]>('/api/coa'),
  getById: (id: string) => apiClient.get<ChartOfAccount>(`/api/coa/${id}`),
  create: (data: Omit<ChartOfAccount, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<ChartOfAccount>('/api/coa', data),
  update: (id: string, data: Partial<ChartOfAccount>) =>
    apiClient.put<ChartOfAccount>(`/api/coa/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/coa/${id}`),
}

// Manual Journal API
export const manualJournalApi = {
  list: () => apiClient.get<ManualJournal[]>('/api/journals'),
  getById: (id: string) => apiClient.get<ManualJournal>(`/api/journals/${id}`),
  create: (data: Omit<ManualJournal, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<ManualJournal>('/api/journals', data),
  update: (id: string, data: Partial<ManualJournal>) =>
    apiClient.put<ManualJournal>(`/api/journals/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/journals/${id}`),
  post: (id: string) => apiClient.post<ManualJournal>(`/api/journals/${id}/post`, {}),
  reverse: (id: string) =>
    apiClient.post<ManualJournal>(`/api/journals/${id}/reverse`, {}),
}

// Invoice API
export const invoiceApi = {
  list: () => apiClient.get<Invoice[]>('/api/invoices'),
  getById: (id: string) => apiClient.get<Invoice>(`/api/invoices/${id}`),
  create: (data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Invoice>('/api/invoices', data),
  update: (id: string, data: Partial<Invoice>) =>
    apiClient.put<Invoice>(`/api/invoices/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/invoices/${id}`),
  generatePdf: (id: string) =>
    apiClient.post<Blob>(`/api/invoices/${id}/pdf`, {}),
  sendEmail: (id: string, email: string) =>
    apiClient.post<void>(`/api/invoices/${id}/send-email`, { email }),
  recordPayment: (id: string, amount: number, paymentDate: string) =>
    apiClient.post<Invoice>(`/api/invoices/${id}/record-payment`, {
      amount,
      paymentDate,
    }),
}

// Reports API
export const reportsApi = {
  getProfitLoss: (startDate: string, endDate: string) =>
    apiClient.get<IncomeStatement>('/api/reports/profit-loss', {
      params: { startDate, endDate },
    }),
  getBalanceSheet: (asOfDate: string) =>
    apiClient.get<BalanceSheet>('/api/reports/balance-sheet', {
      params: { asOfDate },
    }),
  getTrialBalance: (asOfDate: string) =>
    apiClient.get<TrialBalance>('/api/reports/trial-balance', {
      params: { asOfDate },
    }),
}

// Expense API
export const expenseApi = {
  list: () => apiClient.get<Expense[]>('/api/expenses'),
  getById: (id: string) => apiClient.get<Expense>(`/api/expenses/${id}`),
  create: (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Expense>('/api/expenses', data),
  update: (id: string, data: Partial<Expense>) =>
    apiClient.put<Expense>(`/api/expenses/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/expenses/${id}`),
  submit: (id: string) => apiClient.post<Expense>(`/api/expenses/${id}/submit`, {}),
  approve: (id: string) => apiClient.post<Expense>(`/api/expenses/${id}/approve`, {}),
  reject: (id: string, reason: string) =>
    apiClient.post<Expense>(`/api/expenses/${id}/reject`, { reason }),
}

// Bank Account API
export const bankAccountApi = {
  list: () => apiClient.get<BankAccount[]>('/api/bank-accounts'),
  getById: (id: string) => apiClient.get<BankAccount>(`/api/bank-accounts/${id}`),
  create: (data: Omit<BankAccount, 'id' | 'createdAt'>) =>
    apiClient.post<BankAccount>('/api/bank-accounts', data),
  update: (id: string, data: Partial<BankAccount>) =>
    apiClient.put<BankAccount>(`/api/bank-accounts/${id}`, data),
  getTransactions: (id: string) =>
    apiClient.get<BankTransaction[]>(`/api/bank-accounts/${id}/transactions`),
  recordPayment: (id: string, amount: number, description: string) =>
    apiClient.post<BankTransaction>(`/api/bank-accounts/${id}/receive-payment`, {
      amount,
      description,
    }),
}

// Bank Transaction API
export const bankTransactionApi = {
  list: (bankAccountId: string) =>
    apiClient.get<BankTransaction[]>('/api/bank-transactions', {
      params: { bankAccountId },
    }),
  getById: (id: string) => apiClient.get<BankTransaction>(`/api/bank-transactions/${id}`),
  create: (data: Omit<BankTransaction, 'id' | 'createdAt'>) =>
    apiClient.post<BankTransaction>('/api/bank-transactions', data),
}

// Inventory API
export const inventoryApi = {
  list: () => apiClient.get<InventoryItem[]>('/api/inventory'),
  getById: (id: string) => apiClient.get<InventoryItem>(`/api/inventory/${id}`),
  create: (data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<InventoryItem>('/api/inventory', data),
  update: (id: string, data: Partial<InventoryItem>) =>
    apiClient.put<InventoryItem>(`/api/inventory/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/inventory/${id}`),
}

// Fixed Assets API
export const fixedAssetsApi = {
  list: () => apiClient.get<FixedAsset[]>('/api/fixed-assets'),
  getById: (id: string) => apiClient.get<FixedAsset>(`/api/fixed-assets/${id}`),
  create: (data: Omit<FixedAsset, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<FixedAsset>('/api/fixed-assets', data),
  update: (id: string, data: Partial<FixedAsset>) =>
    apiClient.put<FixedAsset>(`/api/fixed-assets/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/fixed-assets/${id}`),
}

// Employee API
export const employeeApi = {
  list: () => apiClient.get<Employee[]>('/api/employees'),
  getById: (id: string) => apiClient.get<Employee>(`/api/employees/${id}`),
  create: (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Employee>('/api/employees', data),
  update: (id: string, data: Partial<Employee>) =>
    apiClient.put<Employee>(`/api/employees/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/employees/${id}`),
}

// Payroll API
export const payrollApi = {
  list: () => apiClient.get<Payroll[]>('/api/payroll'),
  getById: (id: string) => apiClient.get<Payroll>(`/api/payroll/${id}`),
  create: (data: Omit<Payroll, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Payroll>('/api/payroll', data),
  update: (id: string, data: Partial<Payroll>) =>
    apiClient.put<Payroll>(`/api/payroll/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/api/payroll/${id}`),
  process: (id: string) => apiClient.post<Payroll>(`/api/payroll/${id}/process`, {}),
}

// Tax API
export const taxApi = {
  getRates: () => apiClient.get<TaxRate[]>('/api/tax-rates'),
  getComputations: () => apiClient.get<TaxComputation[]>('/api/tax-computations'),
  createComputation: (data: Omit<TaxComputation, 'id' | 'createdAt'>) =>
    apiClient.post<TaxComputation>('/api/tax-computations', data),
  submitTaxReturn: (id: string) =>
    apiClient.post<TaxComputation>(`/api/tax-computations/${id}/submit`, {}),
}

// Petty Cash API
export const pettyCashApi = {
  listAccounts: () => apiClient.get<PettyCashAccount[]>('/api/petty-cash'),
  getAccount: (id: string) => apiClient.get<PettyCashAccount>(`/api/petty-cash/${id}`),
  createAccount: (data: Omit<PettyCashAccount, 'id' | 'createdAt'>) =>
    apiClient.post<PettyCashAccount>('/api/petty-cash', data),
  updateAccount: (id: string, data: Partial<PettyCashAccount>) =>
    apiClient.put<PettyCashAccount>(`/api/petty-cash/${id}`, data),
  getTransactions: (id: string) =>
    apiClient.get<PettyCashTransaction[]>(`/api/petty-cash/${id}/transactions`),
  addTransaction: (
    id: string,
    data: Omit<PettyCashTransaction, 'id' | 'accountId' | 'createdAt'>,
  ) => apiClient.post<PettyCashTransaction>(`/api/petty-cash/${id}/transaction`, data),
  topUp: (id: string, amount: number) =>
    apiClient.post<PettyCashAccount>(`/api/petty-cash/${id}/topup`, { amount }),
  getBalance: (id: string) =>
    apiClient.get<{ balance: number }>(`/api/petty-cash/${id}/balance`),
}

// Currency API
export const currencyApi = {
  getExchangeRates: () => apiClient.get<ExchangeRate[]>('/api/exchange-rates'),
  getRate: (from: string, to: string) =>
    apiClient.get<ExchangeRate>('/api/exchange-rates', { params: { from, to } }),
}

// Audit Trail API
export const auditApi = {
  list: () => apiClient.get<AuditLog[]>('/api/audit-trail'),
  listByEntity: (entityType: string, entityId: string) =>
    apiClient.get<AuditLog[]>('/api/audit-trail', {
      params: { entityType, entityId },
    }),
}
