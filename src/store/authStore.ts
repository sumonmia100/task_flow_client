import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setAccessToken: (token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
        }
        set({ accessToken: token });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "taskflow-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
