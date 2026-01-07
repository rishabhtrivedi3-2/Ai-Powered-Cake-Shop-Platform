// src/components/shared/cake-card.tsx

import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { auth } from "@/auth";
import CakesPage from "@/app/cakes/page";
import AddToCartButton from "./AddToCartButton";
import AdminActions from "./AdminActions";

export async function CakeCard({ id, name, price }: { id: string; name: string; price: number }) {
  const session=await auth();
  const isAdmin=session?.user.role==="ADMIN";
  return (
    <Card>
      <CardContent className="p-4 flex flex-col">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-muted-foreground">₹{price}</p>
        <div className="mx-2">
{isAdmin ? (
<>
  
        <AdminActions product={{ id, name, price }} />
        </>
        ):(
          <div>
            
            <AddToCartButton product={{ id, name, price }} />
          </div>

)}
</div>
    </CardContent>
    </Card>
  )
}
