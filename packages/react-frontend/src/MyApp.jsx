// MyApp.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import MostPopular from "./pages/MostPopular";
import ContinueReading from "./pages/ContinueReading";
import Recommended from "./pages/Recommended";
import RecentlyPosted from "./pages/RecentlyPosted";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";

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
          path="/login"
          element={<Login />} 
          />
          <Route 
            path="/register" 
            element={<Register 
          />} />
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
          path="/search"
          element={
            <>
              <NavBar />
              <Search />
            </>
          }
        />
       <Route
         path="/profile"
         element={
           <ProtectedRoute>
             <>
               <NavBar />
               <Profile />
             </>
           </ProtectedRoute>
         }
       />

       <Route
         path="/account"
         element={
           <ProtectedRoute>
             <>
               <NavBar />
               <AccountManagement />
             </>
           </ProtectedRoute>
         }
       />
      </Routes>
    </Router>
  );
}

export default MyApp;