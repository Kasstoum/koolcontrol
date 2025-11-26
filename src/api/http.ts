// src/api/http.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.koolnova.com",
  timeout: 10000,
});

export function setToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}