import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function CustomCakesAdminPage () {
  const session = await auth()
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }
  const data = await prisma.customCakeRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })
  return (
    <div>Custom Cakes Admin Page - Accessible only to authenticated users.</div>
  )
}
