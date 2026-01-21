import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"; 
import { error } from "console";
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const resolvedParams=await params;

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
const body = await req.json();
    const { status } = body;
  console.log(status);
  try{
    const {id}=await params;
    const order = await prisma.order.update({
      where: { id},
      data: {  status },
    })
    return NextResponse.json({order},{status:200})
  }catch(err){
    return NextResponse.json({error:err}, { status: 500 });
  }

}

