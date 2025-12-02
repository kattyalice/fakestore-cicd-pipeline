// src/pages/Profile.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import styles from "../styles/auth-styles";

const Profile = () => {
  const { user, profile, logout } = useAuth();

  const [name, setName] = useState(profile?.name || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [message, setMessage] = useState("");

  if (!user || !profile) {
    return <p>You must be logged in to view your profile.</p>;
  }

  // UPDATE FIRESTORE USER DOCUMENT
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userRef = doc(db, "users", profile.id);

      await updateDoc(userRef, {
        name: name,
        address: address,
      });

      setMessage("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile.");
    }
  };

  // DELETE FIRESTORE DOC + AUTH ACCOUNT
  const handleDeleteAccount = async () => {
    try {
      // Delete Firestore document
      await deleteDoc(doc(db, "users", profile.id));

      // Delete Firebase Auth account
      await user.delete();

      setMessage("Account deleted.");
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Error deleting account.");
    }
  };

  return (
    <div>
      <h1>Profile</h1>

      <form
        onSubmit={handleUpdate}
        style={{ display: "flex", flexDirection: "column", width: "300px", gap: "10px" }}
      >
        <input
          style={styles.input}
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="Your Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          disabled
          style={styles.input}
          value={profile.email}
          placeholder="Email"
        />

        <button style={styles.button} type="submit">
          Update Profile
        </button>
      </form>

      {message && <p>{message}</p>}

      <button
        onClick={handleDeleteAccount}
        style={{ ...styles.deleteAccountButton, marginTop: "20px" }}
      >
        Delete Account
      </button>

      <button
        onClick={logout}
        style={{ marginTop: "10px" }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
