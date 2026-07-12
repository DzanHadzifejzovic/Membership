import type { Member } from '@/types/member'

interface PrintLayoutProps {
  members: Member[]
  yearFrom: number
  yearTo: number
  cardsPerPage: 4 | 6 | 8
  mosqueName: string
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

export function PrintLayout({
  members,
  yearFrom,
  yearTo,
  cardsPerPage,
  mosqueName,
}: PrintLayoutProps) {
  const years = Array.from(
    { length: yearTo - yearFrom + 1 },
    (_, i) => yearFrom + i,
  )
  const pages = chunk(members, cardsPerPage)

  return (
    <div id="print-root" className="hidden print:block">
      {pages.map((pageMembers, pageIndex) => (
        <div
          key={pageIndex}
          className="print-page"
          data-cards={cardsPerPage}
        >
          {pageMembers.map((member) => (
            <div key={member.id} className="print-card">
              <div className="print-card-header">
                <span className="print-card-mosque">{mosqueName}</span>
                <span className="print-card-title">Članska iskaznica</span>
              </div>

              <div className="print-card-body">
                <div className="print-card-name">{member.fullName}</div>
                <div className="print-card-meta">
                  <span>Broj: {member.cardNumber || '—'}</span>
                  <span>Učlanjen: {member.joinDate || '—'}</span>
                  {member.phone && <span>Telefon: {member.phone}</span>}
                  {member.address && <span>Adresa: {member.address}</span>}
                </div>
              </div>

              <div className="print-card-years">
                {years.map((year) => {
                  const amount = member.payments?.[String(year)] ?? 0
                  const paid = amount > 0
                  return (
                    <span
                      key={year}
                      className={
                        paid
                          ? 'print-year-chip print-year-paid'
                          : 'print-year-chip print-year-unpaid'
                      }
                    >
                      {year}
                      {paid && (
                        <span className="print-year-amount">{amount}</span>
                      )}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
