import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/dbConfing/dbConfing"
import User from "@/models/userModel"

interface UserSession {
  id: string
  name: string
  email: string
  role: string
  companyName: string
  image?: string
  username: string
  companyId: string
}

declare module "next-auth" {
  interface Session {
    user: UserSession
  }
  interface User extends UserSession {}
}

declare module "next-auth/jwt" {
  interface JWT extends UserSession {}
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        await dbConnect()
        
        const user = await User.findOne({ email: credentials.email })
        
        if (!user) {
          throw new Error('No user found with this email')
        }

        const isPasswordValid = await user.comparePassword(credentials.password)

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        // Update last login
        user.lastLogin = new Date()
        await user.save()

        return {
          id: user._id.toString(),
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          companyName: user.companyName,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.username = token.username as string
        session.user.email = token.email as string
        session.user.role = token.role as string
        session.user.companyId = token.companyId as string
        session.user.companyName = token.companyName as string
      }

      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.username = user.username
        token.email = user.email
        token.role = user.role
        token.companyId = user.companyId
        token.companyName = user.companyName
      }

      return token
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} 