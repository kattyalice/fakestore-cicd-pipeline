// src/context/AuthContext.tsx
import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User
} from "firebase/auth";
import { db, auth } from "../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

// Firestore user shape
interface UserProfile {
  name: string;
  email: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  register: (email: string, password: string, name: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateProfileData: (data: Partial<UserProfile>) => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  register: () => {},
  login: () => {},
  logout: () => {},
  updateProfileData: () => {},
  deleteAccount: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Load Firestore profile
  const loadUserProfile = async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      setProfile(snapshot.data() as UserProfile);
    }
  };

  // Listen for login/logout
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await loadUserProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
    });

    return () => unsub();
  }, []);

  // Register new user
  const register = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(cred.user, { displayName: name });

    const userDoc = {
      name: name,
      email: cred.user.email || "",
      address: "",
    };

    await setDoc(doc(db, "users", cred.user.uid), userDoc);
    setProfile(userDoc);
  };

  // Login
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = async () => {
    setProfile(null);
    await signOut(auth);
  };

  // Update profile in Firestore
  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, data);

    setProfile((prev) => prev ? { ...prev, ...data } : prev);
  };

  // Delete account
  const deleteAccount = async () => {
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid));
    await user.delete();

    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, register, login, logout, updateProfileData, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
