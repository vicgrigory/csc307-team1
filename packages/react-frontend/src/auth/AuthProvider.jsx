import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved auth state on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");

    if (savedToken) setToken(savedToken);
    if (savedUsername) setUsername(savedUsername);

    setLoading(false);
  }, []);

  // -------------------------
  // LOGIN -> POST /login
  // -------------------------
  async function login(usernameInput, passwordInput) {
    try {
      const res = await fetch("https://team1project-g9eehgd9fybtere2.westus3-01.azurewebsites.net/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          pwd: passwordInput,
        }),
      });

      if (!res.ok) {
        throw new Error("Invalid username or password.");
      }

      const data = await res.json(); // { token: "..." }

      setToken(data.token);
      setUsername(usernameInput);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", usernameInput);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // -------------------------
  // REGISTER -> POST /signup
  // -------------------------
  async function register(usernameInput, passwordInput) {
    try {
      const res = await fetch("https://team1project-g9eehgd9fybtere2.westus3-01.azurewebsites.net/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          pwd: passwordInput,
        }),
      });

      if (!res.ok) {
        throw new Error("Registration failed.");
      }

      const data = await res.json(); // { token: "..." }

      setToken(data.token);
      setUsername(usernameInput);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", usernameInput);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // -------------------------
  // LOGOUT
  // -------------------------
  function logout() {
    setToken(null);
    setUsername(null);

    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }

  const value = {
    token,
    username,
    loading,
    login,
    register,
    logout,
    isLoggedIn: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
