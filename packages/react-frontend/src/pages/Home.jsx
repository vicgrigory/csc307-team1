import "./Home.css";
import { useRef } from "react";
import { Link } from "react-router-dom";

// Type-based colors
const typeColors = {
  "Book": "#d2573e",
  "Notes": "#ed8d37",
  "Audio": "#529184",
  "Video": "#a54337",
  "Slides": "#426375",
  "Paper": "#498366",
  "Other": "#ea8235",
};

// Fallback colors
const fallbackColors = ["#f5deb3", "#c4edf2", "#603b20", "#faecd7"];

// Helper for readable text
function getContrastingTextColor(bgColor) {
  const color = bgColor.replace("#", "");
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 140 ? "#ffffff" : "#000000";
}

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
          {items.map((item) => {
            const backgroundColor =
              typeColors[item.type] ||
              fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
            const textColor = getContrastingTextColor(backgroundColor);

            return (
              <div
                className="home-card"
                key={item.id}
                style={{ backgroundColor, color: textColor }}
              >
                <div className="home-card-thumb">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="home-card-text">
                  <p className="home-card-title">{item.title}</p>
                  <p className="home-card-meta">
                    {item.type} • {item.author}
                  </p>
                </div>
              </div>
            );
          })}
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
  const mostPopular = [
    { id: 1, title: "Introduction to Algorithms", type: "Book", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Algorithms" },
    { id: 2, title: "Linear Algebra Made Easy", type: "Notes", author: "Steven Arata", image: "https://via.placeholder.com/200x280?text=Linear+Algebra" },
    { id: 3, title: "Operating Systems Overview", type: "Slides", author: "Zach Peterson", image: "https://via.placeholder.com/200x280?text=OS+Overview" },
    { id: 4, title: "Discrete Mathematics Essentials", type: "Book", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Discrete+Math" },
    { id: 5, title: "Data Structures in C++", type: "Book", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=C++" },
  ];

  const continueReading = [
    { id: 6, title: "Machine Learning Basics", type: "Other", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=ML+Basics" },
    { id: 7, title: "Deep Learning Notes", type: "Notes", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Deep+Learning" },
    { id: 8, title: "Research Methods Primer", type: "Paper", author: "Jean Davidson", image: "https://via.placeholder.com/200x280?text=Research+Methods" },
  ];

  const recommendedForYou = [
    { id: 9, title: "Neural Networks Explained", type: "Video", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Neural+Nets" },
    { id: 10, title: "Probability for CS", type: "Book", author: "Bret Holladay", image: "https://via.placeholder.com/200x280?text=Probability" },
    { id: 11, title: "Database Systems Summary", type: "Notes", author: "Andrew Migler", image: "https://via.placeholder.com/200x280?text=Databases" },
  ];

  const todaysTopPicks = [
    { id: 12, title: "Intro to HCI", type: "Notes", author: "Ayaan Kazerouni", image: "https://via.placeholder.com/200x280?text=HCI" },
    { id: 13, title: "Ethics in AI", type: "Paper", author: "Jane Lehr", image: "https://via.placeholder.com/200x280?text=AI+Ethics" },
    { id: 14, title: "Distributed Systems 101", type: "Slides", author: "Dev Sisodia", image: "https://via.placeholder.com/200x280?text=Distributed+Systems" },
  ];

  const recentlyUploaded = [
    { id: 15, title: "Graph Theory Homework", type: "Other", author: "Damon Lin", image: "https://via.placeholder.com/200x280?text=Graph+Theory" },
    { id: 16, title: "CS1 Study Guide", type: "Notes", author: "Ayaan Kazerouni", image: "https://via.placeholder.com/200x280?text=CS1" },
    { id: 17, title: "Signals & Systems Cheatsheet", type: "Other", author: "Gavin Reakseaker", image: "https://via.placeholder.com/200x280?text=Signals" },
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

        <Row title="Most Popular" items={mostPopular} viewMoreTo="/popular"/>
        <Row title="Continue Reading" items={continueReading} viewMoreTo="/continue"/>
        <Row title="Recommended for You" items={recommendedForYou} viewMoreTo="/recommended"/>
        <Row title="Today’s Top Picks" items={todaysTopPicks} />
        <Row title="Recently Uploaded" items={recentlyUploaded} viewMoreTo="/recentposted" />
      </main>
    </div>
  );
}

