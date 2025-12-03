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

// ⬅ REMOVE the duplicate interface here
import type { UserProfile } from "../types/types";

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

  const loadUserProfile = async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      setProfile({
        id: snapshot.id,
        name: data.name,
        email: data.email,
        address: data.address ?? "",
      });
    }
  };

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

  const register = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(cred.user, { displayName: name });

    const userDoc = {
      name,
      email: cred.user.email || "",
      address: "",
    };

    await setDoc(doc(db, "users", cred.user.uid), userDoc);

    setProfile({
      id: cred.user.uid,
      ...userDoc,
    });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setProfile(null);
    await signOut(auth);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, data);

    setProfile((prev) => (prev ? { ...prev, ...data } : prev));
  };

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
