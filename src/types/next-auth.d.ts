import { DefaultSession } from "next-auth";

export type AppUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: AppUser;
    token: string;
  }

  interface User extends AppUser {
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: AppUser;
    token?: string;
  }
}
