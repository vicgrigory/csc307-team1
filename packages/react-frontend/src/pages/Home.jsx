import { useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const todaysPick = {
    image: "https://via.placeholder.com/200x300", // placeholder image
    title: "Pride and Prejudice",
    author: "Jane Austen",
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm, "Filter:", filter);
    // Later: fetch(`http://localhost:8000/search?query=${searchTerm}&filter=${filter}`)
  };

  return (
    <div className="page-container">
      <h1>Welcome to OpenShelf</h1>
      <p>This is the home page of your digital library.</p>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search books, music, or media..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {/* Filter Dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-filter"
        >
          <option value="all">All Media</option>
          <option value="books">Books</option>
          <option value="music">Music</option>
          <option value="videos">Videos</option>
          <option value="images">Images</option>
        </select>

        <button type="submit" className="search-button">Search</button>
      </form>

      {/* Today's Pick Section */}
      <section>
        <h2>Today's Pick</h2>
        <div className="todays-pick">
          <img
            src={todaysPick.image}
            alt={todaysPick.title}
            className="todays-pick-image"
          />
          <p className="todays-pick-title">{todaysPick.title}</p>
          <p className="todays-pick-author">{todaysPick.author}</p>
        </div>
      </section>
    </div>
  );
}

