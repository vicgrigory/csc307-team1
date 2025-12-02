// MyApp.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import MostPopular from "./pages/MostPopular";
import ContinueReading from "./pages/ContinueReading";
import Recommended from "./pages/Recommended";
import RecentlyPosted from "./pages/RecentlyPosted";
import Categories from "./pages/Categories";
import Help from "./pages/Help";
import UserFavorites from "./pages/UserFavorites";
import UserUploads from "./pages/UserUploaded";

import Search from "./pages/Search";
import AccountManagement from "./pages/AccountManagement";

import NavBar from "./components/NavBar";
import ScrollToTop from "./components/ScrollToTop";

function MyApp() {
  return (
    <Router>
      <ScrollToTop />
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
          path="/continue"
          element={
            <>
              <NavBar />
              <ContinueReading />
            </>
          }
        />
        <Route
          path="/recommended"
          element={
            <>
              <NavBar />
              <Recommended />
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
          path="/categories"
          element={
            <>
              <NavBar />
              <Categories />
            </>
          }
        />
        <Route
          path="/help"
          element={
            <>
              <NavBar />
              <Help />
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
        <Route
          path="/favorites"
          element={
            <>
              <NavBar />
              <UserFavorites />
            </>
          }
        />
        <Route
          path="/uploads"
          element={
            <>
              <NavBar />
              <UserUploads />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default MyApp;