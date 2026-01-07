"use client"

import { useCart } from "@/context/cart-context"

export default function CakesPage({ products }: { products: any[] }) {
  const { addItem } = useCart()
  

  return (
    <>
    <div className="grid grid-cols-3 gap-4 p-8">
      {products.map(p => (
        <div key={p.id} className="border p-4 rounded">
          <h2>{p.name}</h2>
          <p>₹{p.price}</p>

          <button
            onClick={() =>
              addItem({
                productId: p.id,
                name: p.name,
                price: p.price,
                quantity: 1,
              })
            }
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
      </>
  )
}
