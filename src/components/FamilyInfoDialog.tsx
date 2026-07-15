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
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/contexts/LanguageContext'
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
  const { t } = useLanguage()
  const [memberCount, setMemberCount] = useState('')
  const [ages, setAges] = useState('')
  const [phones, setPhones] = useState('')
  const [notes, setNotes] = useState('')
  const [spouseName, setSpouseName] = useState('')
  const [includeSpouseInPrint, setIncludeSpouseInPrint] = useState(false)

  useEffect(() => {
    if (!open) return
    setMemberCount(value.memberCount ? String(value.memberCount) : '')
    setAges(value.ages ?? '')
    setPhones(value.phones ?? '')
    setNotes(value.notes ?? '')
    setSpouseName(value.spouseName ?? '')
    setIncludeSpouseInPrint(value.includeSpouseInPrint ?? false)
  }, [open, value])

  function handleSave() {
    onSave({
      memberCount: memberCount ? Number(memberCount) : undefined,
      ages: ages.trim() || undefined,
      phones: phones.trim() || undefined,
      notes: notes.trim() || undefined,
      spouseName: spouseName.trim() || undefined,
      includeSpouseInPrint: Boolean(spouseName.trim()) && includeSpouseInPrint,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('familyInfo.title')}</DialogTitle>
          <DialogDescription>{t('familyInfo.description')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="spouseName">{t('familyInfo.spouseName')}</Label>
            <Input
              id="spouseName"
              placeholder="npr. Amela Rujevic"
              value={spouseName}
              onChange={(e) => setSpouseName(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Checkbox
                id="includeSpouseInPrint"
                checked={includeSpouseInPrint}
                onCheckedChange={(c) => setIncludeSpouseInPrint(!!c)}
                disabled={!spouseName.trim()}
              />
              <Label
                htmlFor="includeSpouseInPrint"
                className="text-sm font-normal text-muted-foreground"
              >
                {t('familyInfo.includeSpouseInPrint')}
              </Label>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <Label htmlFor="familyMemberCount">{t('familyInfo.memberCount')}</Label>
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
            <Label htmlFor="familyAges">{t('familyInfo.ages')}</Label>
            <Input
              id="familyAges"
              placeholder="npr. 45, 42, 15, 10"
              value={ages}
              onChange={(e) => setAges(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="familyPhones">{t('familyInfo.phones')}</Label>
            <Input
              id="familyPhones"
              placeholder="npr. +387 61 123 456, +387 62 987 654"
              value={phones}
              onChange={(e) => setPhones(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="familyNotes">{t('familyInfo.notes')}</Label>
            <Input
              id="familyNotes"
              placeholder={t('familyInfo.notesPlaceholder')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="button" onClick={handleSave}>
            {t('familyInfo.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
