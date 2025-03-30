// pages/dashboard/founders.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function FoundersDashboard() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', session.user.id)
        .single()

      if (error || !['ace', 'king', 'queen', 'jack'].includes(profile?.role)) {
        router.push('/')
      } else {
        setEmail(profile.email)
      }
    }

    checkAccess()
  }, [router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center border rounded-2xl shadow-xl p-10 max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-4">♟️ Founders' Chessboard</h1>
        <p className="text-gray-600 mb-2">Welcome, {email || 'loading...'}</p>
        <p className="text-sm text-gray-500">
          This is your private board. Only Ace, King, Queen, and Jack may enter.
        </p>
      </div>
    </div>
  )
}
