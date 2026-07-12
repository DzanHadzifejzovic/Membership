import { useEffect, useMemo, useState } from 'react'
import { subscribeToLastYear } from '@/firebase/settings'
import { buildYears, DEFAULT_LAST_YEAR } from '@/types/member'

export function useYearRange() {
  const [lastYear, setLastYear] = useState(DEFAULT_LAST_YEAR)

  useEffect(() => {
    return subscribeToLastYear(setLastYear, () => {
      // Keep the default range if the setting can't be read yet.
    })
  }, [])

  // Memoized so the array reference only changes when lastYear actually
  // changes — consumers rely on this for effect dependency arrays.
  const years = useMemo(() => buildYears(lastYear), [lastYear])

  return { years, lastYear }
}
