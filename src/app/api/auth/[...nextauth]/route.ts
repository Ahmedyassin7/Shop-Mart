import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  debug: true,
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password", placeholder: "password" },
      },

      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
      
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email.trim(),
            password: credentials.password,
          }),
          cache: "no-store",
        });
      
        const payload: unknown = await res.json();
      
        console.log("SIGNIN status:", res.status);
        console.log("SIGNIN payload:", payload);
      
        if (!res.ok) return null;
      
      
        if (!payload || typeof payload !== "object") return null;
        const p = payload as Record<string, any>;
      
        const token = typeof p.token === "string" ? p.token : null;
        const user = p.user && typeof p.user === "object" ? (p.user as Record<string, any>) : null;
      
        if (!token || !user) return null;
      
        // لو مفيش _id من API اعمل id بديل ثابت (email مثلاً)
        const id =
          typeof user._id === "string"
            ? user._id
            : typeof user.id === "string"
            ? user.id
            : typeof user.email === "string"
            ? user.email
            : "unknown";
      
        return {
          id,
          name: typeof user.name === "string" ? user.name : null,
          email: typeof user.email === "string" ? user.email : null,
          role: typeof user.role === "string" ? user.role : null,
          token,
        };
      },
      
    }),
  ],

  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
          role: (user as any).role ?? null,
        };
        token.token = user.token;
      }
      return token;
    },

    session: ({ session, token }) => {
      session.user = token.user!;
      session.token = token.token ?? "";
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
