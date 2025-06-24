import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/dbConfing/dbConfing"
import User from "@/models/userModel"
import bcrypt from "bcryptjs"

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName: string;
  image?: string;
  companyId: string;
}

declare module "next-auth" {
  interface Session {
    user: UserSession;
  }
  interface User extends UserSession {
    // Extend the User type with additional properties if needed
    [key: string]: unknown;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends UserSession {
    // Extend the JWT type with additional properties if needed
    [key: string]: unknown;
  }
}

export const authOptions: NextAuthOptions = {
  debug: false,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/signup",
    error: "/signup",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter your email and password')
          }

          await dbConnect()
          
          const user = await User.findOne({ email: credentials.email, isActive: true })
          
          if (!user) {
            throw new Error('No user found with this email')
          }

          if (!user.isApproved && !user.isRejected) {
            throw new Error('Your account is pending approval. Please wait for an admin to approve your request.')
          }

          if (user.isRejected) {
            throw new Error('Your account has been rejected. Please contact your company admin.')
          }

          // Compare password using bcrypt
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.error('Password validation failed for user:', user.email)
            throw new Error('Invalid password')
          }

          // Update last login
          user.lastLogin = new Date()
          await user.save()

          // Create a type-safe user object
          const userData = {
            id: user._id.toString(),
            name: user.name || user.email.split('@')[0],
            email: user.email,
            role: user.role,
            companyId: user.companyId,
            companyName: user.companyName,
          }

          console.log('User authenticated successfully:', userData.email)
          return userData
        } catch (error) {
          console.error('Auth error:', error)
          if (error instanceof Error) {
            throw new Error(error.message)
          }
          throw new Error('Authentication failed')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
        token.companyId = user.companyId
        token.companyName = user.companyName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as string,
          companyId: token.companyId as string,
          companyName: token.companyName as string,
        }
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-fallback-secret-key-here',
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} 