import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import MostPopular from "./pages/MostPopular";
import RecentlyPosted from "./pages/RecentlyPosted";

import Search from "./pages/Search";
import AccountManagement from "./pages/AccountManagement";
<<<<<<< Updated upstream
=======
import Login from "./pages/Login";

>>>>>>> Stashed changes
import NavBar from "./components/NavBar";

function MyApp() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar />
              <Home />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <NavBar />
              <About />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <NavBar />
              <Profile />
            </>
          }
        />
        <Route 
          path="/popular"
          element={
            <>
              <NavBar />
              <MostPopular />
            </>
          }
        />
        <Route
          path="/recentposted"
          element={
            <>
              <NavBar />
              <RecentlyPosted />
            </>
          }
        />
        <Route
          path="/search"
          element={
            <>
              <NavBar />
              <Search />
            </>
          }
        />
        <Route
          path="/account"
          element={
            <>
              <NavBar />
              <AccountManagement />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default MyApp;

