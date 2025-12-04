import React from "react";
import ReactDOM from "react-dom/client";
import MyApp from "./MyApp";
import "./main.css"; // optional, for your styles
import AuthProvider from "./auth/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <MyApp />
    </AuthProvider>
  </React.StrictMode>
);

