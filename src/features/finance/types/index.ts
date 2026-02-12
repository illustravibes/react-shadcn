// Chart of Accounts Types
export interface ChartOfAccount {
  id: string
  accountNumber: string
  accountName: string
  description?: string
  accountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE'
  accountSubType: string
  currency?: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

// Manual Journal Types
export interface ManualJournal {
  id: string
  journalNumber: string
  journalDate: string
  description?: string
  referenceNumber?: string
  status: 'DRAFT' | 'POSTED' | 'REVERSED'
  entries: JournalEntry[]
  createdAt: string
  updatedAt: string
}

export interface JournalEntry {
  id: string
  accountId: string
  accountName: string
  debit: number
  credit: number
  description?: string
  lineNumber: number
}

// Invoice Types
export interface Invoice {
  id: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  customerId: string
  customerName: string
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  currency: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  taxRate?: number
  taxAmount?: number
}

// Report Types
export interface IncomeStatement {
  period: string
  revenue: number
  costOfGoodsSold: number
  grossProfit: number
  operatingExpenses: number
  operatingIncome: number
  otherIncomeExpense: number
  netIncome: number
  generatedAt: string
}

export interface BalanceSheet {
  period: string
  assets: {
    currentAssets: number
    nonCurrentAssets: number
    totalAssets: number
  }
  liabilities: {
    currentLiabilities: number
    nonCurrentLiabilities: number
    totalLiabilities: number
  }
  equity: {
    totalEquity: number
  }
  generatedAt: string
}

export interface TrialBalance {
  period: string
  accounts: TrialBalanceAccount[]
  totalDebits: number
  totalCredits: number
  generatedAt: string
}

export interface TrialBalanceAccount {
  accountNumber: string
  accountName: string
  accountType: string
  debit: number
  credit: number
}

// Expense Types
export interface Expense {
  id: string
  expenseNumber: string
  expenseDate: string
  category: string
  description: string
  amount: number
  currency: string
  paymentMethod: string
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PAID' | 'REJECTED'
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

// Banking Types
export interface BankAccount {
  id: string
  accountNumber: string
  accountName: string
  bankName: string
  accountType: string
  balance: number
  currency: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
}

export interface BankTransaction {
  id: string
  bankAccountId: string
  transactionDate: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'
  amount: number
  description: string
  referenceNumber: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
}

// Inventory Types
export interface InventoryItem {
  id: string
  itemCode: string
  itemName: string
  description?: string
  quantity: number
  reorderLevel: number
  unitCost: number
  sellingPrice: number
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

// Fixed Assets Types
export interface FixedAsset {
  id: string
  assetNumber: string
  assetName: string
  description?: string
  category: string
  acquisitionDate: string
  acquisitionCost: number
  depreciation: number
  netBookValue: number
  status: 'ACTIVE' | 'DISPOSED'
  createdAt: string
  updatedAt: string
}

// Payroll Types
export interface Employee {
  id: string
  employeeNumber: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  position: string
  department: string
  hireDate: string
  baseSalary: number
  currency: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export interface Payroll {
  id: string
  payrollNumber: string
  payrollPeriod: string
  payrollDate: string
  employees: PayrollEntry[]
  totalGross: number
  totalDeductions: number
  totalNetPay: number
  status: 'DRAFT' | 'APPROVED' | 'PROCESSED' | 'PAID'
  createdAt: string
  updatedAt: string
}

export interface PayrollEntry {
  id: string
  employeeId: string
  employeeName: string
  grossSalary: number
  deductions: number
  netPay: number
}

// Tax Types
export interface TaxRate {
  id: string
  taxType: string
  taxCode: string
  rate: number
  effectiveDate: string
  expiryDate?: string
  status: 'ACTIVE' | 'INACTIVE'
}

export interface TaxComputation {
  id: string
  computationNumber: string
  computationDate: string
  taxType: string
  grossIncome: number
  deductions: number
  taxableIncome: number
  tax: number
  currency: string
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED'
  createdAt: string
}

// Petty Cash Types
export interface PettyCashAccount {
  id: string
  accountName: string
  initialBalance: number
  currentBalance: number
  currency: string
  status: 'ACTIVE' | 'CLOSED'
  createdAt: string
}

export interface PettyCashTransaction {
  id: string
  accountId: string
  transactionDate: string
  type: 'ADD' | 'WITHDRAW'
  amount: number
  description: string
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED'
  createdAt: string
}

// Currency Types
export interface ExchangeRate {
  baseCurrency: string
  targetCurrency: string
  rate: number
  rateDate: string
  source: string
}

// Audit Trail Types
export interface AuditLog {
  id: string
  entityType: string
  entityId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  changedFields?: Record<string, { oldValue: any; newValue: any }>
  userId: string
  timestamp: string
  details?: string
}
