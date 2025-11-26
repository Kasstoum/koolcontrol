// src/api/auth.ts
import { api } from "./http";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post("/auth/v2/login/", payload);
  return res.data;
}