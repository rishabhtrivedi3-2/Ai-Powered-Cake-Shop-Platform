import { auth } from "@/auth"

export default async function AdminProductsPage() {
  const session = await auth()

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>
      <p>Manage your cakes here 🍰</p>
    </div>
  )
}
