'use client'

import React, { createContext, useCallback, useReducer } from 'react'
import { type Account, type JournalEntry, type Invoice } from '../data/schema'
import { loadAccounts, saveAccounts, loadJournals, saveJournals, loadInvoices, saveInvoices } from '../utils/storage'
import { generateInvoiceCreationJournal, generateInvoiceCancellationJournal, generateInvoicePaidJournal } from '../utils/auto-posting'

type FinanceState = {
  accounts: Account[]
  journals: JournalEntry[]
  invoices: Invoice[]
  loading: boolean
}

type FinanceAction =
  | { type: 'INIT'; payload: { accounts: Account[]; journals: JournalEntry[]; invoices: Invoice[] } }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'ADD_JOURNAL'; payload: JournalEntry }
  | { type: 'UPDATE_JOURNAL'; payload: JournalEntry }
  | { type: 'DELETE_JOURNAL'; payload: string }
  | { type: 'POST_JOURNAL'; payload: string }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'UPDATE_INVOICE_STATUS'; payload: { id: string; status: string; postedJournalId?: string } }

type FinanceContextType = {
  state: FinanceState
  addAccount: (account: Account) => void
  updateAccount: (id: string, account: Partial<Account>) => void
  deleteAccount: (id: string) => void
  addJournal: (journal: JournalEntry) => void
  updateJournal: (id: string, journal: Partial<JournalEntry>) => void
  deleteJournal: (id: string) => void
  postJournal: (id: string) => void
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  updateInvoiceStatus: (id: string, status: string, postedJournalId?: string) => void
}

const FinanceContext = createContext<FinanceContextType | null>(null)

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        accounts: action.payload.accounts,
        journals: action.payload.journals,
        invoices: action.payload.invoices,
        loading: false,
      }

    case 'ADD_ACCOUNT': {
      const newAccounts = [...state.accounts, action.payload]
      saveAccounts(newAccounts)
      return { ...state, accounts: newAccounts }
    }

    case 'UPDATE_ACCOUNT': {
      const newAccounts = state.accounts.map((acc) =>
        acc.id === action.payload.id ? { ...acc, ...action.payload, updatedAt: new Date() } : acc
      )
      saveAccounts(newAccounts)
      return { ...state, accounts: newAccounts }
    }

    case 'DELETE_ACCOUNT': {
      const newAccounts = state.accounts.filter((acc) => acc.id !== action.payload)
      saveAccounts(newAccounts)
      return { ...state, accounts: newAccounts }
    }

    case 'ADD_JOURNAL': {
      const newJournals = [...state.journals, action.payload]
      saveJournals(newJournals)
      return { ...state, journals: newJournals }
    }

    case 'UPDATE_JOURNAL': {
      const newJournals = state.journals.map((journal) =>
        journal.id === action.payload.id
          ? { ...journal, ...action.payload, updatedAt: new Date() }
          : journal
      )
      saveJournals(newJournals)
      return { ...state, journals: newJournals }
    }

    case 'DELETE_JOURNAL': {
      const newJournals = state.journals.filter((journal) => journal.id !== action.payload)
      saveJournals(newJournals)
      return { ...state, journals: newJournals }
    }

    case 'POST_JOURNAL': {
      const newJournals = state.journals.map((journal) =>
        journal.id === action.payload
          ? { ...journal, status: 'posted' as const, updatedAt: new Date() }
          : journal
      )
      saveJournals(newJournals)
      return { ...state, journals: newJournals }
    }

    case 'ADD_INVOICE': {
      const newInvoices = [...state.invoices, action.payload]
      saveInvoices(newInvoices)
      return { ...state, invoices: newInvoices }
    }

    case 'UPDATE_INVOICE': {
      const newInvoices = state.invoices.map((inv) =>
        inv.id === action.payload.id ? { ...inv, ...action.payload, updatedAt: new Date() } : inv
      )
      saveInvoices(newInvoices)
      return { ...state, invoices: newInvoices }
    }

    case 'DELETE_INVOICE': {
      const newInvoices = state.invoices.filter((inv) => inv.id !== action.payload)
      saveInvoices(newInvoices)
      return { ...state, invoices: newInvoices }
    }

    case 'UPDATE_INVOICE_STATUS': {
      const newInvoices = state.invoices.map((inv) =>
        inv.id === action.payload.id
          ? {
              ...inv,
              status: action.payload.status as any,
              postedJournalId: action.payload.postedJournalId,
              updatedAt: new Date(),
            }
          : inv
      )
      saveInvoices(newInvoices)
      return { ...state, invoices: newInvoices }
    }

    default:
      return state
  }
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, {
    accounts: [],
    journals: [],
    invoices: [],
    loading: true,
  })

  // Initialize on mount
  React.useEffect(() => {
    const accounts = loadAccounts()
    const journals = loadJournals()
    const invoices = loadInvoices()
    dispatch({ type: 'INIT', payload: { accounts, journals, invoices } })
  }, [])

  const addAccount = useCallback((account: Account) => {
    dispatch({ type: 'ADD_ACCOUNT', payload: account })
  }, [])

  const updateAccount = useCallback((id: string, account: Partial<Account>) => {
    dispatch({ type: 'UPDATE_ACCOUNT', payload: { ...account, id } as Account })
  }, [])

  const deleteAccount = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ACCOUNT', payload: id })
  }, [])

  const addJournal = useCallback((journal: JournalEntry) => {
    dispatch({ type: 'ADD_JOURNAL', payload: journal })
  }, [])

  const updateJournal = useCallback((id: string, journal: Partial<JournalEntry>) => {
    dispatch({ type: 'UPDATE_JOURNAL', payload: { ...journal, id } as JournalEntry })
  }, [])

  const deleteJournal = useCallback((id: string) => {
    dispatch({ type: 'DELETE_JOURNAL', payload: id })
  }, [])

  const postJournal = useCallback((id: string) => {
    dispatch({ type: 'POST_JOURNAL', payload: id })
  }, [])

  const addInvoice = useCallback((invoice: Invoice) => {
    dispatch({ type: 'ADD_INVOICE', payload: invoice })
  }, [])

  const updateInvoice = useCallback((id: string, invoice: Partial<Invoice>) => {
    dispatch({ type: 'UPDATE_INVOICE', payload: { ...invoice, id } as Invoice })
  }, [])

  const deleteInvoice = useCallback((id: string) => {
    dispatch({ type: 'DELETE_INVOICE', payload: id })
  }, [])

  const updateInvoiceStatus = useCallback((id: string, status: string, postedJournalId?: string) => {
    dispatch({ type: 'UPDATE_INVOICE_STATUS', payload: { id, status, postedJournalId } })
  }, [])

  return (
    <FinanceContext.Provider
      value={{
        state,
        addAccount,
        updateAccount,
        deleteAccount,
        addJournal,
        updateJournal,
        deleteJournal,
        postJournal,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        updateInvoiceStatus,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const context = React.useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider')
  }
  return context
}
