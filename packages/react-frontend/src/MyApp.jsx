// MyApp.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Upload from "./pages/Upload";
import MostPopular from "./pages/MostPopular";
import ContinueReading from "./pages/ContinueReading";
import Recommended from "./pages/Recommended";
import RecentlyPosted from "./pages/RecentlyPosted";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import Categories from "./pages/Categories";
import Help from "./pages/Help";
import UserFavorites from "./pages/UserFavorites";
import UserUploads from "./pages/UserUploaded";
import Reviews from "./pages/Reviews";
import Eula from "./pages/Eula";
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
            <ProtectedRoute>
            <>
              <NavBar />
              <About />
            </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/post"
          element={
            <ProtectedRoute>
            <>
              <NavBar />
              <Upload />
            </>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/popular"
          element={
            <ProtectedRoute>
            <>
              <NavBar />
              <MostPopular />
            </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/continue"
          element={
            <ProtectedRoute>
            <>
              <NavBar />
              <ContinueReading />
            </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommended"
          element={
            <ProtectedRoute>
            <>
              <NavBar />
              <Recommended />
            </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recentposted"
          element={
            <ProtectedRoute>
            <>
              <NavBar />
              <RecentlyPosted />
            </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
            <>
              <NavBar />
              <Categories />
            </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
            <>
              <NavBar />
              <Help />
            </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
            <>
              <NavBar />
              <Search />
            </>
            </ProtectedRoute>
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
        
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
            <>
              <NavBar />
              <UserFavorites />
            </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploads"
          element={
            <ProtectedRoute>
            <>
              <NavBar />
              <UserUploads />
            </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
            <>
              <NavBar />
              <Reviews />
            </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/eula"
          element={
            <>
              <NavBar />
              <Eula />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default MyApp;