import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import {
  buildSearchKey,
  type Member,
  type MemberInput,
} from '@/types/member'

const MEMBERS_COLLECTION = 'members'

export function subscribeToMembers(
  onChange: (members: Member[]) => void,
  onError: (error: Error) => void,
) {
  const q = query(
    collection(db, MEMBERS_COLLECTION),
    orderBy('fullName', 'asc'),
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const members = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Member,
      )
      onChange(members)
    },
    onError,
  )
}

// Creates a brand-new member document. Member details and the full
// 2015-2030 payment matrix are written together in a single Firestore
// call, so they can never end up partially saved.
export async function createMember(input: MemberInput): Promise<string> {
  const now = Date.now()
  const fullName = `${input.firstName} ${input.lastName}`.trim()

  const docRef = await addDoc(collection(db, MEMBERS_COLLECTION), {
    ...input,
    fullName,
    searchKey: buildSearchKey(input.firstName, input.lastName),
    createdAt: now,
    updatedAt: now,
  })

  return docRef.id
}

// Overwrites an existing member's details + full payment matrix in one
// atomic write (merge: false is intentional — the whole template is the
// unit of truth, so partial/stale year data can't linger).
export async function updateMember(
  id: string,
  input: MemberInput,
): Promise<void> {
  const fullName = `${input.firstName} ${input.lastName}`.trim()

  await setDoc(doc(db, MEMBERS_COLLECTION, id), {
    ...input,
    fullName,
    searchKey: buildSearchKey(input.firstName, input.lastName),
    updatedAt: Date.now(),
  }, { merge: true })
}
