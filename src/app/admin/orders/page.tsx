import { auth } from '@/auth'
import { prisma } from '@/lib/prisma' // Direct DB access
import OrderStatusSelect from '@/components/OrderStatusSelect'
import CustomCakeStatusSelect from '@/components/CustomCakeStatusSelect' // We'll create this
import { redirect } from 'next/navigation'
import { Sparkles, ClipboardList } from 'lucide-react'

export default async function AdminOrdersPage() {
  const session = await auth()
  if (session?.user.role !== 'ADMIN') redirect('/')

  // Fetch standard orders
  const orders = await prisma.order.findMany({
    include:{
      items:{include:{product:true}}
    },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch AI Custom Cake requests
  const customCakes = await prisma.customCakeRequest.findMany({
    
    orderBy: { createdAt: 'desc' },
  })

  const statusColors: any = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
    APPROVED: 'bg-purple-100 text-purple-800 border-purple-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
    BAKING: 'bg-orange-100 text-orange-800 border-orange-200',
  }

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='bg-white border-b border-slate-200 sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <h1 className='text-4xl font-bold text-gray-900'>📋 Admin Dashboard</h1>
          <div className='flex gap-4 mt-4'>
            <p className='text-gray-600 font-medium flex items-center gap-2'>
              <ClipboardList className='w-4 h-4' /> Standard: {orders.length}
            </p>
            <p className='text-purple-600 font-medium flex items-center gap-2'>
              <Sparkles className='w-4 h-4' /> AI Requests: {customCakes.length}
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-12 space-y-12'>
        
        {/* --- SECTION 1: AI CUSTOM CAKE REQUESTS --- */}
        <section>
          <h2 className='text-xl font-bold mb-6 flex items-center gap-2 text-purple-700'>
            <Sparkles className='w-5 h-5' /> New AI Custom Requests
          </h2>
          <div className='space-y-6'>
            {customCakes.map((cake: any) => (
              <div key={cake.id} className='bg-white rounded-xl border-2 border-purple-100 overflow-hidden shadow-sm'>
                <div className='p-6 border-b border-slate-100 flex flex-col md:flex-row gap-6'>
                  <div className='w-32 h-32 rounded-lg border overflow-hidden bg-slate-50 shrink-0'>
                    {cake.aiImage && <img src={cake.aiImage} className='w-full h-full object-cover' alt='AI Preview' />}
                  </div>
                  <div className='flex-1'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <p className='text-xs font-bold text-purple-500 uppercase tracking-wider'>AI Design Request</p>
                        <p className='text-sm text-gray-500 italic mt-1'>"{cake.prompt}"</p>
                      </div>
                      <div className='text-right'>
                        <p className='text-sm text-gray-500'>Customer Budget</p>
                        <p className='text-xl font-bold text-gray-900'>₹{cake.expectedPrice}</p>
                      </div>
                      {cake.finalPrice !=null &&
                      <div className='text-right'>
                        <p className='text-sm text-gray-500'>FinalPrice</p>
                        <p className='text-xl font-bold text-gray-900'>₹{cake.finalPrice}</p>
                      </div>
                      }
                    </div>
                    <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-end'>
                      <div>
                        <p className='text-sm text-gray-500 mb-2'>Request Status</p>
                        <span className={`px-4 py-2 rounded-lg font-semibold border ${statusColors[cake.status]}`}>
                          {cake.status}
                        </span>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500 mb-2'>Update Design Status</p>
                        <CustomCakeStatusSelect currentStatus={cake.status} requestId={cake.id} price={cake.expectedPrice}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 2: STANDARD ORDERS --- */}
        <section>
          <h2 className='text-xl font-bold mb-6 flex items-center gap-2 text-gray-700'>
            <ClipboardList className='w-5 h-5' /> Standard Shop Orders
          </h2>
          <div className='space-y-6'>
            {orders.map((order: any) => (
              <div key={order.id} className='bg-white rounded-xl border border-slate-200 overflow-hidden'>
                <div className='p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                  <div>
                    <p className='text-sm text-gray-500'>Order ID</p>
                    <p className='text-lg font-bold text-gray-900'>#{order.id.slice(-8)}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>User Email</p>
                    <p className='text-lg font-bold text-gray-900'>{order.email}</p>
                  </div>
                  
                  <div className='text-right'>
                    <p className='text-sm text-gray-500'>Total Amount</p>
                    <p className='text-2xl font-bold text-amber-600'>₹{order.total}</p>
                  </div>
                </div>
                <div className='p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
                  <div>
                    <p className='text-sm text-gray-500'>quantity</p>
                    {order.items && order.items.map((item: any) => (
                      <div key={item.id} className='flex justify-between items-center mb-2'>
                    <div>
                    <p className='text-md  text-gray-900'>{item.quantity} x <span>{item.product?.name}</span></p>
                  </div>
                  </div>))}
                    <span className={`inline-block px-4 py-2 rounded-lg font-semibold border ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className='flex-1 max-w-xs'>
                    <OrderStatusSelect currentStatus={order.status} orderId={order.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}