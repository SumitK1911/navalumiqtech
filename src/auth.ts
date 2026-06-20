import { PrismaAdapter } from "@next-auth/prisma-adapter";

import CredentialsProvider from "next-auth/providers/credentials";

import type { AuthOptions } from "next-auth";

import { prisma } from "@/lib/prisma";

import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {

  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [

    CredentialsProvider({

      name: "credentials",

      credentials: {

        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },

      },

      async authorize(credentials) {

        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const normalizedEmail = credentials.email.trim().toLowerCase();

        const user =
          await prisma.user.findUnique({

            where: {
              email: normalizedEmail,
            },

          });

        if (!user) {
          return null;
        }

        const isValid =
          await bcrypt.compare(
            credentials.password,
            user.password
          );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user && "role" in user) {
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
};
