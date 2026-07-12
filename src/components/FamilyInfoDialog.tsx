import { useEffect, useState } from 'react'
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
import type { FamilyInfo } from '@/types/member'

interface FamilyInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: FamilyInfo
  onSave: (value: FamilyInfo) => void
}

export function FamilyInfoDialog({
  open,
  onOpenChange,
  value,
  onSave,
}: FamilyInfoDialogProps) {
  const [memberCount, setMemberCount] = useState('')
  const [ages, setAges] = useState('')
  const [phones, setPhones] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!open) return
    setMemberCount(value.memberCount ? String(value.memberCount) : '')
    setAges(value.ages ?? '')
    setPhones(value.phones ?? '')
    setNotes(value.notes ?? '')
  }, [open, value])

  function handleSave() {
    onSave({
      memberCount: memberCount ? Number(memberCount) : undefined,
      ages: ages.trim() || undefined,
      phones: phones.trim() || undefined,
      notes: notes.trim() || undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Podaci o porodici (opciono)</DialogTitle>
          <DialogDescription>
            Ovi podaci nisu obavezni i mogu se dopuniti kasnije.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="familyMemberCount">Broj članova porodice</Label>
            <Input
              id="familyMemberCount"
              inputMode="numeric"
              placeholder="npr. 4"
              value={memberCount}
              onChange={(e) => {
                const v = e.target.value
                if (v === '' || /^\d*$/.test(v)) setMemberCount(v)
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="familyAges">Starost članova porodice</Label>
            <Input
              id="familyAges"
              placeholder="npr. 45, 42, 15, 10"
              value={ages}
              onChange={(e) => setAges(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="familyPhones">Telefonski brojevi</Label>
            <Input
              id="familyPhones"
              placeholder="npr. +387 61 123 456, +387 62 987 654"
              value={phones}
              onChange={(e) => setPhones(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="familyNotes">Napomena</Label>
            <Input
              id="familyNotes"
              placeholder="Dodatne napomene..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Otkaži
          </Button>
          <Button type="button" onClick={handleSave}>
            Sačuvaj podatke
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
