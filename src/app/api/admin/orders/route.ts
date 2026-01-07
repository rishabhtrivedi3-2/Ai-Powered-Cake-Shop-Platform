import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
export async function GET() {
    const session = await auth();
    if (session?.user.role === "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const order = await prisma.order.findMany({
        include: {

            user: true,
            items: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ order }, { status: 200 });
}