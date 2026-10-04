"use server";

import { destroySession } from "@/shared/lib/server/auth/session";
import { redirect } from "next/navigation";

export async function logout() {
  await destroySession();
  redirect("/login");
}
