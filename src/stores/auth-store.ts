import { create } from "zustand";

export type User = {
  username: string;
  email: string;
};

type AuthStatus = "idle" | "bootstrapping" | "authenticated" | "unauthenticated";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  hasInitialized: boolean;
  startBootstrap: () => void;
  finishBootstrap: () => void;
  setSession: (payload: { accessToken: string; user?: User | null }) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User | null) => void;
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
  setSession: ({ accessToken, user }) =>
    set({
      accessToken,
      user: user ?? null,
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
