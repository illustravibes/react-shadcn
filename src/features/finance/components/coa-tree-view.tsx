'use client'

import { type Account } from '../data/schema'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { getAccountBalance } from '../utils/calculations'

interface CoaTreeViewProps {
  accounts: Account[]
  journals: any[]
  onEdit: (account: Account) => void
  onDelete: (accountId: string) => void
}

export function CoaTreeView({
  accounts,
  journals,
  onEdit,
  onDelete,
}: CoaTreeViewProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(
    new Set(['Aset', 'Liabilitas', 'Ekuitas', 'Pendapatan', 'Beban'])
  )

  const toggleType = (type: string) => {
    const newSet = new Set(expandedTypes)
    if (newSet.has(type)) {
      newSet.delete(type)
    } else {
      newSet.add(type)
    }
    setExpandedTypes(newSet)
  }

  const accountsByType = accounts.reduce(
    (acc, account) => {
      if (!acc[account.type]) {
        acc[account.type] = []
      }
      acc[account.type].push(account)
      return acc
    },
    {} as Record<string, Account[]>
  )

  const typeOrder = ['Aset', 'Liabilitas', 'Ekuitas', 'Pendapatan', 'Beban']

  return (
    <div className='space-y-2'>
      {typeOrder.map((type) => {
        const typeAccounts = accountsByType[type] || []
        const isExpanded = expandedTypes.has(type)

        return (
          <div key={type}>
            <button
              onClick={() => toggleType(type)}
              className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-accent'
            >
              {isExpanded ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
              <span>{type}</span>
              <span className='ml-auto text-xs text-muted-foreground'>
                ({typeAccounts.length})
              </span>
            </button>

            {isExpanded && (
              <div className='space-y-1 pl-6'>
                {typeAccounts.length === 0 ? (
                  <p className='text-xs text-muted-foreground py-2'>Tidak ada akun</p>
                ) : (
                  typeAccounts.map((account) => {
                    const balance = getAccountBalance(account.id, journals)
                    return (
                      <div
                        key={account.id}
                        className='flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-accent'
                      >
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <code className='text-xs font-semibold'>{account.code}</code>
                            <span>{account.name}</span>
                          </div>
                          {account.description && (
                            <p className='text-xs text-muted-foreground ml-6'>
                              {account.description}
                            </p>
                          )}
                          <p className='text-xs text-muted-foreground ml-6'>
                            Saldo: {balance.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className='flex gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onEdit(account)}
                            title='Edit'
                          >
                            <Edit2 className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => onDelete(account.id)}
                            title='Hapus'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
