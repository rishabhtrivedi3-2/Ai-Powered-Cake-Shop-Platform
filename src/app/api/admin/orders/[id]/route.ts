import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"; 
import { error } from "console";
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
    const session = await auth();
    const resolvedParams=await params;

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { status } = await req.json()
  console.log(status);
  try{

    const order = await prisma.order.update({
      where: { id: resolvedParams.id },
      data: { status },
    })
    return NextResponse.json(order)
  }catch(err){
    return NextResponse.json({error:err}, { status: 500 });
  }

}

