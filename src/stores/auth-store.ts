import { AuthSession } from "@/features/auth/types/auth.types";
import { UserResponse } from "@/features/auth/types/user.types";
import { create } from "zustand";

type AuthStatus = "idle" | "bootstrapping" | "authenticated" | "unauthenticated";

type AuthState = {
  accessToken: string | null;
  user: UserResponse | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  hasInitialized: boolean;
  startBootstrap: () => void;
  finishBootstrap: () => void;
  setSession: (session: AuthSession) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: UserResponse | null) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  status: "idle",
  hasInitialized: false,
  startBootstrap: () =>
    set((state) => ({
      status: state.isAuthenticated ? "authenticated" : "bootstrapping",
    })),
  finishBootstrap: () =>
    set((state) => ({
      status: state.isAuthenticated ? "authenticated" : "unauthenticated",
      hasInitialized: true,
    })),
  setSession: (session) =>
    set({
      ...session,
      isAuthenticated: true,
      status: "authenticated",
      hasInitialized: true,
    }),
  setAccessToken: (accessToken) =>
    set((state) => ({
      accessToken,
      user: state.user,
      isAuthenticated: true,
      status: "authenticated",
      hasInitialized: true,
    })),
  setUser: (user) => set({ user }),
  clearSession: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      status: "unauthenticated",
      hasInitialized: true,
    }),
}));
