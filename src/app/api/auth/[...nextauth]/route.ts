import bcrypt from 'bcryptjs';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { type Credentials } from '@/types/user';
import { query } from '@/lib/db';

interface User {
  user_id: string;
  user_name: string;
  user_email: string;
  user_password: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }

  interface JWT {
    id: string;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        }

        const result = await query('SELECT * FROM admin_schema.users WHERE user_email = $1', [credentials.email]);

        const user: User | undefined = result.rows[0];

        if (!user) throw new Error('User not found');

        const isValid = await bcrypt.compare(credentials.password, user.user_password);
        if (!isValid) throw new Error('Invalid credentials');

        return {
          id: user.user_id,
          name: user.user_name,
          email: user.user_email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
