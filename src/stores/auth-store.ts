import { create } from "zustand";

type User = {
  username: string;
  email: string;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setSession: (payload: { accessToken: string; user?: User | null }) => void;
  setUser: (user: User | null) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setSession: ({ accessToken, user }) =>
    set({
      accessToken,
      user: user ?? null,
      isAuthenticated: true,
    }),
  setUser: (user) => set({ user }),
  clearSession: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    }),
}));
