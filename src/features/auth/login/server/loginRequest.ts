import { apiClient } from "@/shared/lib/server/apiClient/apiClient";
import { LoginData, LoginResponse } from "./types";

export function loginRequest(data: LoginData) {
  return apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
