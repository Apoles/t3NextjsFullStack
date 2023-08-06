import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import * as argon from "argon2";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: "eb94d836b7516f678f2e",
      clientSecret: "84b8af6e437579e8b71f561a9b9244652e6d9ce8",
    }),

    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        const user = await prisma.user.findUnique({
          where: { email: credentials?.username },
        });

        const userPassword: string = user?.password ?? ""; // Varsa kullan, yoksa boş bir string atar.
        const credentialsPassword: string = credentials?.password ?? "";

        try {
          if (await argon.verify(userPassword, credentialsPassword)) {
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt(params) {
      // update token
      if (params.user?.email) {
        params.token.email = params.user.email;
      }
      // return final_token
      return params.token;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 3, // 30 Days
  },

  secret: "ed13f74c8ce431849be1a6a3f6747914",
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
