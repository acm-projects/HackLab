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
  adapter: PostgresAdapter(pool),

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
          prompt: "consent",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 60 * 30,
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (account?.provider === "github") {
        token.id = account.providerAccountId;
      }

      // ✅ Safely attach email from account/user if available
      if (!token.email && user?.email) {
        token.email = user.email;
      }

      // 🔍 Check if user is new based on email
      try {
        if (token.email) {
          const res = await fetch("http://52.15.58.198:3000/users");
          const users = await res.json();
          const isExisting = users.some((u: any) => u.email === token.email);
          token.isNewUser = !isExisting;
          console.log("🧠 isNewUser:", token.isNewUser);
        } else {
          console.warn("⚠️ Email not available in token.");
          token.isNewUser = true;
        }
      } catch (err) {
        console.error("❌ Failed to check user existence:", err);
        token.isNewUser = true;
      }

      return token;
    },

    async session({ session, token }) {
      if (Date.now() / 1000 > (token.exp as number)) {
        throw new Error("Session expired");
      }

      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      session.user.isNewUser = token.isNewUser as boolean;
      return session;
    },

    async signIn({ user }) {
      console.log("✅ Sign in attempt from:", user.email);
      return !!user;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/homeScreen`; // Do manual redirect from client using isNewUser flag
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
