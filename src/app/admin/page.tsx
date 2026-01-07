import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth()
  console.log("Admin session:", session)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return <h1>Admin Dashboard</h1>
}
