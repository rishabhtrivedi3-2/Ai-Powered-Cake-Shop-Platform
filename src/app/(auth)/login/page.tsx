'use client'
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from '@/components/ui/button'

export default function LoginPage () {
    const { data: session, status } = useSession()
  const router = useRouter()
console.log("Session:", session);
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/")
      router.refresh();
    }
  }, [status, router])

  // if (status === "loading") return null

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Button onClick={() => signIn('google', { callbackUrl: '/' })}>
        Sign in with Google
      </Button>
    </div>
  )
}
