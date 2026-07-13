import { useEffect, useState, type FormEvent } from 'react'
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
import { updateLastYear } from '@/firebase/settings'
import { useLanguage } from '@/contexts/LanguageContext'
import { FIRST_YEAR } from '@/types/member'

interface ExtendYearRangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentLastYear: number
}

export function ExtendYearRangeDialog({
  open,
  onOpenChange,
  currentLastYear,
}: ExtendYearRangeDialogProps) {
  const { t } = useLanguage()
  const [newLastYear, setNewLastYear] = useState(String(currentLastYear + 5))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setNewLastYear(String(currentLastYear + 5))
  }, [open, currentLastYear])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = Number(newLastYear)
    if (!Number.isInteger(value) || value <= currentLastYear) {
      toast.error(
        t('extendYear.errorMustBeGreater', { current: currentLastYear }),
      )
      return
    }

    setSaving(true)
    try {
      await updateLastYear(value)
      toast.success(t('extendYear.toastExtended', { year: value }))
      onOpenChange(false)
    } catch {
      toast.error(t('extendYear.toastError'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('extendYear.title')}</DialogTitle>
          <DialogDescription>
            {t('extendYear.description', {
              from: FIRST_YEAR,
              to: currentLastYear,
            })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="newLastYear">{t('extendYear.newLastYear')}</Label>
            <Input
              id="newLastYear"
              inputMode="numeric"
              value={newLastYear}
              onChange={(e) => {
                const v = e.target.value
                if (v === '' || /^\d*$/.test(v)) setNewLastYear(v)
              }}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t('common.saving') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
