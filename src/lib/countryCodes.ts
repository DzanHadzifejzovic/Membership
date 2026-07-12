export interface CountryCode {
  name: string
  dialCode: string
  flag: string
}

// Switzerland first (default) — common diaspora destinations follow.
export const COUNTRY_CODES: CountryCode[] = [
  { name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { name: 'Bosnia and Herzegovina', dialCode: '+387', flag: '🇧🇦' },
  { name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { name: 'Serbia', dialCode: '+381', flag: '🇷🇸' },
  { name: 'Croatia', dialCode: '+385', flag: '🇭🇷' },
  { name: 'Montenegro', dialCode: '+382', flag: '🇲🇪' },
  { name: 'North Macedonia', dialCode: '+389', flag: '🇲🇰' },
  { name: 'Slovenia', dialCode: '+386', flag: '🇸🇮' },
  { name: 'Kosovo', dialCode: '+383', flag: '🇽🇰' },
  { name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
]

export const DEFAULT_DIAL_CODE = '+41'

// Longest dial code first, so e.g. "+387..." matches Bosnia before a
// shorter, unrelated code could accidentally match a prefix of it.
const BY_LENGTH_DESC = [...COUNTRY_CODES].sort(
  (a, b) => b.dialCode.length - a.dialCode.length,
)

export function splitPhone(phone: string): {
  dialCode: string
  number: string
} {
  const trimmed = phone.trim()
  const match = BY_LENGTH_DESC.find((c) => trimmed.startsWith(c.dialCode))
  if (match) {
    return { dialCode: match.dialCode, number: trimmed.slice(match.dialCode.length).trim() }
  }
  return { dialCode: DEFAULT_DIAL_CODE, number: trimmed }
}
