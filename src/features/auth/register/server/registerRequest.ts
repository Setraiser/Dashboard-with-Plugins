import { apiClient } from "@/shared/lib/server/apiClient/apiClient";
import { RegisterFormData } from "../model/types/registerTypes";

export function registerRequest(data: RegisterFormData) {
  return apiClient("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
