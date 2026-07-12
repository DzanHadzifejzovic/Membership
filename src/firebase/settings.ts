import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import { DEFAULT_LAST_YEAR } from '@/types/member'

const SETTINGS_DOC = 'meta/settings'

export function subscribeToLastYear(
  onChange: (lastYear: number) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    doc(db, SETTINGS_DOC),
    (snap) => {
      const lastYear = snap.data()?.lastYear
      onChange(typeof lastYear === 'number' ? lastYear : DEFAULT_LAST_YEAR)
    },
    onError,
  )
}

export async function updateLastYear(lastYear: number): Promise<void> {
  await setDoc(doc(db, SETTINGS_DOC), { lastYear }, { merge: true })
}
