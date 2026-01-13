'use client'

import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

export default function CustomCakeStatusSelect({ 
  currentStatus, 
  requestId, 
  price 
}: { 
  currentStatus: string, 
  requestId: string, 
  price: number 
}) {
  const router = useRouter()
  const [finalPrice, setFinalPrice] = useState(price)
  const [loading, setLoading] = useState(false)

  // Combined update function
  async function performUpdate(statusToSave: string, priceToSave: number) {
    setLoading(true)
    try {
      await fetch('api/custom-cakes', {
        method: 'PATCH',
        body: JSON.stringify({ 
          requestId, 
          status: statusToSave, 
          finalPrice: priceToSave 
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
          <input
            type="number"
            value={finalPrice}
            onChange={(e) => setFinalPrice(Number(e.target.value))}
            className="w-full pl-7 pr-3 py-2 text-sm font-bold border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Set Price"
          />
        </div>
        
        {/* Manual Save Button for Price - Prevents API spamming on every keystroke */}
        <button 
          onClick={() => performUpdate(currentStatus, finalPrice)}
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          disabled={loading}
          title="Update Price"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-green-600" />}
        </button>
      </div>

      <Select 
        onValueChange={(value) => performUpdate(value, finalPrice)} 
        defaultValue={currentStatus}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Change Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
          <SelectItem value="APPROVED">Approved</SelectItem>
          <SelectItem value="BAKING">Baking</SelectItem>
          <SelectItem value="REJECTED">Reject Design</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}