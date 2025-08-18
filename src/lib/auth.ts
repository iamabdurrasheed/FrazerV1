import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';
import { adminsTable, usersTable } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Import the verifyOTP function
import { verifyOTP } from '../app/api/auth/send-otp/route';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        phone: { label: 'Phone', type: 'tel' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'OTP', type: 'text' },
        role: { label: 'Role', type: 'text' },
        loginType: { label: 'Login Type', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.role) {
          return null;
        }

        const { email, phone, password, otp, role, loginType } = credentials;

        try {
          if (role === 'admin') {
            if (!email || !password) {
              return null;
            }

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
            let user = null;
            let identifier = '';

            // Find user by email or phone
            if (email) {
              user = await db.query.usersTable.findFirst({
                where: eq(usersTable.email, email)
              });
              identifier = email;
            } else if (phone) {
              user = await db.query.usersTable.findFirst({
                where: eq(usersTable.phone, phone)
              });
              identifier = phone;
            } else {
              return null;
            }

            if (!user) {
              return null;
            }

            // Handle different login types
            if (loginType === 'password') {
              // Traditional email/password login
              if (!email || !password) {
                return null;
              }

              if (!user.password) {
                return null; // User doesn't have password set
              }

              const isPasswordValid = await bcrypt.compare(password, user.password);
              if (!isPasswordValid) {
                return null;
              }
            } else if (loginType === 'otp') {
              // OTP-based login
              if (!otp) {
                return null;
              }

              // Verify OTP using the shared verifyOTP function
              const isOtpValid = verifyOTP(identifier, otp);
              if (!isOtpValid) {
                return null;
              }
            } else {
              return null; // Invalid login type
            }

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
