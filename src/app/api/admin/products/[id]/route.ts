import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth";
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try{

    
    const formData = await req.formData()

  const name = formData.get("name") as string
  const price = Number(formData.get("price"))
  const imageFile = formData.get("image") as File | null

  let imageUrl: string | undefined

  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    imageUrl = `data:${imageFile.type};base64,${buffer.toString("base64")}`
  }
  const pId=await params; 

  const product = await prisma.product.update({
    where: { id: pId.id },
    data: {
      name,
      price,
      image:imageUrl
    }
  })
  
  return NextResponse.json(product)
}catch(err){
  return NextResponse.json({error:err},{status:500})

}
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Fixed: must be a Promise in Next.js 15
) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params; // Unwrap params

    const product = await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Product deleted", product }, { status: 200 });
  } catch (err) {
    console.error("[PRODUCT_DELETE]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}