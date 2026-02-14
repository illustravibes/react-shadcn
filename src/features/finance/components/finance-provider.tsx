'use client'

import React, { createContext, useCallback, useReducer } from 'react'
import { type Account, type JournalEntry } from '../data/schema'
import { loadAccounts, saveAccounts, loadJournals, saveJournals } from '../utils/storage'

type FinanceState = {
  accounts: Account[]
  journals: JournalEntry[]
  loading: boolean
}

type FinanceAction =
  | { type: 'INIT'; payload: { accounts: Account[]; journals: JournalEntry[] } }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'ADD_JOURNAL'; payload: JournalEntry }
  | { type: 'UPDATE_JOURNAL'; payload: JournalEntry }
  | { type: 'DELETE_JOURNAL'; payload: string }
  | { type: 'POST_JOURNAL'; payload: string }

type FinanceContextType = {
  state: FinanceState
  addAccount: (account: Account) => void
  updateAccount: (id: string, account: Partial<Account>) => void
  deleteAccount: (id: string) => void
  addJournal: (journal: JournalEntry) => void
  updateJournal: (id: string, journal: Partial<JournalEntry>) => void
  deleteJournal: (id: string) => void
  postJournal: (id: string) => void
}

const FinanceContext = createContext<FinanceContextType | null>(null)

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        accounts: action.payload.accounts,
        journals: action.payload.journals,
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

    default:
      return state
  }
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, {
    accounts: [],
    journals: [],
    loading: true,
  })

  // Initialize on mount
  React.useEffect(() => {
    const accounts = loadAccounts()
    const journals = loadJournals()
    dispatch({ type: 'INIT', payload: { accounts, journals } })
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
