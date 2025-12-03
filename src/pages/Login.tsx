import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import styles from "../styles/auth-styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed.";
      setError(errorMessage);
    }
  };

  return (
    <div style={styles.form as React.CSSProperties}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        {error && (
          <p style={styles.error as React.CSSProperties}>{error}</p>
        )}

        <fieldset style={styles.fieldset as React.CSSProperties}>
          <legend style={styles.legend as React.CSSProperties}>Login</legend>

          <input
            style={styles.input as React.CSSProperties}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input as React.CSSProperties}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
