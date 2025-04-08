import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
//changes made - april 7

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
  adapter: PostgresAdapter(pool),
  
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: { 
          scope: "read:user user:email repo",
          prompt: "consent" // Forces re-authentication when session expires
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour for testing
    updateAge: 60 * 30, // Check every 30 seconds
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as { id: number; login: string };
        token.id = githubProfile.id.toString();
        token.login = githubProfile.login;
      }
      return token;
    },    
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.login = token.login as string;
      return session;
    },  

    async signIn({ user }) {
      console.log("✅ User Attempting Sign In:", user);
      return !!user;
    },

    async redirect({ url, baseUrl }) {
      if (url.includes("/Survey")) return `${baseUrl}/Survey`;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/Survey",
    error: "/",
    signOut: "/",
  },

  debug: process.env.NODE_ENV !== "production",
};

const authHandler = NextAuth(authOptions);
export { authHandler as GET, authHandler as POST };