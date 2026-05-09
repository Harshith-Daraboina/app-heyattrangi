import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import type { Adapter } from "next-auth/adapters"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    async jwt({ token, account, profile }) {
      // Handle JWT if needed (though we're using database sessions)
      return token
    },
    async session({ session, user }) {
      if (session.user && user) {
        try {
          // Get user role and plan from database
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
              patient: true,
              caregiver: true,
              doctor: true,
              admin: true,
            },
          })
          
          session.user.id = user.id
          session.user.role = dbUser?.role || "PATIENT"
          session.user.plan = dbUser?.plan
          session.user.orgId = dbUser?.orgId
        } catch (error) {
          console.error("Error in session callback:", error)
          session.user.id = user.id
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
    strategy: "database",
  },
})

