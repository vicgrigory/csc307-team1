// NavBar.jsx

import "./NavBar.css";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import logo from "../assets/OpenShelf-Logo.png";
import profile_pic from "../assets/Profile-Picture.png";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [navSearchQuery, setNavSearchQuery] = useState("");

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  return (
  <>
      {/* Top header (logo left, search center, profile right) */}
      <header className="home-header">

        {/* Logo */}
        <Link to="/">
          <img src={logo} className="home-logo" alt="OpenShelf Logo" />
        </Link>

        {/* Search bar */}
        <form className="home-search-bar" onSubmit={handleNavSearch}>
          <input
            type="text"
            placeholder="Search OpenShelf..."
            className="input"
            value={navSearchQuery}
            onChange={(e) => setNavSearchQuery(e.target.value)}
          />
        </form>

        {/* Profile picture */}
        <Link to="/profile">
          <img src={profile_pic} className="profile-picture" alt="Profile" />
        </Link>
      </header>

      {/* Links bar */}
      <header className="links-bar">
        <nav className="links-nav">
          <Link to="/about" className="links-link">About</Link>
          <Link to="/post" className="links-link">Upload</Link>
          <Link to="/popular" className="links-link">Most Popular</Link>
          <Link to="/continue" className="links-link">Continue Reading</Link>
          <Link to="/recommended" className="links-link">Recommended for You</Link>
          <Link to="/recentposted" className="links-link">Recently Posted</Link>
          <Link to="/categories" className="links-link">Categories</Link>
          <Link to="/help" className="links-link">Help</Link>
        </nav>
      </header>

      {/* Page content */}
      <main className="page-content">
        {children}
      </main>
    </>
  )
}

