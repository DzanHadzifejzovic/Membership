import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Users } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FamilyInfoDialog } from '@/components/FamilyInfoDialog'
import { createMember, updateMember } from '@/firebase/members'
import { useYearRange } from '@/hooks/useYearRange'
import { COUNTRY_CODES, DEFAULT_DIAL_CODE, splitPhone } from '@/lib/countryCodes'
import {
  buildSearchKey,
  emptyPayments,
  type FamilyInfo,
  type Member,
  type MemberInput,
} from '@/types/member'

interface MemberFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: Member | null
  existingMembers: Member[]
  onEditExisting: (member: Member) => void
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function hasFamilyInfo(info: FamilyInfo): boolean {
  return Boolean(info.memberCount || info.ages || info.phones || info.notes)
}

export function MemberFormDialog({
  open,
  onOpenChange,
  member,
  existingMembers,
  onEditExisting,
}: MemberFormDialogProps) {
  const isEditing = member != null
  const { years } = useYearRange()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneDialCode, setPhoneDialCode] = useState(DEFAULT_DIAL_CODE)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [joinDate, setJoinDate] = useState(todayIso())
  const [payments, setPayments] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      Object.entries(emptyPayments()).map(([y, v]) => [y, v ? String(v) : '']),
    ),
  )
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo>({})
  const [familyDialogOpen, setFamilyDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (member) {
      setFirstName(member.firstName)
      setLastName(member.lastName)
      const { dialCode, number } = splitPhone(member.phone)
      setPhoneDialCode(dialCode)
      setPhoneNumber(number)
      setAddress(member.address)
      setJoinDate(member.joinDate || todayIso())
      setFamilyInfo(member.familyInfo ?? {})
      setPayments(
        Object.fromEntries(
          years.map((y) => [
            String(y),
            member.payments?.[String(y)]
              ? String(member.payments[String(y)])
              : '',
          ]),
        ),
      )
    } else {
      setFirstName('')
      setLastName('')
      setPhoneDialCode(DEFAULT_DIAL_CODE)
      setPhoneNumber('')
      setAddress('')
      setJoinDate(todayIso())
      setFamilyInfo({})
      setPayments(Object.fromEntries(years.map((y) => [String(y), ''])))
    }
  }, [open, member, years])

  const duplicate = useMemo(() => {
    if (isEditing) return null
    const key = buildSearchKey(firstName, lastName)
    if (!key) return null
    return existingMembers.find((m) => m.searchKey === key) ?? null
  }, [isEditing, firstName, lastName, existingMembers])

  function updatePaymentYear(year: number, value: string) {
    if (value !== '' && !/^\d*$/.test(value)) return
    setPayments((prev) => ({ ...prev, [String(year)]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Ime i prezime su obavezni.')
      return
    }

    const paymentMap = Object.fromEntries(
      Object.entries(payments).map(([y, v]) => [y, v === '' ? 0 : Number(v)]),
    )

    const input: MemberInput = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phoneNumber.trim() ? `${phoneDialCode} ${phoneNumber.trim()}` : '',
      address: address.trim(),
      joinDate,
      payments: paymentMap,
      ...(hasFamilyInfo(familyInfo) ? { familyInfo } : {}),
    }

    setSaving(true)
    try {
      if (isEditing) {
        await updateMember(member.id, input)
        toast.success('Podaci o članu su ažurirani.')
      } else {
        await createMember(input)
        toast.success('Novi član je dodan.')
      }
      onOpenChange(false)
    } catch {
      toast.error('Došlo je do greške prilikom čuvanja. Pokušajte ponovo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Uredi člana' : 'Dodaj novog člana'}
          </DialogTitle>
          <DialogDescription>
            Podaci o članu i cijela tabela članarina ({years[0]}–
            {years[years.length - 1]}) se čuvaju zajedno.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">Ime</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">Prezime</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Broj članske karte</Label>
              <div className="flex h-9 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                {isEditing
                  ? member.cardNumber
                  : 'Biće automatski dodijeljen'}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="joinDate">Datum učlanjenja</Label>
              <Input
                id="joinDate"
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telefon</Label>
              <div className="flex gap-2">
                <Select
                  value={phoneDialCode}
                  onValueChange={(v) => v && setPhoneDialCode(v)}
                >
                  <SelectTrigger className="w-28 shrink-0">
                    <SelectValue>
                      {(value: string) => {
                        const country = COUNTRY_CODES.find(
                          (c) => c.dialCode === value,
                        )
                        return country
                          ? `${country.flag} ${country.dialCode}`
                          : value
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map((c) => (
                      <SelectItem key={c.dialCode + c.name} value={c.dialCode}>
                        {c.flag} {c.dialCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="79 123 45 67"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Adresa</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {duplicate && (
            <div className="flex items-center justify-between gap-3 rounded-md border border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <span>
                Član po imenu <strong>{duplicate.fullName}</strong> već
                postoji. Uredite postojeći zapis umjesto dupliciranja.
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onEditExisting(duplicate)}
              >
                Uredi postojećeg
              </Button>
            </div>
          )}

          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFamilyDialogOpen(true)}
              className="gap-2"
            >
              <Users className="size-4" />
              Podaci o porodici (opciono)
              {hasFamilyInfo(familyInfo) && (
                <Badge variant="secondary">Popunjeno</Badge>
              )}
            </Button>
          </div>

          <Separator />

          <div>
            <p className="mb-3 text-sm font-medium">
              Članarina po godinama (iznos)
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {years.map((year) => (
                <div key={year} className="flex flex-col gap-1">
                  <Label htmlFor={`year-${year}`} className="text-xs text-muted-foreground">
                    {year}
                  </Label>
                  <Input
                    id={`year-${year}`}
                    inputMode="numeric"
                    placeholder="0"
                    value={payments[String(year)] ?? ''}
                    onChange={(e) => updatePaymentYear(year, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Otkaži
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Čuvanje...' : 'Sačuvaj'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <FamilyInfoDialog
        open={familyDialogOpen}
        onOpenChange={setFamilyDialogOpen}
        value={familyInfo}
        onSave={setFamilyInfo}
      />
    </Dialog>
  )
}
