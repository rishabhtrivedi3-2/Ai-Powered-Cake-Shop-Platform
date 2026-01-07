import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AdminOrdersPage from '../admin/orders/page'

export default async function OrdersPage () {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const statusColors: { [key: string]: string } = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
    BAKING: 'bg-orange-100 text-orange-800 border-orange-200',
    SHIPPED: 'bg-blue-100 text-blue-800 border-blue-200',
    DELIVERED: 'bg-gray-100 text-gray-800 border-gray-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  }
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      {session?.user.role !== 'ADMIN' ? (
        <div>
          <div className='bg-white border-b border-slate-200 sticky top-0 z-40'>
            <div className='max-w-7xl mx-auto px-6 py-8'>
              <h1 className='text-4xl font-bold text-gray-900'>My Orders</h1>
              <p className='text-gray-600 mt-2'>Total Orders: {orders?.length || 0}</p>
            </div>
          </div>

          <div className='max-w-7xl mx-auto px-6 py-12'>
            {!orders || orders.length === 0 ? (
              <div className='text-center py-20'>
                <p className='text-xl text-gray-500'>No orders found.</p>
              </div>
            ) : (
              <div className='space-y-6'>
                {orders.map((order: any, idx: number) => (
                  <div
                    key={order.id}
                    className='bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fadeIn'
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className='p-6 border-b border-slate-100'>
                      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div>
                          <p className='text-sm text-gray-500'>Order ID</p>
                          <p className='text-lg font-bold text-gray-900'>#{order.id.slice(0, 8)}</p>
                        </div>
                        
                        <div className='text-right'>
                          <p className='text-sm text-gray-500'>Total Amount</p>
                          <p className='text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'>
                            ₹{order.total}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
                      <div>
                        <p className='text-sm text-gray-500 mb-2'>Current Status</p>
                        <span className={`inline-block px-4 py-2 rounded-lg font-semibold border ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm text-gray-500 mb-2'>Items</p>
                        <ul className='ml-4 list-disc'>
                          {orders &&
                            orders[0].items.map((item: any, i: number) => (
                              <li key={item.id}>
                                {item.product.name} × {item.quantity}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <AdminOrdersPage />
        </>
      )}
    </div>
  )
}
