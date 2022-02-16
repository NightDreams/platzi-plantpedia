import NextAuth from 'next-auth'

import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const options: NextAuthOptions = {
  theme: {
    colorScheme: 'light', // "auto" | "dark" | "light"
    brandColor: '', // Hex color code
    logo: '', // Absolute URL to image
  },
  debug: true,
  session: {},
  jwt: {},
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
  ],
}

export default NextAuth(options)
