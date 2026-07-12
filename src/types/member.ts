export const FIRST_YEAR = 2015
// Default upper bound, used until an admin extends it (see useYearRange /
// meta/settings). Membership fees can be issued past this year once
// extended — this constant is only the starting default.
export const DEFAULT_LAST_YEAR = 2030

export function buildYears(lastYear: number): number[] {
  return Array.from(
    { length: lastYear - FIRST_YEAR + 1 },
    (_, i) => FIRST_YEAR + i,
  )
}

// Fallback range for code paths that run before the live setting loads.
export const YEARS: number[] = buildYears(DEFAULT_LAST_YEAR)

// Keyed by year as string (Firestore map keys must be strings), value is the
// amount (iznos) paid for that year. A missing/0 entry means unpaid.
export type PaymentMap = Record<string, number>

export interface FamilyInfo {
  memberCount?: number
  ages?: string
  phones?: string
  notes?: string
}

export interface Member {
  id: string
  firstName: string
  lastName: string
  fullName: string
  searchKey: string
  // Assigned automatically on creation (sequential), never user-editable.
  cardNumber: string
  phone: string
  address: string
  joinDate: string // ISO date string (yyyy-MM-dd)
  payments: PaymentMap
  familyInfo?: FamilyInfo
  createdAt: number
  updatedAt: number
  // Soft delete — kept for audit/history, hidden from the active member list.
  deleted?: boolean
  deletedAt?: number
}

export type MemberInput = Omit<
  Member,
  | 'id'
  | 'fullName'
  | 'searchKey'
  | 'cardNumber'
  | 'createdAt'
  | 'updatedAt'
  | 'deleted'
  | 'deletedAt'
>

export function emptyPayments(): PaymentMap {
  return Object.fromEntries(YEARS.map((y) => [String(y), 0]))
}

export function buildSearchKey(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim().toLowerCase()
}

export function totalPaid(payments: PaymentMap): number {
  return Object.values(payments).reduce((sum, v) => sum + (v || 0), 0)
}

export function paidYearCount(payments: PaymentMap): number {
  return Object.values(payments).filter((v) => v > 0).length
}
