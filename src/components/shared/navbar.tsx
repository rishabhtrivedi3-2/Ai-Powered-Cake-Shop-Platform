'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { signOut } from '@/auth'
import { LogOutPage } from '@/app/(auth)/logout/page'
import { logoutAction } from '@/actions/auth-actions'
import { LogoutButton } from '../logout-button'
import { ShoppingCart } from 'lucide-react'
import CheckoutPage from '@/app/checkout/page'


export function Navbar () {
  const { data: session, status } = useSession()

  return (
    <header className='fixed top-0 z-50 w-full border-b bg-background'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-6'>
        {/* Logo */}
        <Link href='/' className='text-xl font-bold'>
          🎂 CakeShop
        </Link>
        {/* Navigation */}

        <nav className='flex items-center gap-4'>
          <Link href='/cakes'>Cakes</Link>
          <Link href='/orders'>Orders</Link>

          {status == 'authenticated' ? (
            <>
              <span>{session?.user.role}</span>
              <LogoutButton />
            </>
          ) : (
            <Link href='/login'>
              <Button>Login</Button>
            </Link>
          )}

          {status == 'authenticated' && session?.user.role!=="ADMIN" ? (
                  <CheckoutPage/>

          ) : (<div></div>
            // <Link href='/register'>
            //   <Button>Register</Button>
            // </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
