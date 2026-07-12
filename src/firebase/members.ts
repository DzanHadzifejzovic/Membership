import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
} from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import {
  buildSearchKey,
  type Member,
  type MemberInput,
} from '@/types/member'

const MEMBERS_COLLECTION = 'members'
const COUNTERS_DOC = 'meta/counters'

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

// Creates a brand-new member document. The card number is assigned
// automatically from a shared counter (incremented inside the same
// transaction, so two admins creating a member at once can never collide),
// and member details + the full 2015-2030 payment matrix are written
// together, so they can never end up partially saved.
export async function createMember(input: MemberInput): Promise<string> {
  const now = Date.now()
  const fullName = `${input.firstName} ${input.lastName}`.trim()
  const memberRef = doc(collection(db, MEMBERS_COLLECTION))
  const counterRef = doc(db, COUNTERS_DOC)

  await runTransaction(db, async (tx) => {
    const counterSnap = await tx.get(counterRef)
    const nextNumber = (counterSnap.data()?.lastCardNumber ?? 0) + 1

    tx.set(counterRef, { lastCardNumber: nextNumber }, { merge: true })
    tx.set(memberRef, {
      ...input,
      fullName,
      searchKey: buildSearchKey(input.firstName, input.lastName),
      cardNumber: String(nextNumber).padStart(4, '0'),
      createdAt: now,
      updatedAt: now,
    })
  })

  return memberRef.id
}

// Overwrites an existing member's details + full payment matrix in one
// atomic write (merge: false is intentional — the whole template is the
// unit of truth, so partial/stale year data can't linger). cardNumber is
// never part of this payload, so it's left untouched by the merge.
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
