// Login.jsx

import "./Login.css";

import logo from "../assets/OpenShelf-Logo.png";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await login(username, pwd);

    if (!res.success) {
      setError(res.error);
      return;
    }

    navigate("/profile"); // Redirect after login
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <img 
          src={logo} 
          alt="OpenShelf Logo Large"
          className="Login-Logo"
        />

        <h2>Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="error">{error}</p>}

          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />

          <button type="submit">Log In</button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
