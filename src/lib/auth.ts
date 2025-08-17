import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';
import { adminsTable, usersTable } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null;
        }

        const { email, password, role } = credentials;

        try {
          if (role === 'admin') {
            const admin = await db.query.adminsTable.findFirst({
              where: eq(adminsTable.email, email)
            });

            if (!admin) {
              return null;
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);

            if (!isPasswordValid) {
              return null;
            }

            return {
              id: admin.id.toString(),
              email: admin.email,
              name: admin.name,
              role: 'admin'
            };
          } else if (role === 'user') {
            const user = await db.query.usersTable.findFirst({
              where: eq(usersTable.email, email)
            });

            if (!user) {
              return null;
            }

            // For users, we'll use a simple email-based authentication
            // In a real app, you'd want to add password fields to users table
            // For now, we'll just check if the email exists
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: 'user'
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module 'next-auth' {
  interface User {
    role: string;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    id: string;
  }
}
