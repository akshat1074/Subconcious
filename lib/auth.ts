import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { db } from './db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }).safeParse(credentials)

        if (!parsed.success) return null

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        })

        if (!user || !user.password) return null

        const valid = await bcrypt.compare(parsed.data.password, user.password)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existing = await db.user.findUnique({ where: { email: user.email! } })
        if (!existing) {
          await db.user.create({
            data: {
              email: user.email!,
              name: user.name || 'User',
              image: user.image,
              provider: 'google',
              providerId: account.providerAccountId,
            },
          })
        } else if (existing.provider !== 'google') {
          await db.user.update({
            where: { id: existing.id },
            data: { provider: 'google', providerId: account.providerAccountId, image: user.image },
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.user.findUnique({ where: { email: token.email! } })
        if (dbUser) token.id = dbUser.id
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
})
