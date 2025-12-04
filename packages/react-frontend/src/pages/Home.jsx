
import "./Home.css";

import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
            <Link to={`/file/${item.id}`} key={item.id} className="home-card-link">
              <div className="home-card">
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
            </Link>
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
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:8000/search");
        if (response.ok) {
          const files = await response.json();

          const transformedFiles = files.map((file) => ({
            id: file._id,
            title: file.title,
            type: file.filetype === "pdf" ? "PDF" : file.filetype.toUpperCase(),
            author: file.creator || "Unknown",
            image: `http://localhost:8000/files/${file._id}/thumbnail`,
            uploadedAt: file.upload,
            tags: file.tags || [],
          }));

          setAllFiles(transformedFiles);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  console.log("Current allFiles state:", allFiles.length);

  if (loading) {
    return (
      <div className="page-container">
        <main className="home-page-content">
          <div style={{ textAlign: "center", padding: "50px" }}>
            Loading textbooks...
          </div>
        </main>
      </div>
    );
  }

  const recentlyUploaded = [...allFiles]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 10);

  const mostPopular = [...allFiles].slice(0, 10);
  const continueReading = [...allFiles].slice(0, 3);
  const recommendedForYou = [...allFiles].slice(3, 6);
  const todaysTopPicks = [...allFiles].slice(6, 9);

  return (
    <div className="page-container">
      <main className="home-page-content">
        {}
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

        {}
        <Row title="Most Popular" items={mostPopular.slice(0, 10)} viewMoreTo="/popular" />
        <Row title="Continue Reading" items={continueReading.slice(0, 10)} viewMoreTo="/continue" />
        <Row title="Recommended for You" items={recommendedForYou.slice(0, 10)} viewMoreTo="/recommended" />
        <Row title="Today’s Top Picks" items={todaysTopPicks.slice(0, 10)} />
        <Row title="Recently Uploaded" items={recentlyUploaded.slice(0, 10)} viewMoreTo="/recentposted" />
      </main>
    </div>
  );
}

