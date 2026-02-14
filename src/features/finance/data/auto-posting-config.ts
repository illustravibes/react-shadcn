/**
 * Auto-Posting Configuration
 * Defines rules for automatically generating journal entries based on business events
 */

export interface AutoPostingRule {
  id: string
  name: string
  description: string
  event: 'invoice_created' | 'invoice_sent' | 'invoice_paid' | 'invoice_cancelled'
  enabled: boolean
  journalConfig: {
    debitAccountId?: string
    creditAccountId?: string
    debitAccountCode?: string
    creditAccountCode?: string
  }
}

export interface AutoPostingRules {
  rules: AutoPostingRule[]
}

/**
 * Default auto-posting rules for Indonesian accounting
 * Assumes standard COA structure:
 * - Piutang Usaha (1102): Receivable account
 * - Pendapatan Jasa (4101): Service revenue account
 * - Hutang Usaha (2101): Payable account (for expenses)
 * - Beban Operasional (5101): Operating expense account
 */
export const defaultAutoPostingRules: AutoPostingRules = {
  rules: [
    {
      id: 'invoice_created',
      name: 'Invoice Created',
      description: 'Automatically post invoice to journal when created',
      event: 'invoice_created',
      enabled: false, // Disabled by default, user can enable
      journalConfig: {
        // Dr: Piutang Usaha, Cr: Pendapatan Jasa
        debitAccountCode: '1102',
        creditAccountCode: '4101',
      },
    },
    {
      id: 'invoice_sent',
      name: 'Invoice Sent',
      description: 'Post journal entry when invoice is sent to customer',
      event: 'invoice_sent',
      enabled: true, // Enabled by default for invoicing workflow
      journalConfig: {
        debitAccountCode: '1102',
        creditAccountCode: '4101',
      },
    },
    {
      id: 'invoice_paid',
      name: 'Invoice Paid',
      description: 'Post payment receipt journal when invoice is marked paid',
      event: 'invoice_paid',
      enabled: true,
      journalConfig: {
        // Dr: Bank Account, Cr: Piutang Usaha
        debitAccountCode: '1101', // Bank/Cash account
        creditAccountCode: '1102', // Receivable
      },
    },
    {
      id: 'invoice_cancelled',
      name: 'Invoice Cancelled',
      description: 'Post reversal journal when invoice is cancelled',
      event: 'invoice_cancelled',
      enabled: true,
      journalConfig: {
        // Reverse the original entry: Dr: Pendapatan Jasa, Cr: Piutang Usaha
        debitAccountCode: '4101', // Revenue
        creditAccountCode: '1102', // Receivable
      },
    },
  ],
}

/**
 * Get rule for a specific event
 */
export function getRuleForEvent(
  event: 'invoice_created' | 'invoice_sent' | 'invoice_paid' | 'invoice_cancelled',
  rules: AutoPostingRules = defaultAutoPostingRules
): AutoPostingRule | null {
  const rule = rules.rules.find((r) => r.event === event)
  return rule && rule.enabled ? rule : null
}

/**
 * Get all enabled rules
 */
export function getEnabledRules(
  rules: AutoPostingRules = defaultAutoPostingRules
): AutoPostingRule[] {
  return rules.rules.filter((r) => r.enabled)
}
