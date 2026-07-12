import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
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
import { createMember, updateMember } from '@/firebase/members'
import {
  YEARS,
  buildSearchKey,
  emptyPayments,
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

export function MemberFormDialog({
  open,
  onOpenChange,
  member,
  existingMembers,
  onEditExisting,
}: MemberFormDialogProps) {
  const isEditing = member != null

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [joinDate, setJoinDate] = useState(todayIso())
  const [payments, setPayments] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      Object.entries(emptyPayments()).map(([y, v]) => [y, v ? String(v) : '']),
    ),
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (member) {
      setFirstName(member.firstName)
      setLastName(member.lastName)
      setCardNumber(member.cardNumber)
      setPhone(member.phone)
      setAddress(member.address)
      setJoinDate(member.joinDate || todayIso())
      setPayments(
        Object.fromEntries(
          YEARS.map((y) => [
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
      setCardNumber('')
      setPhone('')
      setAddress('')
      setJoinDate(todayIso())
      setPayments(Object.fromEntries(YEARS.map((y) => [String(y), ''])))
    }
  }, [open, member])

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
      cardNumber: cardNumber.trim(),
      phone: phone.trim(),
      address: address.trim(),
      joinDate,
      payments: paymentMap,
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
            Podaci o članu i cijela tabela članarina ({YEARS[0]}–
            {YEARS[YEARS.length - 1]}) se čuvaju zajedno.
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
              <Label htmlFor="cardNumber">Broj članske karte</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
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
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
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

          <Separator />

          <div>
            <p className="mb-3 text-sm font-medium">
              Članarina po godinama (iznos)
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {YEARS.map((year) => (
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
    </Dialog>
  )
}
