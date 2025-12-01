import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const Logout = () => {
    useEffect (()=> {
        signOut(auth);
    }, [])
  return (
    <div>
      Logout
    </div>
  )
};

export default Logout
