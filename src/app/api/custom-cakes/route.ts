import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
    const session=await auth();
    if (!session?.user) {
        return NextResponse.json({error:"Unauthorized"},{status:401});
    }
    const body=await req.json();
    const request=await prisma.customCakeRequest.create({
        data:{
            userId:session.user.id,
            prompt:body.prompt,
            aiImage:body.aiImage,
            expectedPrice:body.expectedPrice

        },
    })
    return NextResponse.json({request},{status:201});
}
export async function GET() {
    const session=await auth();
    if (!session?.user) {
        return NextResponse.json({error:"Unauthorized"},{status:401});
    }
    const requests=await prisma.customCakeRequest.findMany({
        where:{userId:session.user.id},
        orderBy:{createdAt:"desc"},
    });
    return NextResponse.json({requests},{status:200});
}
export async function PATCH(req: Request) {
    const session=await auth();
    if (!session?.user) {
        return NextResponse.json({error:"Unauthorized"},{status:401});
    }
    const  {requestId,status,finalPrice}=await req.json();
    try{

        const updatedRequest=await prisma.customCakeRequest.update({
            where:{id:requestId},
        data:{status:status,finalPrice:finalPrice},
        
        
    });
    return NextResponse.json({updatedRequest},{status:200});
}catch(error){
    return NextResponse.json({error:error},{status:500});
}
}