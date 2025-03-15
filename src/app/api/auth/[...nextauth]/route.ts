import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";

// ✅ PostgreSQL Connection to AWS
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT) || 5432,
  ssl: { rejectUnauthorized: false }, // Required for AWS RDS
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ✅ Ensure required environment variables exist
if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error("❌ Missing GitHub clientId or clientSecret in .env file");
}

// ✅ Define authentication options
const authOptions: NextAuthOptions = {
  adapter: PostgresAdapter(pool), // PostgreSQL as session storage
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 2 * 60 * 60, // 2-hour session expiration
    updateAge: 30 * 60, // Update session every 30 minutes
  },
  callbacks: {
    async signIn({ user }) {
      console.log("✅ User Attempting Sign In:", user);
      return !!user;
    },
    async redirect({ url, baseUrl }) {
      console.log(`🔄 Redirecting to: ${url}`);
      return `${baseUrl}/homeScreen`; // ✅ Updated Path (No `.tsx`)
    },
    async session({ session }) {
      console.log("🔍 Current Session:", session);
      return session;
    },
  },
  pages: {
    signIn: "/homeScreen", // ✅ Redirect to `/homeScreen`
    error: "/", // Redirect to landing page on error
    signOut: "/",
  },
  debug: true,
};

// ✅ Create NextAuth Handler
const authHandler = NextAuth(authOptions);
export { authHandler as GET, authHandler as POST };
