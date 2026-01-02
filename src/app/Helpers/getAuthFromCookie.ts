"use server";

import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getAuthFromCookie() {
  const cookieStore = cookies();

  const sessionToken =
    (await cookieStore).get("next-auth.session-token")?.value ||
    (await cookieStore).get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    return { token: null, userId: null };
  }

  const decoded = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET!,
  });


  return {
    token: (decoded as any)?.token ?? null,
    userId: (decoded as any)?.id ?? null,
  };
}
