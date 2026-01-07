'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EditButton({ product, open, setOpen }: { product: any; open: boolean; setOpen: (open: boolean) => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(product.name)
  const [price, setPrice] = useState(product.price)

  const handleUpdate = async () => {
    setLoading(true)
    try{

        const res = await fetch(`/api/admin/products/${product.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price }),
    })
    
    if (res.ok) {
        setOpen(false)
        router.refresh() // Refresh server data
    }
}catch(err){
    console.error("Failed to update product:", err)
}
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}