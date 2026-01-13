import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AdminOrdersPage from '../admin/orders/page'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Sparkles, ShoppingBag, Clock } from 'lucide-react'

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> // 1. Define as Promise
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  
  if (session.user.role === 'ADMIN') return <AdminOrdersPage />

  // 2. Await the entire object first
  const resolvedSearchParams = await searchParams;
  const currentFilter = resolvedSearchParams.type || 'all';

  // 2. Fetch standard orders
  const standardOrders = currentFilter === 'custom' ? [] : await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  })

  // 3. Fetch AI Custom Cake requests
  const customRequests = currentFilter === 'standard' ? [] : await prisma.customCakeRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  // 4. Status Colors Mapping
  const statusStyles: any = {
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    CONFIRMED: 'bg-green-100 text-green-700 border-green-200',
    APPROVED: 'bg-purple-100 text-purple-700 border-purple-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
    BAKING: 'bg-orange-100 text-orange-700 border-orange-200',
  }

  return (
    <div className='min-h-screen bg-slate-50/50'>
      <div className='bg-white border-b sticky top-0 z-40'>
        <div className='max-w-5xl mx-auto px-6 py-6'>
          <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
          <p className='text-gray-600 mt-2'>Total Orders: {standardOrders.length || 0}</p>
          <div className="flex gap-2">
            <Link href="/orders?type=all" className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors", currentFilter === 'all' ? "bg-slate-900 text-white" : "bg-white border hover:bg-slate-50")}>
              All
            </Link>
            <Link href="/orders?type=custom" className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors border-purple-200", currentFilter === 'custom' ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-700 hover:bg-purple-100")}>
              ✨ AI Custom Designs
            </Link>
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-6 py-10 space-y-6'>
        
        {/* Render Custom AI Cake Requests */}
        {customRequests.map((req) => (
          <div key={req.id} className="bg-white rounded-xl border-2 border-purple-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 bg-purple-50/50 border-b border-purple-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-purple-900">Custom AI Design Request</span>
              </div>
              <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", statusStyles[req.status])}>
                {req.status}
              </span>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-32 aspect-square rounded-lg overflow-hidden border bg-slate-100 shrink-0">
                {req.aiImage && <img src={req.aiImage} alt="Cake Preview" className="w-1/2 h-1/2 object-cover" />}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm text-slate-500 italic">"{req.prompt}"</p>
                <div className="flex gap-4 pt-2">
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Your Budget</p>
                    <p className="font-bold">₹{req.expectedPrice}</p>
                  </div>
                  {req.finalPrice && (
                    <div>
                      <p className="text-[10px] uppercase text-purple-400 font-bold">Final Price</p>
                      <p className="font-bold text-purple-700">₹{req.finalPrice}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-end justify-end">
                 <p className="text-xs text-slate-400 flex items-center gap-1">
                   <Clock className="w-3 h-3" /> {req.createdAt.toLocaleDateString()}
                 </p>
              </div>
            </div>
          </div>
        ))}

        {/* Render Standard Orders */}
        {standardOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2 font-medium">
                <ShoppingBag className="w-4 h-4 text-slate-600" />
                Order #{order.id.slice(-6).toUpperCase()}
              </div>
              <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", statusStyles[order.status])}>
                {order.status}
              </span>
            </div>
            <div className="p-6">
               <ul className="space-y-1">
                 {order.items.map((item) => (
                   <li key={item.id} className="text-sm text-slate-600">
                     {item.product.name} <span className="text-slate-400">×{item.quantity}</span>
                   </li>
                 ))}
               </ul>
               <div className="mt-4 pt-4 border-t flex justify-between items-center">
                 <p className="text-slate-500 text-sm">Ordered on {order.createdAt.toLocaleDateString()}</p>
                 <p className="text-lg font-bold">₹{order.total}</p>
               </div>
            </div>
          </div>
        ))}

        {customRequests.length === 0 && standardOrders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <p className="text-slate-500">No orders found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}