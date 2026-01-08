import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "../api/client";
import { login as apiLogin, register as apiRegister, getMe } from "../api/endpoints";
import type { LoginDto, RegisterDto, UserDto } from "../types";

type AuthState = {
  token: string | null;
  user: UserDto | null;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  signIn: (payload: LoginDto) => Promise<void>;
  signUp: (payload: RegisterDto) => Promise<void>;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const stored = await AsyncStorage.getItem(TOKEN_KEY);
        if (!mounted) return;

        setToken(stored);

        // If we have a token, try to fetch the current user (helps after app restart)
        if (stored) {
          try {
            const me = await getMe();
            if (mounted) setUser(me);
          } catch {
            // token could be expired/invalid
            await AsyncStorage.removeItem(TOKEN_KEY);
            if (mounted) {
              setToken(null);
              setUser(null);
            }
          }
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    async function signIn(payload: LoginDto) {
      const res = await apiLogin(payload);
      await AsyncStorage.setItem(TOKEN_KEY, res.accessToken);
      setToken(res.accessToken);

      setUser({
        id: res.userId,
        username: res.username,
        name: res.name,
        email: res.email,
      });
    }

    async function signUp(payload: RegisterDto) {
      await apiRegister(payload);
      // After signup, auto-login (backend accepts username OR email)
      await signIn({ usernameOrEmail: payload.username, password: payload.password });
    }

    async function signOut() {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }

    async function refreshMe() {
      if (!token) return;
      const me = await getMe();
      setUser(me);
    }

    return { token, user, isLoading, signIn, signUp, signOut, refreshMe };
  }, [token, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
