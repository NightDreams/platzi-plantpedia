import NextAuth from 'next-auth'

import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import TwitchProvider from 'next-auth/providers/twitch'

const options: NextAuthOptions = {
  theme: {
    colorScheme: 'light', // "auto" | "dark" | "light"
    brandColor: '', // Hex color code
    logo: '', // Absolute URL to image
  },
  providers: [
    CredentialsProvider({
      name: 'Platzi',
      credentials: {
        password: {
          label: 'Nunca pares de aprender',
          type: 'password',
          placeholder: '****************',
        },
      },
      async authorize(credentials) {
        // console.log('authorize', credentials)
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/platzi`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-type': 'application/json' },
        })

        const user = await res.json()

        if (res.ok && user) {
          return user
        }
        return null
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
    }),
  ],
  debug: process.env.NODE_ENV == 'development',
  secret: process.env.AUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 60 * 60 * 24 * 30,
  },
}
export default NextAuth(options)
