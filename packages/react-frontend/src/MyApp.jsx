import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import NavBar from "./components/NavBar";

function MyApp() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar current="home" />
              <Home />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <NavBar current="about" />
              <About />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <NavBar current="profile" />
              <Profile />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default MyApp;

