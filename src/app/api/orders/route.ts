import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { error } from "console";
export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { items,total, userId } = await req.json();
const calculatedTotal = items.reduce((sum: number, item: any) => {
  return sum + (item.price * item.quantity);
}, 0);
try{

    const order = await prisma.order.create({
        data: {
            userId: session.user.id,
            total: calculatedTotal,
            email: session.user.email || '',
            items: {
                create: items.map((item: any) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    
                }))
            }
        }
    })
    return NextResponse.json({ order }, { status: 201 });
}catch(err){
    return NextResponse.json({err }, { status: 500 });

}
}
export async function GET() {
    const session = await auth();
    try {

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        else if (session?.user.role === "USER") {
            return NextResponse.json({ message: "user" }, { status: 200 })

        }
        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            include: { items: { include: { product: true } } }
        })
        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ error: error }, { status: 500 });
    }
}