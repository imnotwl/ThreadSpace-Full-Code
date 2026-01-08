import Constants from "expo-constants";
import { Platform } from "react-native";

function inferDevBaseUrl(): string {
  const hostUri =
    (Constants.expoConfig as any)?.hostUri ??
    (Constants as any).debuggerHost ??
    (Constants as any).manifest2?.extra?.expoClient?.hostUri ??
    (Constants as any).manifest?.debuggerHost;

  if (typeof hostUri === "string" && hostUri.length > 0) {
    const host = hostUri.split(":")[0];
    if (host) return `http://${host}:8080`;
  }

  // Fallbacks if hostUri isn't available
  // Android emulator only:
  if (Platform.OS === "android") return "http://10.0.2.2:8080";
  return "http://localhost:8080";
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? inferDevBaseUrl();
