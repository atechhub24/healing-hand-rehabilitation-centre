import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "firebase/auth";
import { StateCreator } from "zustand";

type UserRole = "admin" | "doctor" | "paramedic" | "lab" | "customer";

interface AuthState {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole | null) => void;
  setLoading: (isLoading: boolean) => void;
  signOut: () => void;
}

type AuthStore = StateCreator<AuthState>;

export const useAuthStore = create<AuthState>()(
  persist(
    ((set): AuthState => ({
      user: null,
      role: null,
      isLoading: true,
      setUser: (user: User | null) => set({ user }),
      setRole: (role: UserRole | null) => set({ role }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      signOut: () => set({ user: null, role: null }),
    })) as AuthStore,
    {
      name: "auth-storage",
      partialize: (state: AuthState) => ({
        user: state.user,
        role: state.role,
      }),
    }
  )
);
