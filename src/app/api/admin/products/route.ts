import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await auth()

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()

  const name = formData.get("name") as string
  const price = Number(formData.get("price"))
  const description = formData.get("description") as string
  const imageFile = formData.get("image") as File | null

  let imageUrl: string | null = null

  if (imageFile) {
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    imageUrl = `data:${imageFile.type};base64,${buffer.toString("base64")}`
  }

  const product = await prisma.product.create({
    data: {
      name,
      price,
      description,
      image: imageUrl,
    },
  })

  return NextResponse.json(product)
}
