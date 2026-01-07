'use client'

import { useCart } from '@/context/cart-context'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
export default function CheckoutPage () {
  const { items,total, clearCart, updateQuantity, removeItem } = useCart()
  const router = useRouter()

  async function placeOrder () {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, total })
    })

    if (res.ok) {
      clearCart()
      router.push('/orders')
    }
  }
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon' className='relative'>
          <ShoppingCart className='h-5 w-5' />
          {totalItems > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]'
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg'>
        <SheetHeader className='px-1'>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        <Separator className='my-4' />

        {items.length === 0 ? (
          <div className='flex h-full flex-col items-center justify-center space-y-1'>
            <ShoppingCart className='h-12 w-12 text-muted-foreground mb-4' />
            <p className='text-xl font-medium text-muted-foreground'>
              Your cart is empty
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className='flex-1 pr-6'>
              <div className='flex flex-col gap-5'>
                {items.map(item => (
                  <div
                    key={item.productId}
                    className='flex items-center justify-between'
                  >
                    <div className='flex flex-col gap-1'>
                      <span className='text-sm font-medium'>{item.name}</span>
                      <span className='text-xs text-muted-foreground'>
                        ₹{item.price} x {item.quantity}
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      {/* Quantity Control Icons */}
                      <div className='flex items-center border rounded-md px-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className='h-3 w-3' />
                        </Button>
                        <span className='text-sm font-medium w-6 text-center'>
                          {item.quantity}
                        </span>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className='h-3 w-3' />
                        </Button>
                      </div>

                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-destructive'
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className='space-y-4 pr-6 pt-2'>
              <Separator />
              <div className='flex items-center justify-between font-bold text-lg'>
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <SheetFooter>
                <Button className='w-full' onClick={placeOrder}>Proceed to Checkout</Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
