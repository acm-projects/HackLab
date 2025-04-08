import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      login?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    login?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    login?: string;
  }
}
