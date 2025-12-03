import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import styles from "../styles/auth-styles";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });
      navigate('/profile');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div style={styles.form as React.CSSProperties}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        {error && (
          <p style={styles.error as React.CSSProperties}>{error}</p>
        )}

        <fieldset style={styles.fieldset as React.CSSProperties}>
          <legend style={styles.legend as React.CSSProperties}>
            Register
          </legend>

          <input
            style={styles.input as React.CSSProperties}
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input as React.CSSProperties}
            type='text'
            placeholder='Name'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <input
            style={styles.input as React.CSSProperties}
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type='submit'>Register</button>
        </fieldset>
      </form>
    </div>
  );
};

export default Register;
