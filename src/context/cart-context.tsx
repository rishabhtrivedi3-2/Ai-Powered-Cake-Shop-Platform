"use client"

import { createContext, useContext, useState } from "react"

type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  updateQuantity: (productId: string, quantity: number) => void

}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId)
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }
const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }
    const clearCart = () => setItems([])

  return (
    <CartContext.Provider value={{ items, total,addItem, removeItem, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be inside CartProvider")
  return ctx
}
