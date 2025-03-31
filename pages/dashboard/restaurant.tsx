import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function RestaurantDashboard() {
  const [email, setEmail] = useState('')
  const [restaurantId, setRestaurantId] = useState('')
  const [menuItems, setMenuItems] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchProfileAndMenu = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('email, role, id')
        .eq('id', session.user.id)
        .single()

      if (!profile || !['restaurant_owner', 'ace', 'king', 'queen', 'jack'].includes(profile.role)) {
        router.push('/')
        return
      }

      setEmail(profile.email)

      const { data: restaurants } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', profile.id)

      if (restaurants && restaurants.length > 0) {
        const restaurantId = restaurants[0].id
        setRestaurantId(restaurantId)

        const { data: items } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)

        setMenuItems(items || [])
      }
    }

    fetchProfileAndMenu()
  }, [router])

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-rose-600 bg-yellow-100 p-4 rounded-xl">
  🍽️ Hello Foody Dashboard is Stylish!
</h1>
    <div className="p-10 bg-yellow-100 rounded-xl">
      <h1 className="text-4xl font-bold text-pink-600">🌈 Tailwind Test</h1>
      <p className="text-blue-500">This should be styled if Tailwind is working</p>
    </div>
      <p className="text-sm text-gray-500 mb-6">Signed in as: {email}</p>

      {menuItems.length === 0 ? (
        <p>No menu items yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <div key={item.id} className="border p-4 rounded-xl shadow-md bg-white">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="mt-1 font-bold">${item.price.toFixed(2)}</p>
              <p className={`text-xs mt-1 ${item.available ? 'text-green-500' : 'text-red-500'}`}>
                {item.available ? 'Available' : 'Not available'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
