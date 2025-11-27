import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import MostPopular from "./pages/MostPopular";
import RecentlyPosted from "./pages/RecentlyPosted";
import Help from "./pages/Help";
import Search from "./pages/Search";
import AccountManagement from "./pages/AccountManagement";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Categories from "./pages/Categories";
import Continue from "./pages/Continue";
import Recommended from "./pages/Recommended";
import Favorites from "./pages/Favorites";
import Upload from "./pages/Upload";

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
          path="/help"
          element={
            <>
              <NavBar />
              <Help />
    	    </>
  	  }
	/>

	<Route
	  path="/post"
	  element={
	    <>
	      <NavBar />
	      <Upload />
	    </>
	  }
	/>

	<Route
  	  path="/favorites"
  	  element={
    	    <>
      	      <NavBar />
      	      <Favorites />
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
  	  path="/recommended"
  	  element={
    	    <>
      	      <NavBar />
      	      <Recommended />
    	    </>
  	  }
	/>


	<Route
  	  path="/continue"
  	  element={
    	    <>
      	      <NavBar />
      	      <Continue />
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
	<Route
          path="/login"         
          element={
            <>
              <NavBar />
              <Login />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default MyApp;

