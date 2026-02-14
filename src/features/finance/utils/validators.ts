import { type Account } from '../data/schema'

export function validateAccountCode(code: string, existingCodes: string[]): {
  valid: boolean
  error?: string
} {
  // Format: D-NNNN (e.g., 1-1001)
  if (!code || !/^\d-\d{4}$/.test(code)) {
    return {
      valid: false,
      error: 'Format kode harus: D-NNNN (contoh: 1-1001)',
    }
  }

  if (existingCodes.includes(code)) {
    return {
      valid: false,
      error: 'Kode akun sudah digunakan',
    }
  }

  return { valid: true }
}

export function validateAccountName(name: string): {
  valid: boolean
  error?: string
} {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      error: 'Nama akun tidak boleh kosong',
    }
  }

  if (name.length > 100) {
    return {
      valid: false,
      error: 'Nama akun maksimal 100 karakter',
    }
  }

  return { valid: true }
}

export function validateJournalDate(date: Date): {
  valid: boolean
  error?: string
} {
  if (!date) {
    return {
      valid: false,
      error: 'Tanggal jurnal harus diisi',
    }
  }

  // Date should not be in the future
  if (date > new Date()) {
    return {
      valid: false,
      error: 'Tanggal jurnal tidak boleh di masa depan',
    }
  }

  return { valid: true }
}

export function validateJournalDescription(description: string): {
  valid: boolean
  error?: string
} {
  if (!description || description.trim().length === 0) {
    return {
      valid: false,
      error: 'Deskripsi jurnal tidak boleh kosong',
    }
  }

  if (description.length > 500) {
    return {
      valid: false,
      error: 'Deskripsi jurnal maksimal 500 karakter',
    }
  }

  return { valid: true }
}

export function validateJournalHasLines(lines: any[]): {
  valid: boolean
  error?: string
} {
  if (!lines || lines.length === 0) {
    return {
      valid: false,
      error: 'Jurnal harus memiliki minimal 2 baris transaksi',
    }
  }

  if (lines.length < 2) {
    return {
      valid: false,
      error: 'Jurnal harus memiliki minimal 2 baris transaksi',
    }
  }

  return { valid: true }
}

export function canDeleteAccount(
  accountId: string,
  journals: any[]
): {
  canDelete: boolean
  reason?: string
} {
  const hasPostedJournals = journals.some(
    (j: any) =>
      j.status === 'posted' && j.lines.some((l: any) => l.accountId === accountId)
  )

  if (hasPostedJournals) {
    return {
      canDelete: false,
      reason: 'Akun tidak dapat dihapus karena sudah memiliki jurnal yang diposting',
    }
  }

  return { canDelete: true }
}
