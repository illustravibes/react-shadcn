import { type Account, type JournalEntry, type LedgerEntry } from '../data/schema'

export function getAccountBalance(
  accountId: string,
  journals: JournalEntry[]
): number {
  let balance = 0
  const postedJournals = journals.filter((j) => j.status === 'posted')

  for (const journal of postedJournals) {
    for (const line of journal.lines) {
      if (line.accountId === accountId) {
        balance += line.debit - line.credit
      }
    }
  }

  return balance
}

export function getLedgerEntries(
  accountId: string,
  journals: JournalEntry[],
  startDate?: Date,
  endDate?: Date
): LedgerEntry[] {
  const entries: LedgerEntry[] = []
  let runningBalance = 0
  const postedJournals = journals
    .filter((j) => j.status === 'posted')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  for (const journal of postedJournals) {
    // Check date range
    if (startDate && new Date(journal.date) < startDate) continue
    if (endDate && new Date(journal.date) > endDate) continue

    for (const line of journal.lines) {
      if (line.accountId === accountId) {
        const amount = line.debit - line.credit
        runningBalance += amount
        entries.push({
          id: `${journal.id}-${line.id}`,
          date: journal.date,
          journalId: journal.id,
          description: journal.description,
          debit: line.debit,
          credit: line.credit,
          balance: runningBalance,
        })
      }
    }
  }

  return entries
}

export function validateJournalBalance(
  debitTotal: number,
  creditTotal: number
): boolean {
  // Allow for floating point rounding errors
  return Math.abs(debitTotal - creditTotal) < 0.01
}

export function calculateTotalDebitsCredits(
  lines: Array<{ debit: number; credit: number }>
) {
  let totalDebit = 0
  let totalCredit = 0

  for (const line of lines) {
    totalDebit += line.debit
    totalCredit += line.credit
  }

  return { totalDebit, totalCredit }
}

export function getAccountsByType(
  accounts: Account[],
  type: Account['type']
): Account[] {
  return accounts.filter((acc) => acc.type === type)
}

export function findAccountById(
  accounts: Account[],
  accountId: string
): Account | undefined {
  return accounts.find((acc) => acc.id === accountId)
}

export function findAccountByCode(
  accounts: Account[],
  code: string
): Account | undefined {
  return accounts.find((acc) => acc.code === code)
}
