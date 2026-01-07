'use client'

import { useCart } from '@/context/cart-context'
import { Button } from "@/components/ui/button"
import { ShoppingCart } from 'lucide-react'

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart()

  return (
    <Button 
      className="w-full bg-pink-600 hover:bg-pink-700 mt-2"
      onClick={() => addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      })}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Add to Cart
    </Button>
  )
}