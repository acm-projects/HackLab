import NextAuth, { DefaultSession, DefaultUser } from "next-auth";


declare module "next-auth" {
 interface Session {
   user: {
     id: string;
     name?: string | null;
     email?: string | null;
     image?: string | null;
   } & DefaultSession["user"];
   accessToken?: string; // ✅ move outside of `user` to be correct
 }


 interface User extends DefaultUser {
   id: string;
 }
}


declare module "next-auth/jwt" {
 interface JWT {
   accessToken?: string;
   id?: string;
 }
}





