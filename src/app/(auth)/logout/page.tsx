'use client'
import { signOut } from '@/auth'
import { redirect } from 'next/navigation'

export async function LogOutPage () {
await signOut({ redirectTo: "/login" })  
}
