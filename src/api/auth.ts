import { apiRequest } from "./apiRequest";

// REQUEST PASSWORD RESET
export async function requestPasswordReset(email: string) {
  return apiRequest<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// RESET PASSWORD WITH TOKEN
export async function resetPasswordWithToken(token: string, newPassword: string) {
  return apiRequest<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}