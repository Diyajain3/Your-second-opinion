import { useMemo, useState } from "react";
import { AuthContext } from "./authContext";

function readUser() {
  try {
    const raw =
      localStorage.getItem("second-opinion-user") ||
      sessionStorage.getItem("second-opinion-user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  function signIn(data) {
    if (data?.token) {
      localStorage.setItem("second-opinion-token", data.token);
      sessionStorage.setItem("second-opinion-token", data.token);
    }
    if (data?.user) {
      localStorage.setItem("second-opinion-user", JSON.stringify(data.user));
      sessionStorage.setItem("second-opinion-user", JSON.stringify(data.user));
    }
    setUser(data.user);
  }

  function signOut() {
    localStorage.removeItem("second-opinion-token");
    localStorage.removeItem("second-opinion-user");
    sessionStorage.removeItem("second-opinion-token");
    sessionStorage.removeItem("second-opinion-user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, signIn, signOut }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
