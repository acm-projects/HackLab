import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";

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

      if (!token.email && user?.email) {
        token.email = user.email;
      }

      // ✅ Check user creation time using your backend
      try {
        if (token.email) {
          const res = await fetch("http://52.15.58.198:3000/users");
          const users = await res.json();
          const thisUser = users.find((u: any) => u.email === token.email);

          if (thisUser?.email) {
            const createdAt = new Date(thisUser.created_at || thisUser.createdAt || 0).getTime();
            const now = Date.now();
            const threshold = 60 * 1000; // 1 minute threshold
            token.isNewUser = (now - createdAt) < threshold;

            console.log("🧠 createdAt:", createdAt);
            console.log("🧠 isNewUser:", token.isNewUser);
          } else {
            token.isNewUser = true;
          }
        }
      } catch (err) {
        console.error("❌ Failed to check user creation time:", err);
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

    async redirect({ url, baseUrl }) {
      if (url.includes("/signout")) return `${baseUrl}/`;
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
