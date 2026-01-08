import axios, { type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEY = "BLOGAPP_TOKEN";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("AXIOS baseURL =", api.defaults.baseURL);

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = (config.headers ?? {}) as any;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
