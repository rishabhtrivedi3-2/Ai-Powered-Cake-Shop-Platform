'use client'
import { useRouter } from 'next/navigation'
import { JSX, useState } from 'react'

type Props = { currentStatus: string; orderId: string }

export default function OrderStatusSelect({ currentStatus, orderId }: Props): JSX.Element {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const statuses = ['PENDING', 'CONFIRMED', 'BAKING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

  const handleChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => void handleChange(e.target.value)}
      disabled={isUpdating}
      className='w-full px-4 py-2 border border-slate-200 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50 cursor-pointer'
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )}
