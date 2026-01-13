import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
export async function PATCH(req: Request, { params }: any) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const updated = await prisma.customCakeRequest.update({
    where: { id: params.id },
    data: {
      finalPrice: body.finalPrice,
      status: "APPROVED",
      adminNote: body.note,
    },
  })

  return NextResponse.json(updated)
}