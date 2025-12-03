// Home.jsx

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

// Helper function to handle upload dates
function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

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

                {item.views != null && item.uploadedAt && (
                  <p className="home-card-meta">
                    {item.views} views • Uploaded{" "}
                    {formatDate(item.uploadedAt)}
                  </p>
                )}
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
    { id: 1, title: "Introduction to Algorithms", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Algorithms", views: 1542, uploadedAt: "2025-01-05T10:00:00Z" },
    { id: 2, title: "Linear Algebra Made Easy", type: "Notes", author: "Steven Arata", image: "https://via.placeholder.com/200x280?text=Linear+Algebra", views: 1320, uploadedAt: "2025-01-08T14:30:00Z" },
    { id: 3, title: "Operating Systems Overview", type: "Slides", author: "Zach Peterson", image: "https://via.placeholder.com/200x280?text=OS+Overview", views: 1104, uploadedAt: "2025-01-10T08:45:00Z" },
    { id: 4, title: "Discrete Mathematics Essentials", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Discrete+Math", views: 975, uploadedAt: "2025-01-12T11:15:00Z" },
    { id: 5, title: "Data Structures in C++", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=C++", views: 860, uploadedAt: "2025-01-14T09:20:00Z" },
    { id: 6, title: "Machine Learning Basics", type: "PDF", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=ML+Basics", views: 845, uploadedAt: "2025-01-15T13:00:00Z" },
    { id: 7, title: "Deep Learning Notes", type: "Notes", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Deep+Learning", views: 780, uploadedAt: "2025-01-17T11:30:00Z" },
    { id: 9, title: "Neural Networks Explained", type: "Video", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Neural+Nets", views: 990, uploadedAt: "2025-01-18T08:00:00Z" },
    { id: 10, title: "Probability for CS", type: "Textbook", author: "Bret Holladay", image: "https://via.placeholder.com/200x280?text=Probability", views: 720, uploadedAt: "2025-01-19T14:45:00Z" },
  ];

  const continueReading = [
    { id: 6, title: "Machine Learning Basics", type: "PDF", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=ML+Basics", views: 845, uploadedAt: "2025-01-15T13:00:00Z" },
    { id: 7, title: "Deep Learning Notes", type: "Notes", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Deep+Learning", views: 780, uploadedAt: "2025-01-17T11:30:00Z" },
    { id: 8, title: "Research Methods Primer", type: "Paper", author: "Jean Davidson", image: "https://via.placeholder.com/200x280?text=Research+Methods", views: 432, uploadedAt: "2025-01-20T09:10:00Z" },
  ];

  const recommendedForYou = [
    { id: 9, title: "Neural Networks Explained", type: "Video", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Neural+Nets", views: 990, uploadedAt: "2025-01-18T08:00:00Z" },
    { id: 10, title: "Probability for CS", type: "Textbook", author: "Bret Holladay", image: "https://via.placeholder.com/200x280?text=Probability", views: 720, uploadedAt: "2025-01-19T14:45:00Z" },
    { id: 11, title: "Database Systems Summary", type: "Notes", author: "Andrew Migler", image: "https://via.placeholder.com/200x280?text=Databases", views: 601, uploadedAt: "2025-01-16T10:00:00Z" },
  ];

  const todaysTopPicks = [
    { id: 12, title: "Intro to HCI", type: "Lecture Notes", author: "Ayaan Kazerouni", image: "https://via.placeholder.com/200x280?text=HCI", views: 510, uploadedAt: "2025-01-11T13:30:00Z" },
    { id: 13, title: "Ethics in AI", type: "Article", author: "Jane Lehr", image: "https://via.placeholder.com/200x280?text=AI+Ethics", views: 688, uploadedAt: "2025-01-12T16:10:00Z" },
    { id: 14, title: "Distributed Systems 101", type: "Slides", author: "Dev Sisodia", image: "https://via.placeholder.com/200x280?text=Distributed+Systems", views: 440, uploadedAt: "2025-01-14T08:40:00Z" },
  ];

  const recentlyUploaded = [
    { id: 20, title: "Last thing", type: "Notes", author: "Steven Arata", image: "https://via.placeholder.com/200x280?text=Last+Thing", views: 1320, uploadedAt: "2025-01-20T14:30:00Z" },
    { id: 19, title: "Probability for CS", type: "Textbook", author: "Bret Holladay", image: "https://via.placeholder.com/200x280?text=Probability", views: 720, uploadedAt: "2025-01-19T14:45:00Z" },
    { id: 18, title: "Neural Networks Explained", type: "Video", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Neural+Nets", views: 990, uploadedAt: "2025-01-18T08:00:00Z" },
    { id: 17, title: "Deep Learning Notes", type: "Notes", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Deep+Learning", views: 780, uploadedAt: "2025-01-17T11:30:00Z" },
    { id: 16, title: "Machine Learning Basics", type: "PDF", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=ML+Basics", views: 845, uploadedAt: "2025-01-15T13:00:00Z" },
    { id: 15, title: "Data Structures in C++", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=C++", views: 860, uploadedAt: "2025-01-14T09:20:00Z" },
    { id: 14, title: "Discrete Mathematics Essentials", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Discrete+Math", views: 975, uploadedAt: "2025-01-12T11:15:00Z" },
    { id: 13, title: "Operating Systems Overview", type: "Slides", author: "Zach Peterson", image: "https://via.placeholder.com/200x280?text=OS+Overview", views: 1104, uploadedAt: "2025-01-10T08:45:00Z" },
    { id: 12, title: "Linear Algebra Made Easy", type: "Notes", author: "Steven Arata", image: "https://via.placeholder.com/200x280?text=Linear+Algebra", views: 1320, uploadedAt: "2025-01-08T14:30:00Z" },
    { id: 11, title: "Introduction to Algorithms", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Algorithms", views: 1542, uploadedAt: "2025-01-05T10:00:00Z" }
  ];


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

        {/* Sections */}
        <Row title="Most Popular" items={mostPopular.slice(0, 10)} viewMoreTo="/popular" />
        <Row title="Continue Reading" items={continueReading.slice(0, 10)} viewMoreTo="/continue" />
        <Row title="Recommended for You" items={recommendedForYou.slice(0, 10)} viewMoreTo="/recommended" />
        <Row title="Today’s Top Picks" items={todaysTopPicks.slice(0, 10)} />
        <Row title="Recently Uploaded" items={recentlyUploaded.slice(0, 10)} viewMoreTo="/recentposted" />
      </main>
    </div>
  );
}

