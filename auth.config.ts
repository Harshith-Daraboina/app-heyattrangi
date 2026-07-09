import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import type { Adapter } from "next-auth/adapters"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if (!user || !(user as any).password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          (user as any).password
        )

        if (!isPasswordValid) {
          return null
        }

        return user
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        const domain = user.email.split("@")[1]?.toLowerCase()
        if (domain) {
          const org = await prisma.organization.findFirst({
            where: {
              domains: {
                has: domain,
              },
            },
          })

          if (org && (user.plan !== "ORGANIZATION" || user.orgId !== org.id)) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                plan: "ORGANIZATION",
                orgId: org.id,
              },
            })
          }
        }
      }

      return true
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects after OAuth - preserve callback URL if specified
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      // If external URL, redirect to base URL (will be handled by our callback route)
      if (new URL(url).origin === baseUrl) {
        return url
      }
      // Default to callback handler
      return `${baseUrl}/auth/callback`
    },
    async jwt({ token, account, profile, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token, user }) {
      // With JWT strategy, user ID is in token.id
      const userId = (token?.id as string) || user?.id

      if (session.user && userId) {
        try {
          // Get user role and plan from database
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
              patient: true,
              doctor: true,
              admin: true,
            },
          })
          
          session.user.id = userId
          session.user.role = dbUser?.role || "PATIENT"
          session.user.plan = dbUser?.plan
          session.user.orgId = dbUser?.orgId
        } catch (error) {
          console.error("Error in session callback:", error)
          session.user.id = userId
          session.user.role = "PATIENT"
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
})

