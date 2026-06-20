import { PrismaAdapter } from "@next-auth/prisma-adapter";

import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";

import bcrypt from "bcrypt";

export const authOptions = {

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

        console.log("LOGIN ATTEMPT");

        if (
          !credentials?.email ||
          !credentials?.password
        ) {

          console.log("Missing credentials");

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

        console.log("USER FOUND:");

        console.log(user);

        if (!user) {

          console.log("No user");

          return null;
        }

        const passwordMatch =
          await bcrypt.compare(
            password,
            user.password
          );

        console.log("PASSWORD MATCH:");

        console.log(passwordMatch);

        if (!passwordMatch) {

          console.log("Wrong password");

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
        token.role = (user as any).role;
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