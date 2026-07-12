import { useEffect, useState } from 'react'
import { subscribeToMembers } from '@/firebase/members'
import type { Member } from '@/types/member'

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToMembers(
      (data) => {
        setMembers(data.filter((m) => !m.deleted))
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  return { members, loading, error }
}
