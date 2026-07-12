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
  const [newLastYear, setNewLastYear] = useState(String(currentLastYear + 5))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setNewLastYear(String(currentLastYear + 5))
  }, [open, currentLastYear])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = Number(newLastYear)
    if (!Number.isInteger(value) || value <= currentLastYear) {
      toast.error(`Nova godina mora biti veća od ${currentLastYear}.`)
      return
    }

    setSaving(true)
    try {
      await updateLastYear(value)
      toast.success(`Period članarine je produžen do ${value}.`)
      onOpenChange(false)
    } catch {
      toast.error('Došlo je do greške. Pokušajte ponovo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Produži period članarine</DialogTitle>
          <DialogDescription>
            Trenutni period je {FIRST_YEAR}–{currentLastYear}. Ova promjena
            važi za sve članove i ne briše postojeće podatke.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="newLastYear">Nova zadnja godina</Label>
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
