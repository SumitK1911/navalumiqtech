import { PrismaAdapter } from "@next-auth/prisma-adapter";

import CredentialsProvider from "next-auth/providers/credentials";

import type { AuthOptions } from "next-auth";

import { prisma } from "@/lib/prisma";

import bcrypt from "bcrypt";

const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

export const authOptions: AuthOptions = {

  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt" as const,
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

        const email =
          (credentials.email as string).trim().toLowerCase();

        const password =
          credentials.password as string;

        const user =
          await prisma.user.findUnique({

            where: {
              email,
            },

          });

        if (!user) {

          return null;
        }

        const passwordMatch =
          await bcrypt.compare(
            password,
            user.password
          );

        if (!passwordMatch) {

          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
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

  secret: authSecret,

  pages: {
    signIn: "/login",
  },
};