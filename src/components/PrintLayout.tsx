import { useLanguage } from '@/contexts/LanguageContext'
import { CURRENCY, type Member } from '@/types/member'

interface PrintLayoutProps {
  members: Member[]
  yearFrom: number
  yearTo: number
  cardsPerPage: 4 | 6 | 8
  mosqueName: string
  logoUrl: string
}

// Cycled by column position, purely decorative (matches the reference card
// template where each year column has its own accent color).
const YEAR_COLORS = [
  '#0f766e', // teal
  '#92400e', // brown
  '#6d28d9', // purple
  '#be123c', // crimson
  '#0e7490', // cyan
  '#a16207', // amber
  '#4338ca', // indigo
]

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
  logoUrl,
}: PrintLayoutProps) {
  const { t } = useLanguage()
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
                <img src={logoUrl} alt="" className="print-card-logo" />
              </div>

              <div className="print-card-body">
                <div className="print-card-name">
                  {member.fullName}
                  {member.familyInfo?.includeSpouseInPrint &&
                    member.familyInfo?.spouseName && (
                      <span className="print-card-spouse">
                        {' '}
                        &amp; {member.familyInfo.spouseName}
                      </span>
                    )}
                </div>
                <div className="print-card-meta">
                  {t('printLayout.cardNumberLabel')}: {member.cardNumber || '—'}
                  {' · '}
                  {CURRENCY}
                </div>
              </div>

              <div className="print-year-grid">
                {years.map((year, i) => {
                  const amount = member.payments?.[String(year)] ?? 0
                  const paid = amount > 0
                  const color = YEAR_COLORS[i % YEAR_COLORS.length]
                  return (
                    <div key={year} className="print-year-box">
                      <div className="print-year-number" style={{ color }}>
                        {year}
                      </div>
                      <div className="print-year-box-amount">
                        {paid ? amount : ''}
                      </div>
                    </div>
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
