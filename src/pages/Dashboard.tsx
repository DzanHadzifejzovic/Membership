import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MemberFormDialog } from '@/components/MemberFormDialog'
import { PrintLayout } from '@/components/PrintLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useMembers } from '@/hooks/useMembers'
import { softDeleteMember } from '@/firebase/members'
import { YEARS, paidYearCount, totalPaid, type Member } from '@/types/member'

const DEFAULT_MOSQUE_NAME = 'Džamija Nur'

export default function Dashboard() {
  const { signOut } = useAuth()
  const { members, loading, error } = useMembers()

  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [mosqueName, setMosqueName] = useState(DEFAULT_MOSQUE_NAME)
  const [yearFrom, setYearFrom] = useState(String(YEARS[YEARS.length - 6]))
  const [yearTo, setYearTo] = useState(String(YEARS[YEARS.length - 1]))
  const [cardsPerPage, setCardsPerPage] = useState<'4' | '6' | '8'>('8')

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return members
    return members.filter(
      (m) =>
        m.searchKey.includes(term) ||
        m.cardNumber.toLowerCase().includes(term),
    )
  }, [members, search])

  const selectedMembers = useMemo(
    () => members.filter((m) => selectedIds.has(m.id)),
    [members, selectedIds],
  )

  const allFilteredSelected =
    filteredMembers.length > 0 &&
    filteredMembers.every((m) => selectedIds.has(m.id))

  function toggleSelected(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function toggleSelectAllFiltered(checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const m of filteredMembers) {
        if (checked) next.add(m.id)
        else next.delete(m.id)
      }
      return next
    })
  }

  function openNewMemberDialog() {
    setEditingMember(null)
    setDialogOpen(true)
  }

  function openEditDialog(member: Member) {
    setEditingMember(member)
    setDialogOpen(true)
  }

  async function confirmDeleteMember() {
    if (!memberToDelete) return
    setDeleting(true)
    try {
      await softDeleteMember(memberToDelete.id)
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(memberToDelete.id)
        return next
      })
      toast.success('Član je uklonjen.')
      setMemberToDelete(null)
    } catch {
      toast.error('Došlo je do greške prilikom brisanja. Pokušajte ponovo.')
    } finally {
      setDeleting(false)
    }
  }

  function handlePrint() {
    if (selectedMembers.length === 0) {
      toast.error('Odaberite barem jednog člana za štampu.')
      return
    }
    if (Number(yearFrom) > Number(yearTo)) {
      toast.error('Period godina nije ispravan.')
      return
    }
    window.print()
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="print:hidden border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold">Evidencija članarina</h1>
          <Button variant="outline" onClick={signOut}>
            Odjava
          </Button>
        </div>
      </header>

      <main className="print:hidden mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Pretraga po imenu ili broju kartice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <Button onClick={openNewMemberDialog}>Dodaj novog člana</Button>
        </div>

        <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border bg-background p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Naziv džamije</span>
            <Input
              value={mosqueName}
              onChange={(e) => setMosqueName(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Od godine</span>
            <Select
              value={yearFrom}
              onValueChange={(v) => v && setYearFrom(v)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Do godine</span>
            <Select value={yearTo} onValueChange={(v) => v && setYearTo(v)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              Kartica po stranici
            </span>
            <Select
              value={cardsPerPage}
              onValueChange={(v) => v && setCardsPerPage(v as '4' | '6' | '8')}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="secondary"
            onClick={handlePrint}
            disabled={selectedMembers.length === 0}
            className="ml-auto"
          >
            Štampaj odabrane ({selectedMembers.length})
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allFilteredSelected}
                    onCheckedChange={(c) => toggleSelectAllFiltered(!!c)}
                    aria-label="Odaberi sve"
                  />
                </TableHead>
                <TableHead>Ime i prezime</TableHead>
                <TableHead>Broj kartice</TableHead>
                <TableHead>Učlanjen</TableHead>
                <TableHead>Plaćeno godina</TableHead>
                <TableHead>Ukupno uplaćeno</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Učitavanje...
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-destructive">
                    Greška: {error}
                  </TableCell>
                </TableRow>
              )}
              {!loading && !error && filteredMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nema pronađenih članova.
                  </TableCell>
                </TableRow>
              )}
              {filteredMembers.map((member) => (
                <TableRow
                  key={member.id}
                  className="cursor-pointer"
                  onClick={() => openEditDialog(member)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(member.id)}
                      onCheckedChange={(c) =>
                        toggleSelected(member.id, !!c)
                      }
                      aria-label={`Odaberi ${member.fullName}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {member.fullName}
                  </TableCell>
                  <TableCell>{member.cardNumber || '—'}</TableCell>
                  <TableCell>{member.joinDate || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {paidYearCount(member.payments)} / {YEARS.length}
                    </Badge>
                  </TableCell>
                  <TableCell>{totalPaid(member.payments)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setMemberToDelete(member)}
                      aria-label={`Obriši ${member.fullName}`}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <MemberFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editingMember}
        existingMembers={members}
        onEditExisting={(m) => {
          setEditingMember(m)
        }}
      />

      <PrintLayout
        members={selectedMembers}
        yearFrom={Number(yearFrom)}
        yearTo={Number(yearTo)}
        cardsPerPage={Number(cardsPerPage) as 4 | 6 | 8}
        mosqueName={mosqueName}
      />

      <AlertDialog
        open={memberToDelete != null}
        onOpenChange={(open) => {
          if (!open) setMemberToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ukloniti člana?</AlertDialogTitle>
            <AlertDialogDescription>
              {memberToDelete && (
                <>
                  <strong>{memberToDelete.fullName}</strong> će biti uklonjen(a)
                  sa liste članova. Podaci i istorija članarina se ne brišu
                  trajno i mogu se vratiti po potrebi iz baze.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Otkaži</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={confirmDeleteMember}
            >
              {deleting ? 'Brisanje...' : 'Ukloni'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
