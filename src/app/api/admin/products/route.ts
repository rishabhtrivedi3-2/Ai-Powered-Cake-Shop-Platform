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

  const body = await req.json()

  const product = await prisma.product.create({
    data: {
      name: body.name,
      price: body.price,
      description: body.description,
      image: body.image,
    },
  })

  return NextResponse.json(product)
}
