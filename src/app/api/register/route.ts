import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password, role } = await req.json()

   const existingUser=await prisma.user.findUnique({
    where:{email}
   })
   if (existingUser){
    return NextResponse.json({error:"User exists"},{status:400});
   }
  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role, // ✅ ADMIN or USER
    },
  })

  return NextResponse.json(user)
}
