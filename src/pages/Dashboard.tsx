import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, ChevronsUpDown, Trash2 } from 'lucide-react'
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
  TableFooter,
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
import { ExtendYearRangeDialog } from '@/components/ExtendYearRangeDialog'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMembers } from '@/hooks/useMembers'
import { useYearRange } from '@/hooks/useYearRange'
import { softDeleteMember } from '@/firebase/members'
import {
  FIRST_YEAR,
  formatAmount,
  paidYearCount,
  totalPaid,
  type Member,
} from '@/types/member'
import logoIcon from '@/assets/logo-icon.png'

const DEFAULT_MOSQUE_NAME = 'Dzemat Nur Ebikon'
const PAGE_SIZE = 20

type SortKey =
  | 'fullName'
  | 'cardNumber'
  | 'joinDate'
  | 'isRegularMember'
  | 'paidYears'
  | 'totalPaid'

function compareMembers(a: Member, b: Member, key: SortKey): number {
  switch (key) {
    case 'fullName':
      return a.fullName.localeCompare(b.fullName)
    case 'cardNumber':
      return a.cardNumber.localeCompare(b.cardNumber)
    case 'joinDate':
      return a.joinDate.localeCompare(b.joinDate)
    case 'isRegularMember':
      return Number(b.isRegularMember) - Number(a.isRegularMember)
    case 'paidYears':
      return paidYearCount(a.payments) - paidYearCount(b.payments)
    case 'totalPaid':
      return totalPaid(a.payments) - totalPaid(b.payments)
    default:
      return 0
  }
}

export default function Dashboard() {
  const { signOut, isAdmin } = useAuth()
  const { t } = useLanguage()
  const { members, loading, error } = useMembers()
  const { years, lastYear } = useYearRange()

  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [extendDialogOpen, setExtendDialogOpen] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('fullName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  const [mosqueName, setMosqueName] = useState(DEFAULT_MOSQUE_NAME)
  const [yearFrom, setYearFrom] = useState('2015')
  const [yearTo, setYearTo] = useState(String(years[years.length - 1]))
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

  const sortedMembers = useMemo(() => {
    const arr = [...filteredMembers]
    arr.sort(
      (a, b) => compareMembers(a, b, sortKey) * (sortDirection === 'asc' ? 1 : -1),
    )
    return arr
  }, [filteredMembers, sortKey, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sortedMembers.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedMembers = useMemo(
    () => sortedMembers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [sortedMembers, safePage],
  )

  // Derived from sortedMembers (not the raw Firestore order) so printed
  // cards follow whatever order is currently shown on screen.
  const selectedMembers = useMemo(
    () => sortedMembers.filter((m) => selectedIds.has(m.id)),
    [sortedMembers, selectedIds],
  )

  const filteredTotalPaid = useMemo(
    () => filteredMembers.reduce((sum, m) => sum + totalPaid(m.payments), 0),
    [filteredMembers],
  )

  const currentYear = new Date().getFullYear()
  const summary = useMemo(() => {
    let allTime = 0
    let currentYearTotal = 0
    let regularCount = 0
    let irregularCount = 0
    for (const m of members) {
      allTime += totalPaid(m.payments)
      currentYearTotal += m.payments?.[String(currentYear)] ?? 0
      if (m.isRegularMember) regularCount++
      else irregularCount++
    }
    return { allTime, currentYearTotal, regularCount, irregularCount }
  }, [members, currentYear])

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

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return <ChevronsUpDown className="size-3.5 text-muted-foreground" />
    return sortDirection === 'asc' ? (
      <ArrowUp className="size-3.5" />
    ) : (
      <ArrowDown className="size-3.5" />
    )
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
      toast.success(t('dashboard.toastMemberDeleted'))
      setMemberToDelete(null)
    } catch {
      toast.error(t('dashboard.toastDeleteError'))
    } finally {
      setDeleting(false)
    }
  }

  function handlePrint() {
    if (selectedMembers.length === 0) {
      toast.error(t('dashboard.toastSelectAtLeastOne'))
      return
    }
    if (Number(yearFrom) > Number(yearTo)) {
      toast.error(t('dashboard.toastInvalidYearRange'))
      return
    }
    window.print()
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="print:hidden border-b bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-2">
            <img src={logoIcon} alt="" className="h-9 w-auto" />
            <h1 className="text-base font-semibold sm:text-lg">
              {t('dashboard.headerTitle')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="outline" onClick={signOut}>
              {t('dashboard.logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="print:hidden mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder={t('dashboard.searchPlaceholder')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="sm:max-w-xs"
          />
          <Button onClick={openNewMemberDialog}>{t('dashboard.addMember')}</Button>
        </div>

        {isAdmin && (
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs text-muted-foreground">
                {t('dashboard.summaryAllTime')}
              </p>
              <p className="mt-1 text-xl font-semibold">
                {formatAmount(summary.allTime)}
              </p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs text-muted-foreground">
                {t('dashboard.summaryCurrentYear', { year: currentYear })}
              </p>
              <p className="mt-1 text-xl font-semibold">
                {formatAmount(summary.currentYearTotal)}
              </p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs text-muted-foreground">
                {t('dashboard.summaryStatus')}
              </p>
              <p className="mt-1 text-xl font-semibold">
                <span className="text-foreground">{summary.regularCount}</span>
                <span className="text-muted-foreground"> / </span>
                <span className="text-muted-foreground">
                  {summary.irregularCount}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background p-4">
          <div>
            <p className="text-sm font-medium">{t('dashboard.periodTitle')}</p>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.periodDescription', {
                from: FIRST_YEAR,
                to: lastYear,
              })}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setExtendDialogOpen(true)}
          >
            {t('dashboard.extendPeriod')}
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border bg-background p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {t('dashboard.mosqueName')}
            </span>
            <Input
              value={mosqueName}
              onChange={(e) => setMosqueName(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {t('dashboard.yearFrom')}
            </span>
            <Select
              value={yearFrom}
              onValueChange={(v) => v && setYearFrom(v)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {t('dashboard.yearTo')}
            </span>
            <Select value={yearTo} onValueChange={(v) => v && setYearTo(v)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              {t('dashboard.cardsPerPage')}
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
            {t('dashboard.printSelected', { count: selectedMembers.length })}
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
                    aria-label={t('dashboard.selectAllAria')}
                  />
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort('fullName')}
                  >
                    {t('dashboard.colName')} {sortIcon('fullName')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort('cardNumber')}
                  >
                    {t('dashboard.colCardNumber')} {sortIcon('cardNumber')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort('joinDate')}
                  >
                    {t('dashboard.colJoined')} {sortIcon('joinDate')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort('isRegularMember')}
                  >
                    {t('dashboard.colStatus')} {sortIcon('isRegularMember')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort('paidYears')}
                  >
                    {t('dashboard.colPaidYears')} {sortIcon('paidYears')}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort('totalPaid')}
                  >
                    {t('dashboard.colTotalPaid')} {sortIcon('totalPaid')}
                  </button>
                </TableHead>
                {isAdmin && <TableHead className="w-10" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 8 : 7} className="text-center text-muted-foreground">
                    {t('common.loading')}
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 8 : 7} className="text-center text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              )}
              {!loading && !error && filteredMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 8 : 7} className="text-center text-muted-foreground">
                    {t('dashboard.noResults')}
                  </TableCell>
                </TableRow>
              )}
              {paginatedMembers.map((member) => (
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
                      aria-label={t('dashboard.selectAria', {
                        name: member.fullName,
                      })}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {member.fullName}
                  </TableCell>
                  <TableCell>{member.cardNumber || '—'}</TableCell>
                  <TableCell>{member.joinDate || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={member.isRegularMember ? 'default' : 'outline'}>
                      {member.isRegularMember
                        ? t('dashboard.statusRegular')
                        : t('dashboard.statusIrregular')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {paidYearCount(member.payments)} / {years.length}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatAmount(totalPaid(member.payments))}</TableCell>
                  {isAdmin && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setMemberToDelete(member)}
                        aria-label={t('dashboard.deleteAria', {
                          name: member.fullName,
                        })}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
            {filteredMembers.length > 0 && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={6} className="text-right">
                    {t('dashboard.footerTotalLabel')}
                  </TableCell>
                  <TableCell>{formatAmount(filteredTotalPaid)}</TableCell>
                  {isAdmin && <TableCell />}
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>

        {sortedMembers.length > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t('dashboard.pageOf', { page: safePage, total: totalPages })}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                {t('dashboard.previousPage')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                {t('dashboard.nextPage')}
              </Button>
            </div>
          </div>
        )}
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
        logoUrl={logoIcon}
      />

      <AlertDialog
        open={memberToDelete != null}
        onOpenChange={(open) => {
          if (!open) setMemberToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {memberToDelete &&
                t('dashboard.deleteDialogDescription', {
                  name: memberToDelete.fullName,
                })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={confirmDeleteMember}
            >
              {deleting ? t('dashboard.deleting') : t('dashboard.deleteConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ExtendYearRangeDialog
        open={extendDialogOpen}
        onOpenChange={setExtendDialogOpen}
        currentLastYear={lastYear}
      />
    </div>
  )
}
