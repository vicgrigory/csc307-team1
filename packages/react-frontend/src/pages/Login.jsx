import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login functionality coming soon!");
  };

  return (
    <div className="page-container">
      <h1>Log In</h1>

      <form onSubmit={handleSubmit} className="login-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Passcode</label>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          required
        />

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

