import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import styles from "../styles/auth-styles";

const Profile: React.FC = () => {
  const { user, profile, logout } = useAuth();

  const [name, setName] = useState(profile?.name ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [message, setMessage] = useState("");

  // Sync form state with profile once it's loaded
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setAddress(profile.address ?? "");
    }
  }, [profile]);

  // UPDATE Firestore user doc
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !profile) {
      setMessage("User not found.");
      return;
    }

    try {
      await updateDoc(doc(db, "users", profile.id), {
        name: name,
        address: address,
      });

      setMessage("Profile updated!");
    } catch {
      setMessage("Error updating profile.");
    }
  };

  // DELETE Firestore doc + Firebase account
  const handleDelete = async () => {
    if (!user || !profile) {
      setMessage("User not found.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete your account?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "users", profile.id)); // Firestore document
      await user.delete(); // Firebase Auth account
      setMessage("Account deleted.");
    } catch {
      setMessage("Error deleting account.");
    }
  };

  if (!user || !profile) {
    return <h2 style={{ marginTop: "20px" }}>Please log in to view your profile.</h2>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h1>Your Profile</h1>

      <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", width: "300px", gap: "10px" }}>
        
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
          style={styles.input}
          type="email"
          value={profile.email}
          disabled
        />

        <button style={styles.button} type="submit">
          Update Profile
        </button>
      </form>

      {message && <p>{message}</p>}

      <button
        onClick={handleDelete}
        style={{ ...styles.deleteAccountButton, marginTop: "15px" }}
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
