// Home.jsx

import "./Home.css";

import { Link } from "react-router-dom";

export default function Home() {
  // Example "Today's Pick" data (replace with dynamic content later)
  const todaysPick = {
    image: "https://via.placeholder.com/200x300", // placeholder image
    title: "Pride and Prejudice",
    author: "Jane Austen"
  };

  return (
    <div className="page-container">
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

