/**
 * NextAuth v5 configuration
 *
 * Supports GitHub and Google OAuth out of the box.
 * Add more providers from https://authjs.dev/reference/core/providers
 */
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    // Add user id to the session so we can use it client-side
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },

    // Allow all sign-ins by default — add custom logic here
    authorized({ auth }) {
      return !!auth?.user
    },
  },

  // Using JWT sessions (no database required for auth)
  // Switch to database sessions by adding an adapter:
  // adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
