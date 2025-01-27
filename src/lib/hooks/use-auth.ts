"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "../firebase";
import useMounted from "./use-mounted";
import mutateData from "../firebase/mutate-data";
import { useRouter } from "next/navigation";

type UserRole = "admin" | "doctor" | "paramedic" | "lab" | "customer";

interface UserData {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  role: UserRole;
  name?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  address?: string;
  qualification?: string;
  specialization?: string;
  experience?: number;
  location?: string;
  createdAt: Date;
  lastLogin: Date;
}

interface AuthState {
  user: UserData | null;
  role: UserRole | null;
  isLoading: boolean;
  isInitialized: boolean;
  setAuthState: (state: Partial<AuthState>) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isLoading: true,
      isInitialized: false,
      setAuthState: (state: Partial<AuthState>) =>
        set((prev) => ({ ...prev, ...state })),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        role: state.role,
      }),
    }
  )
);

export const useAuth = () => {
  const router = useRouter();
  const [verificationId, setVerificationId] = useState<string>("");
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const { mounted } = useMounted();

  const state = useAuthStore();
  const setAuthState = useAuthStore(
    (
      state: AuthState & { setAuthState: (state: Partial<AuthState>) => void }
    ) => state.setAuthState
  );

  const updateUserLastLogin = async (uid: string) => {
    const lastLogin = new Date();
    await mutateData({
      path: `users/${uid}`,
      data: { lastLogin: lastLogin.toISOString() },
      action: "update",
    });
  };

  const createOrUpdateUserData = async (
    uid: string,
    data: Partial<UserData>,
    isNewUser: boolean = false
  ) => {
    const action = isNewUser ? "create" : "update";
    const updatedData = {
      ...data,
      uid,
      lastLogin: new Date(),
      ...(isNewUser && { createdAt: new Date() }),
    };

    await mutateData({
      path: `users/${uid}`,
      data: {
        ...updatedData,
        lastLogin: updatedData.lastLogin.toISOString(),
        ...(updatedData.createdAt && {
          createdAt: updatedData.createdAt.toISOString(),
        }),
      },
      action,
    });

    return updatedData;
  };

  useEffect(() => {
    let unsubscribed = false;
    setAuthState({ isLoading: true });

    // Set persistence to LOCAL
    setPersistence(auth, browserLocalPersistence);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (unsubscribed || !mounted.current) return;

      try {
        if (user) {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          const userData = snapshot.val();

          if (userData) {
            setAuthState({
              user: userData,
              role: userData.role,
              isLoading: false,
              isInitialized: true,
            });
            await updateUserLastLogin(user.uid);

            // Only redirect if on auth pages and current path doesn't include role
            const currentPath = window.location.pathname;
            if (currentPath.startsWith("/auth")) {
              router.push(`/${userData.role}`);
            }
          } else {
            await firebaseSignOut(auth);
            setAuthState({
              user: null,
              role: null,
              isLoading: false,
              isInitialized: true,
            });
            if (!window.location.pathname.startsWith("/auth")) {
              router.push("/auth/login");
            }
          }
        } else {
          setAuthState({
            user: null,
            role: null,
            isLoading: false,
            isInitialized: true,
          });
          // Only redirect to login if not on public pages and not already on a role page
          const currentPath = window.location.pathname;
          const isPublicPath =
            currentPath.startsWith("/auth") || currentPath === "/";
          const hasRoleInPath = currentPath.split("/")[1] === state.role;

          if (!isPublicPath && !hasRoleInPath) {
            router.push("/auth/login");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAuthState({
          user: null,
          role: null,
          isLoading: false,
          isInitialized: true,
        });
      }
    });

    return () => {
      unsubscribed = true;
      unsubscribe();
    };
  }, [mounted, router, state.role, setAuthState]);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setAuthState({
        user: null,
        role: null,
        isLoading: false,
        isInitialized: true,
      });
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setAuthState({ isLoading: true });
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateUserLastLogin(userCredential.user.uid);

      const userRef = ref(database, `users/${userCredential.user.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (userData) {
        setAuthState({ user: userData });
        router.push(`/${userData.role}`);
      }

      return { success: true, user: userCredential.user, role: userData?.role };
    } catch (error) {
      return { success: false, error };
    } finally {
      setAuthState({ isLoading: false });
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    role: UserRole,
    userData: Partial<UserData>
  ) => {
    try {
      setAuthState({ isLoading: true });
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUserData = await createOrUpdateUserData(
        userCredential.user.uid,
        {
          ...userData,
          email,
          role,
        },
        true
      );
      setAuthState({ user: newUserData as UserData });
      router.push(`/${role}`);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error };
    } finally {
      setAuthState({ isLoading: false });
    }
  };

  const signInWithPhone = async (phoneNumber: string) => {
    try {
      setAuthState({ isLoading: true });
      const verifier = initRecaptcha();
      const formattedPhoneNumber = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        formattedPhoneNumber,
        verifier
      );
      setVerificationId(verificationId);
      return { success: true };
    } catch (error) {
      console.error("Error in phone authentication:", error);
      return { success: false, error };
    } finally {
      setAuthState({ isLoading: false });
    }
  };

  const verifyOTP = async (otp: string, userData?: Partial<UserData>) => {
    try {
      setAuthState({ isLoading: true });
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);

      const newUserData = await createOrUpdateUserData(
        userCredential.user.uid,
        {
          ...userData,
          phoneNumber: userCredential.user.phoneNumber,
          role: "customer" as UserRole,
        },
        true
      );

      setAuthState({ user: newUserData as UserData });
      router.push(`/${state.role}`);
      return {
        success: true,
        user: userCredential.user,
        role: newUserData.role,
      };
    } catch (error) {
      console.error("Error in OTP verification:", error);
      return { success: false, error };
    } finally {
      setAuthState({ isLoading: false });
    }
  };

  const initRecaptcha = () => {
    try {
      if (!recaptchaVerifier) {
        const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "normal",
          callback: () => {
            // Callback when reCAPTCHA is solved
          },
          "expired-callback": () => {
            // Callback when reCAPTCHA expires
          },
        });
        setRecaptchaVerifier(verifier);
        return verifier;
      }
      return recaptchaVerifier;
    } catch (error) {
      console.error("Error initializing reCAPTCHA:", error);
      throw error;
    }
  };

  return {
    ...state,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    signInWithPhone,
    verifyOTP,
    verificationId,
    setVerificationId,
    initRecaptcha,
  };
};

export type { UserRole, UserData };
