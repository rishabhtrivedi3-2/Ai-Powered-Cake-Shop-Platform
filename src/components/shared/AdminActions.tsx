'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EditButton from './EditButton'
export default function AdminActions({ product }: { product: any }) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    if (confirm("Delete this product?")) {
      await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
      window.location.reload()
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <Pencil className="h-4 w-4 text-blue-500" />
      </Button>
      
      <Button variant="destructive" size="icon" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>

      <EditButton product={product} open={open} setOpen={setOpen} />
    </div>
  )
}