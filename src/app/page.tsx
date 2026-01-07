import { CakeCard } from '@/components/shared/cake-card'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import Link from 'next/link'



export default async function Home() {
  const products = await prisma.product.findMany()
  const session = await auth()

  return (
    <div className='min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50'>
       {/* Hero Section */}
      <section className='max-w-7xl mx-auto px-6 py-20'>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <div className='animate-fadeIn'>
            <h2 className='text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
              Freshly Baked{' '}
              <span className='bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'>
                Happiness
              </span>
            </h2>
            <p className='text-lg text-gray-600 mb-8 leading-relaxed'>
              Indulge in our artisanal cakes crafted with love and the finest ingredients. Every bite is a celebration.
            </p>
            <Link
              href='/cakes'
              className='inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300'
            >
              Explore Our Menu
            </Link>
          </div>
          <div className='text-center'>
            <div className='text-9xl animate-bounce'>🎂</div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className='bg-gray-50 border-t border-amber-100 mt-20'>
        <div className='max-w-7xl mx-auto px-6 py-12 text-center text-gray-600'>
          <p>© 2026 Cake Shop. Handcrafted with ❤️</p>
        </div>
      </footer>

      {/* <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style> */}
    </div>
  )
}
