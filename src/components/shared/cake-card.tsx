// src/components/shared/cake-card.tsx

import { Card, CardContent } from '@/components/ui/card'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { auth } from '@/auth'
import CakesPage from '@/app/cakes/page'
import AddToCartButton from './AddToCartButton'
import AdminActions from './AdminActions'

export async function CakeCard ({
  id,
  name,
  price,
  image
}: {
  id: string
  name: string
  price: number
  image: string | null  | Blob
}) {
  const session = await auth()
  const isAdmin = session?.user.role === 'ADMIN'
  return (
   <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0 flex flex-col h-auto">
        
        <div className="relative aspect-square w-full h-1/3 
        overflow-hidden bg-slate-100">

        <img src={image ? (typeof image === 'string' ? image : undefined) : undefined} alt='' className="object-cover max-w-2xl max-h-2xl group-hover:scale-105 transition-transform duration-500"/>
        </div>
<div className="p-4 flex flex-col flex-1 justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{name}</h3>
            <p className="text-xl font-black text-amber-600">₹{price}</p>
          </div>

          <div className="mt-2">
            {isAdmin ? (
              <AdminActions product={{ id, name, price }} />
            ) : (
              <AddToCartButton product={{ id, name, price }} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
