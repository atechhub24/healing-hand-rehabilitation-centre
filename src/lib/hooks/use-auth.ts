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
import { ref, set, get, update } from "firebase/database";
import { auth, database } from "../firebase";
import { useAuthStore, UserData, UserRole } from "../store/auth-store";

export const useAuth = () => {
  const [verificationId, setVerificationId] = useState<string>("");
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const {
    setUser,
    setUserData,
    setRole,
    setLoading,
    signOut: clearAuthStore,
  } = useAuthStore();

  const updateUserLastLogin = async (uid: string) => {
    const userRef = ref(database, `users/${uid}`);
    await update(userRef, {
      lastLogin: new Date().toISOString(),
    });
  };

  const createOrUpdateUserData = async (
    uid: string,
    data: Partial<UserData>,
    isNewUser: boolean = false
  ) => {
    const userRef = ref(database, `users/${uid}`);
    const currentData = isNewUser ? {} : (await get(userRef)).val();

    const updatedData = {
      ...currentData,
      ...data,
      uid,
      lastLogin: new Date().toISOString(),
      ...(isNewUser && { createdAt: new Date().toISOString() }),
    };

    await set(userRef, updatedData);
    return updatedData;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        try {
          const userRef = ref(database, `users/${user.uid}`);
          const snapshot = await get(userRef);
          const userData = snapshot.val();

          if (userData) {
            setUser(user);
            setUserData(userData);
            setRole(userData.role);
            await updateUserLastLogin(user.uid);
          } else {
            setUser(null);
            setUserData(null);
            setRole(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          setUserData(null);
          setRole(null);
        }
      } else {
        setUser(null);
        setUserData(null);
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
  }, [setUser, setUserData, setRole, setLoading]);

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
      await updateUserLastLogin(userCredential.user.uid);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    role: UserRole,
    userData: Partial<UserData>
  ) => {
    try {
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
      setUserData(newUserData as UserData);
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

  const verifyOTP = async (otp: string, userData?: Partial<UserData>) => {
    try {
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

      setUserData(newUserData as UserData);
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
