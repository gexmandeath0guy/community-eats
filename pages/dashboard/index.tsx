// pages/dashboard/index.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function DashboardRouter() {
  const router = useRouter()

  useEffect(() => {
    const redirectUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error || !profile) {
        console.error('Error fetching profile:', error)
        router.push('/login')
        return
      }

      switch (profile.role) {
        case 'driver':
          router.push('/dashboard/driver')
          break
        case 'restaurant_owner':
        case 'staff':
          router.push('/dashboard/restaurant')
          break
        case 'ace':
        case 'king':
        case 'queen':
        case 'jack':
          router.push('/dashboard/founders')
          break
        default:
          router.push('/') // fallback or generic dashboard
      }
    }

    redirectUser()
  }, [router])

  return <p className="p-4">Loading your dashboard...</p>
}
