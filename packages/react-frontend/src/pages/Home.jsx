import "./Home.css";
import { useRef } from "react";
import { Link } from "react-router-dom";

// Helper Function for creating the rows of content
function Row({ title, items, viewMoreTo }) {
  const rowRef = useRef(null);
  const scroll = (direction) => {
    const element = rowRef.current;
    if (!element) return;
    const amount = direction === "left" ? -element.clientWidth : element.clientWidth;
    element.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="home-section">
      <div className="home-section-header">
        <h2 className="home-section-title">{title}</h2>
        {viewMoreTo && (
          <Link to={viewMoreTo} className="home-section-viewmore">
            View more »
          </Link>
        )}
      </div>

      <div className="home-row-wrapper">
        <button
          className="row-arrow left"
          type="button"
          onClick={() => scroll("left")}
        >
          ‹
        </button>

        <div className="home-row" ref={rowRef}>
          {items.map((item) => (
            <div className="home-card" key={item.id}>
              <img
                src={item.image}
                alt={item.title}
                className="home-card-thumb"
              />
              <div className="home-card-text">
                <p className="home-card-title">{item.title}</p>
                <p className="home-card-meta">
                  {item.type} • {item.author}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="row-arrow right"
          type="button"
          onClick={() => scroll("right")}
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  // Dummy data (replace with actual content later)
  const mostPopular = [
    { id: 1, title: "Introduction to Algorithms", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Algorithms" },
    { id: 2, title: "Linear Algebra Made Easy", type: "Notes", author: "Steven Arata", image: "https://via.placeholder.com/200x280?text=Linear+Algebra" },
    { id: 3, title: "Operating Systems Overview", type: "Slides", author: "Zach Peterson", image: "https://via.placeholder.com/200x280?text=OS+Overview" },
    { id: 4, title: "Discrete Mathematics Essentials", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Discrete+Math" },
    { id: 5, title: "Data Structures in C++", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=C++" },
  ];

  const continueReading = [
    { id: 6, title: "Machine Learning Basics", type: "PDF", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=ML+Basics" },
    { id: 7, title: "Deep Learning Notes", type: "Notes", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Deep+Learning" },
    { id: 8, title: "Research Methods Primer", type: "Paper", author: "Jean Davidson", image: "https://via.placeholder.com/200x280?text=Research+Methods" },
  ];

  const recommendedForYou = [
    { id: 9, title: "Neural Networks Explained", type: "Video", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Neural+Nets" },
    { id: 10, title: "Probability for CS", type: "Textbook", author: "Bret Holladay", image: "https://via.placeholder.com/200x280?text=Probability" },
    { id: 11, title: "Database Systems Summary", type: "Notes", author: "Andrew Migler", image: "https://via.placeholder.com/200x280?text=Databases" },
  ];

  const todaysTopPicks = [
    { id: 12, title: "Intro to HCI", type: "Lecture Notes", author: "Ayaan Kazerouni", image: "https://via.placeholder.com/200x280?text=HCI" },
    { id: 13, title: "Ethics in AI", type: "Article", author: "Jane Lehr", image: "https://via.placeholder.com/200x280?text=AI+Ethics" },
    { id: 14, title: "Distributed Systems 101", type: "Slides", author: "Dev Sisodia", image: "https://via.placeholder.com/200x280?text=Distributed+Systems" },
  ];

  const recentlyUploaded = [
    { id: 15, title: "Graph Theory Homework", type: "PDF", author: "Damon Lin", image: "https://via.placeholder.com/200x280?text=Graph+Theory" },
    { id: 16, title: "CS1 Study Guide", type: "Notes", author: "Ayaan Kazerouni", image: "https://via.placeholder.com/200x280?text=CS1" },
    { id: 17, title: "Signals & Systems Cheatsheet", type: "PDF", author: "Gavin Reakseaker", image: "https://via.placeholder.com/200x280?text=Signals" },
  ];

  return (
    <div className="page-container">
      <main className="home-page-content">
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

        {/* Sections */}
        <Row title="Most Popular" items={mostPopular} viewMoreTo="/popular"/>
        <Row title="Continue Reading" items={continueReading} viewMoreTo="/continue"/>
        <Row title="Recommended for You" items={recommendedForYou} viewMoreTo="/recommended"/>
        <Row title="Today’s Top Picks" items={todaysTopPicks} />
        <Row title="Recently Uploaded" items={recentlyUploaded} viewMoreTo="/recentposted" />
      </main>
    </div>
  );
}

