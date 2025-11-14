// src/pages/About.jsx
import "./About.css";

import { Link } from "react-router-dom";

import logo from "../assets/OpenShelf-Logo.png";
import logo_blue from "../assets/OpenShelf-Logo-BlueBack.png";
import profile_pic from "../assets/Profile-Picture.png";

export default function About() {
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
          <Link to="/upload" className="links-link">Upload</Link>
          <Link to="/recentposted" className="links-link">Recently Posted</Link>
          <Link to="/popular" className="links-link">Most Popular</Link>
          <Link to="/categories" className="links-link">Categories</Link>
        </nav>
      </header>

      {/* About Page Layout */}
      <main className="page-content">
        <div className="about-layout">

          {/* LEFT — About Us text */}
          <div className="about-page-content">
            <section>
              <h1>About Us</h1>
              <p>
                OpenShelf is a student-driven digital library dedicated to making academic
                knowledge accessible, organized, and openly shared. Built with the vision
                of supporting students, researchers, and lifelong learners, OpenShelf serves
                as a hub for textbooks, scholarly papers, study guides, videos, and other
                forms of educational media.
              </p>
              <p>
                Our platform was created out of a simple idea: learning should not be
                locked behind paywalls. Whether you're preparing for class, conducting
                research, or simply exploring new subjects, OpenShelf provides a space
                where information flows freely and is supported by its own community.
              </p>
            </section>

            <section>
              <h2>Our Mission</h2>
              <p>
                We aim to empower students by giving them the tools to organize, share,
                and access high-quality learning materials. OpenShelf encourages an
                open-knowledge culture where every student can contribute by uploading
                their own notes, resources, or discoveries.
              </p>
              <p>
                Beyond accessibility, we prioritize clarity and simplicity. Every part of
                OpenShelf is designed to be intuitive, distraction-free, and easy to use,
                so that learners can focus on what matters — the content itself.
              </p>
            </section>

            <section>
              <h2>Our Values</h2>
              <p>
                OpenShelf follows three core values: Openness, Community, and Integrity.
                We believe in knowledge without barriers, collaboration without ego, and
                content that upholds the principles of respect and educational legitimacy.
              </p>
            </section>

            <section>
              <h2>Who We Serve</h2>
              <p>
                While OpenShelf was created for students, our library welcomes anyone who
                wants to expand their knowledge. Educators, independent researchers,
                hobbyists, and curious learners all benefit from its growing pool of
                student-curated resources.
              </p>
            </section>

            <section>
              <h2>Contact Us</h2>
              <p>Email: support@openshelf.com</p>
              <p>Phone Number: (805) 123-4567</p>
            </section>
          </div>

          {/* RIGHT — Big logo */}
          <div className="about-logo-right-wrapper">
            <img
              src={logo_blue}
              alt="OpenShelf Logo Large"
              className="about-logo-right"
            />
          </div>

        </div>
      </main>

    </div>
  );
}

