import {CakeCard} from '@/components/shared/cake-card'
import { prisma } from '@/lib/prisma'
export default async function CakesPage () {

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return (
    <div className='grid grid-cols-3 gap-4 p-8'>
      {!products || products.length <0 ? (
        <p>No products available.</p>
      ) : (
        <>
        {products.map((product) => (
          <CakeCard 
            key={product.id} 
            id={product.id}
            name={product.name}
            price={product.price} 
            
          />
        ))}
        </>

      )}

    </div>
  )
}
