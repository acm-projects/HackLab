// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      github_username?: string;
      isNewUser: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    github_username?: string;
  }

  interface Profile {
    login?: string;
    name?: string;
    email?: string;
    avatar_url?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    github_username?: string;
    isNewUser?: boolean;
  }
}