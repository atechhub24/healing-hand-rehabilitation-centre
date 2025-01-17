import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthStore } from "../store/auth-store";

export const useAuth = () => {
  const [verificationId, setVerificationId] = useState<string>("");
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const {
    setUser,
    setRole,
    setLoading,
    signOut: clearAuthStore,
  } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.data()?.role;
        setUser(user);
        setRole(role);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, [setUser, setRole, setLoading]);

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

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    role: string,
    userData: any
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        ...userData,
        role,
        createdAt: new Date(),
      });
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signInWithPhone = async (phoneNumber: string) => {
    try {
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
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);

      // Create or update user document
      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          phoneNumber: userCredential.user.phoneNumber,
          role: "customer",
          createdAt: new Date(),
        },
        { merge: true }
      );

      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Error in OTP verification:", error);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      clearAuthStore();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    signInWithEmail,
    signUpWithEmail,
    signInWithPhone,
    verifyOTP,
    signOut,
  };
};
