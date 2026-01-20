export const dynamic = 'force-dynamic';

// Rest of your imports...

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
export default async function CustomCakesAdminPage () {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }
  const data = await prisma.customCakeRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })
  return (
    <div>Custom Cakes Admin Page - Accessible only to authenticated users.</div>
  )
}
