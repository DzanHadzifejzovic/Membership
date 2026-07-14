import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import type { Role } from '@/types/role'

// Role documents live at roles/{uid} and are created/edited manually by the
// site owner in the Firebase console (Firestore rules deny all client
// writes to this collection). Missing a role doc — or any read error — is
// treated as 'worker' (least privilege) rather than 'admin'.
export function subscribeToRole(
  uid: string,
  onChange: (role: Role) => void,
) {
  return onSnapshot(
    doc(db, 'roles', uid),
    (snap) => {
      const role = snap.data()?.role
      onChange(role === 'admin' ? 'admin' : 'worker')
    },
    () => onChange('worker'),
  )
}
