import { signOut } from "@/auth.client";
import { request } from "http";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    
    await signOut({ redirect: true });
    return NextResponse.redirect(new URL("/",req.url));
}