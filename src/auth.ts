import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        const email = credentials.email as string;
        const password = credentials.password as string;
        const user = await prisma.user.findUnique({
          where: { email },
          
        })

        if (!user || !(user as any).password) return null

        const valid = await bcrypt.compare(
          password,
          (user as any).password 
        )

        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await prisma.user.upsert({
          where: { email: user.email! },
          update: {},
          create: {
            email: user.email!,
            name: user.name,
            image: user.image,
          },
        })
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as any).role ?? "USER"
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
 