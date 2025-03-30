import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthTest() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Auth Status</h1>
      {session ? (
        <p>Logged in as {session.user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  )
}
