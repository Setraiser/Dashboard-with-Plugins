import "server-only";

import { redirect } from "next/navigation";
import { getCurrentUser } from "./current-user";
export async function requiredUser() {
  const user = await getCurrentUser();
  console.log(user, "USer");

  if (!user) {
    // Импортируем динамически, чтобы избежать ошибок в клиентских компонентах
    redirect("/login");
  }

  return user;
}
