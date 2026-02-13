const API_BASE_URL = 'http://localhost:8000'

// Helper function to make API calls
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API Error: ${response.status}`)
  }

  return response.json()
}

// Chart of Accounts API
export const chartOfAccountsAPI = {
  list: () => apiCall('/api/chart-of-accounts'),
  get: (id: string) => apiCall(`/api/chart-of-accounts/${id}`),
  create: (data: any) =>
    apiCall('/api/chart-of-accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall(`/api/chart-of-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall(`/api/chart-of-accounts/${id}`, { method: 'DELETE' }),
}

// Manual Journals API
export const manualJournalsAPI = {
  list: () => apiCall('/api/manual-journals'),
  get: (id: string) => apiCall(`/api/manual-journals/${id}`),
  create: (data: any) =>
    apiCall('/api/manual-journals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall(`/api/manual-journals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall(`/api/manual-journals/${id}`, { method: 'DELETE' }),
}

// Invoices API
export const invoicesAPI = {
  list: () => apiCall('/api/invoices'),
  get: (id: string) => apiCall(`/api/invoices/${id}`),
  create: (data: any) =>
    apiCall('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall(`/api/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall(`/api/invoices/${id}`, { method: 'DELETE' }),
  send: (id: string) =>
    apiCall(`/api/invoices/${id}/send`, { method: 'POST' }),
}

// Reports API
export const reportsAPI = {
  profitLoss: () =>
    apiCall('/api/reports/profit-loss', {
      method: 'GET',
    }),
  balanceSheet: () =>
    apiCall('/api/reports/balance-sheet', {
      method: 'GET',
    }),
  trialBalance: () => apiCall('/api/reports/trial-balance'),
}

// Expenses API
export const expensesAPI = {
  list: () => apiCall('/api/expenses'),
  get: (id: string) => apiCall(`/api/expenses/${id}`),
  create: (data: any) =>
    apiCall('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall(`/api/expenses/${id}`, { method: 'DELETE' }),
}

// Banking API
export const bankingAPI = {
  accounts: () => apiCall('/api/banking/accounts'),
  transactions: () => apiCall('/api/banking/transactions'),
  createTransaction: (data: any) =>
    apiCall('/api/banking/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Inventory API
export const inventoryAPI = {
  list: () => apiCall('/api/inventory'),
  get: (id: string) => apiCall(`/api/inventory/${id}`),
  create: (data: any) =>
    apiCall('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall(`/api/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall(`/api/inventory/${id}`, { method: 'DELETE' }),
}

// Fixed Assets API
export const fixedAssetsAPI = {
  list: () => apiCall('/api/fixed-assets'),
  get: (id: string) => apiCall(`/api/fixed-assets/${id}`),
  create: (data: any) =>
    apiCall('/api/fixed-assets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiCall(`/api/fixed-assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall(`/api/fixed-assets/${id}`, { method: 'DELETE' }),
}

// Payroll API
export const payrollAPI = {
  employees: () => apiCall('/api/payroll/employees'),
  getEmployee: (id: string) => apiCall(`/api/payroll/employees/${id}`),
  createEmployee: (data: any) =>
    apiCall('/api/payroll/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateEmployee: (id: string, data: any) =>
    apiCall(`/api/payroll/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  payroll: () => apiCall('/api/payroll/payroll'),
  createPayroll: (data: any) =>
    apiCall('/api/payroll/payroll', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Tax API
export const taxAPI = {
  rates: () => apiCall('/api/tax/rates'),
  computations: () => apiCall('/api/tax/computations'),
  createComputation: (data: any) =>
    apiCall('/api/tax/computations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  reports: () => apiCall('/api/tax/reports'),
}

// Petty Cash API
export const pettyCashAPI = {
  accounts: () => apiCall('/api/petty-cash/accounts'),
  transactions: () => apiCall('/api/petty-cash/transactions'),
  createTransaction: (data: any) =>
    apiCall('/api/petty-cash/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Multi-Currency API
export const currencyAPI = {
  rates: () => apiCall('/api/currency/rates'),
  convert: (from: string, to: string, amount: number) =>
    apiCall(`/api/currency/convert?from=${from}&to=${to}&amount=${amount}`),
  supportedCurrencies: () => apiCall('/api/currency/supported'),
}

// Audit Trail API
export const auditTrailAPI = {
  list: () => apiCall('/api/audit-trail'),
  get: (id: string) => apiCall(`/api/audit-trail/${id}`),
}
