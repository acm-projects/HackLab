import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";


// PostgreSQL Pool Setup
const pool = new Pool({
 host: process.env.DATABASE_HOST,
 user: process.env.DATABASE_USER,
 password: process.env.DATABASE_PASSWORD,
 database: process.env.DATABASE_NAME,
 port: Number(process.env.DATABASE_PORT) || 5432,
 ssl: { rejectUnauthorized: false },
 max: 20,
 idleTimeoutMillis: 30000,
 connectionTimeoutMillis: 2000,
});


// GitHub OAuth credentials check
if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
 throw new Error("❌ Missing GitHub clientId or clientSecret in .env file");
}


const authOptions: NextAuthOptions = {
 // adapter: PostgresAdapter(pool), // ✅ leave this in if persisting user data


 providers: [
   GitHubProvider({
     clientId: process.env.GITHUB_ID!,
     clientSecret: process.env.GITHUB_SECRET!,
     authorization: {
       params: { scope: "read:user user:email repo" }, // very important!
     },
   }),
  
 ],


 session: {
   strategy: "jwt", // ✅ needed to access accessToken in frontend
   maxAge: 10 * 60,
   updateAge: 5 * 60,
 },


 callbacks: {
   async jwt({ token, account }) {
     if (account?.access_token) {
       token.accessToken = account.access_token;
     }
     if (account?.provider === "github") {
       token.id = account.providerAccountId; // GitHub user ID
     }
     return token;
   },
   async session({ session, token }) {
     session.accessToken = token.accessToken as string;
     session.user.id = token.id as string;
     return session;
   },


   // ✅ Keep your logging logic
   async signIn({ user }) {
     console.log("✅ User Attempting Sign In:", user);
     return !!user;
   },


   async redirect({ url, baseUrl }) {
     if (url.includes("/Survey/name")) return `${baseUrl}/Survey/name`;
     return baseUrl;
   },
 },


 pages: {
   signIn: "/Survey/name",
   error: "/",
   signOut: "/",
 },


 debug: true, // ✅ Helpful during development
};


const authHandler = NextAuth(authOptions);
export { authHandler as GET, authHandler as POST };





