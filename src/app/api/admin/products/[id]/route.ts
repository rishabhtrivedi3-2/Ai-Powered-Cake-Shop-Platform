import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth";
export async function PATCH(req:Request,params:{params:{id:string}}){
  const session=await auth();
  const { id } = await params.params
  if (session?.user.role!=="ADMIN"){
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  try{

      const product = await prisma.product.update({
          where: {id:id},
          data: {
              name: body.name,
              price: body.price,
              description: body.description,
              image: body.image,
            },
        })
        
        return NextResponse.json({product},{status:200})
    }catch(err){    
        return NextResponse.json({error:err}, { status: 500 }); 
    }
}
export async function DELETE(req:Request,params:{params:{id:string}}){
    const session=await auth();
    const { id } = await params.params
    if (session?.user.role!=="ADMIN"){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const product=await prisma.product.delete({
        where:{id:id}
    })
    return NextResponse.json({product},{status:200})
}