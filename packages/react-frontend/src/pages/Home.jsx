// src/pages/Home.jsx
import "./Home.css";

import { Link } from "react-router-dom";

import logo from "../assets/OpenShelf-Logo.png";
import profile_pic from "../assets/Profile-Picture.png";

export default function Home() {
  // Example "Today's Pick" data (replace with dynamic content later)
  const todaysPick = {
    image: "https://via.placeholder.com/200x300", // placeholder image
    title: "Pride and Prejudice",
    author: "Jane Austen"
  };

  return (
    <div className="page-container">
      {/* Top bar of the Home Page containing Logo, Search Bar, and Profile link */}
      <header className="home-header">
        {/* OpenShelf Logo (top-left) */}
        <Link to="/">
          <img src={logo} alt="OpenShelf Logo" className="home-logo" />
        </Link>

        {/* Search bar (top-middle) */}
        <div className="home-search-bar">
          <input
            type="text"
            placeholder="Search OpenShelf..."
            className="input"
          />
        </div>

        {/* Profile (top-right) */}
        <Link to="/profile">
          <img src={profile_pic} alt="Profile Picture" className="profile-picture" />
        </Link>
      </header>

      {/* Bar that contains the links to the other pages */} 
      <header className="links-bar">
        <nav className="links-nav">
          <Link to="/about" className="links-link">About</Link>
          <Link to="/post" className="links-link">Upload</Link>
          <Link to="/recentposted" className="links-link">Recently Posted</Link>
          <Link to="/popular" className="links-link">Most Popular</Link>
          <Link to="/categories" className="links-link">Categories</Link>
        </nav>
      </header>

      <main className="home-page-content">
        {/* Welcome message */}
        <section className="home-hero">
          <h1>Welcome to OpenShelf!</h1>
          <p>
            OpenShelf is a student-driven digital library where you can upload, share,
            and discover textbooks, research papers, videos, and other academic media,
            designed by students, for students.
          </p> 
          <p>
            Feel free to dive in, share your knowledge,
            and discover something new today - access to academic materials has never been easier!
          </p>
        </section>
      </main>
    </div>
  );
}

