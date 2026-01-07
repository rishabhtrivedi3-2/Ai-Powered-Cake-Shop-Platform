'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function RegisterPage () {
  const [role, setRole] = useState('USER')
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
        role
      })
    })

    if (res.ok) {
      alert('Registration Successful')
      router.push('/login')
      router.refresh()
    } else if (res.status === 400) {
      setError('user exists')
    } else {
      alert('Registration Failed')
    }
  }

  return (
    <>
      <div>{error && <p style={{ color: 'red' }}>{error}</p>}</div>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input name='email' placeholder='Email' />
        <input name='password' type='password' placeholder='Password' />

        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value='USER'>User</option>
          <option value='ADMIN'>Admin</option>
        </select>

        <button type='submit'>Register</button>
      </form>
    </>
  )
}
