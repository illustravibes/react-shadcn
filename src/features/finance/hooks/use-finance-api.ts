import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as financeAPI from '@/lib/finance-api'

// Chart of Accounts Hooks
export function useChartOfAccounts() {
  return useQuery({
    queryKey: ['chartOfAccounts'],
    queryFn: () => financeAPI.chartOfAccountsAPI.list(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => financeAPI.chartOfAccountsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] })
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      financeAPI.chartOfAccountsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] })
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => financeAPI.chartOfAccountsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccounts'] })
    },
  })
}

// Manual Journals Hooks
export function useManualJournals() {
  return useQuery({
    queryKey: ['manualJournals'],
    queryFn: () => financeAPI.manualJournalsAPI.list(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateJournal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => financeAPI.manualJournalsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manualJournals'] })
    },
  })
}

// Invoices Hooks
export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => financeAPI.invoicesAPI.list(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => financeAPI.invoicesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    },
  })
}

// Reports Hooks
export function useProfitLossReport(params?: any) {
  return useQuery({
    queryKey: ['reports', 'profitLoss', params],
    queryFn: () => financeAPI.reportsAPI.profitLoss(params),
    staleTime: 1000 * 60 * 30,
  })
}

export function useBalanceSheetReport(params?: any) {
  return useQuery({
    queryKey: ['reports', 'balanceSheet', params],
    queryFn: () => financeAPI.reportsAPI.balanceSheet(params),
    staleTime: 1000 * 60 * 30,
  })
}

export function useTrialBalanceReport() {
  return useQuery({
    queryKey: ['reports', 'trialBalance'],
    queryFn: () => financeAPI.reportsAPI.trialBalance(),
    staleTime: 1000 * 60 * 30,
  })
}

// Expenses Hooks
export function useExpenses() {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: () => financeAPI.expensesAPI.list(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => financeAPI.expensesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}

// Banking Hooks
export function useBankAccounts() {
  return useQuery({
    queryKey: ['bankAccounts'],
    queryFn: () => financeAPI.bankingAPI.accounts(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useBankTransactions() {
  return useQuery({
    queryKey: ['bankTransactions'],
    queryFn: () => financeAPI.bankingAPI.transactions(),
    staleTime: 1000 * 60 * 5,
  })
}

// Inventory Hooks
export function useInventory() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: () => financeAPI.inventoryAPI.list(),
    staleTime: 1000 * 60 * 5,
  })
}

// Fixed Assets Hooks
export function useFixedAssets() {
  return useQuery({
    queryKey: ['fixedAssets'],
    queryFn: () => financeAPI.fixedAssetsAPI.list(),
    staleTime: 1000 * 60 * 5,
  })
}

// Payroll Hooks
export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => financeAPI.payrollAPI.employees(),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePayroll() {
  return useQuery({
    queryKey: ['payroll'],
    queryFn: () => financeAPI.payrollAPI.payroll(),
    staleTime: 1000 * 60 * 5,
  })
}

// Tax Hooks
export function useTaxRates() {
  return useQuery({
    queryKey: ['taxRates'],
    queryFn: () => financeAPI.taxAPI.rates(),
    staleTime: 1000 * 60 * 30,
  })
}

export function useTaxComputations() {
  return useQuery({
    queryKey: ['taxComputations'],
    queryFn: () => financeAPI.taxAPI.computations(),
    staleTime: 1000 * 60 * 5,
  })
}

// Petty Cash Hooks
export function usePettyCashAccounts() {
  return useQuery({
    queryKey: ['pettyCashAccounts'],
    queryFn: () => financeAPI.pettyCashAPI.accounts(),
    staleTime: 1000 * 60 * 5,
  })
}

// Currency Hooks
export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchangeRates'],
    queryFn: () => financeAPI.currencyAPI.rates(),
    staleTime: 1000 * 60 * 60,
  })
}

// Audit Trail Hooks
export function useAuditTrail() {
  return useQuery({
    queryKey: ['auditTrail'],
    queryFn: () => financeAPI.auditTrailAPI.list(),
    staleTime: 1000 * 60 * 5,
  })
}
