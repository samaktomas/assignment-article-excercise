"use client";
import { SessionProvider } from "next-auth/react";

export function Provider({ session, children }: any) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
