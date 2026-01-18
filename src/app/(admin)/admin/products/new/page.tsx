'use client'

import { useState } from 'react'

export default function NewProductPage () {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData, // ✅ FormData
      })

      if (res.ok) {
        alert('Product added successfully')
        e.currentTarget.reset()
      } else {
        alert('Failed to add product')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-8 max-w-xl'>
      <h1 className='text-2xl font-bold mb-4'>Add New Product</h1>

      <form className='space-y-4' onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Product name"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}
