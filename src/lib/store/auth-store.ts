import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "firebase/auth";
import { StateCreator } from "zustand";

type UserRole = "admin" | "doctor" | "paramedic" | "lab" | "customer";

interface UserData {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  role: UserRole;
  name?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  qualification?: string;
  specialization?: string;
  experience?: number;
  location?: string;
  createdAt: Date;
  lastLogin: Date;
}

interface AuthState {
  user: User | null;
  userData: UserData | null;
  role: UserRole | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setUserData: (userData: UserData | null) => void;
  setRole: (role: UserRole | null) => void;
  setLoading: (isLoading: boolean) => void;
  signOut: () => void;
  updateUserData: (data: Partial<UserData>) => void;
}

type AuthStore = StateCreator<AuthState>;

export const useAuthStore = create<AuthState>()(
  persist(
    ((set) => ({
      user: null,
      userData: null,
      role: null,
      isLoading: true,
      setUser: (user: User | null) => set({ user }),
      setUserData: (userData: UserData | null) => set({ userData }),
      setRole: (role: UserRole | null) => set({ role }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      signOut: () => set({ user: null, userData: null, role: null }),
      updateUserData: (data: Partial<UserData>) =>
        set((state) => ({
          userData: state.userData ? { ...state.userData, ...data } : null,
        })),
    })) as AuthStore,
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        userData: state.userData,
        role: state.role,
      }),
    }
  )
);

export type { UserRole, UserData };
