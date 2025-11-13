import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
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

  const styles = {
    nav: {
      backgroundColor: "#2d3748",
      padding: "1rem 2rem",
      display: "flex",
      alignItems: "center",
      gap: "2rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    logo: {
      color: "white",
      fontSize: "1.5rem",
      fontWeight: "700",
      textDecoration: "none",
      marginRight: "2rem"
    },
    links: {
      display: "flex",
      gap: "1.5rem",
      flex: 1
    },
    link: {
      color: "#e2e8f0",
      textDecoration: "none",
      fontSize: "1rem",
      fontWeight: "500",
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      transition: "all 0.2s"
    },
    searchForm: {
      display: "flex"
    },
    searchInput: {
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      border: "none",
      outline: "none",
      fontSize: "0.95rem",
      width: "200px",
      color: "#2d3748",
      backgroundColor: "white"
    },
    helpIcon: {
      color: "white",
      fontSize: "1.25rem",
      cursor: "pointer",
      marginLeft: "1rem"
    }
  };

  return (
    <nav style={styles.nav}>
      <Link
        to="/"
        style={styles.logo}
        onMouseEnter={(e) => e.currentTarget.style.color = "#4299e1"}
        onMouseLeave={(e) => e.currentTarget.style.color = "white"}
      >
        OpenShelf
      </Link>

      <div style={styles.links}>
        <Link
          to="/"
          style={styles.link}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4a5568"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Home
        </Link>
        <Link
          to="/about"
          style={styles.link}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4a5568"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          About
        </Link>
        <Link
          to="/search"
          style={styles.link}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4a5568"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Search
        </Link>
        <Link
          to="/profile"
          style={styles.link}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4a5568"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Profile
        </Link>
        <Link
          to="/account"
          style={styles.link}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#4a5568"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          Settings
        </Link>
      </div>

      <form onSubmit={handleNavSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search..."
          value={navSearchQuery}
          onChange={(e) => setNavSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </form>

      <span style={styles.helpIcon}>?</span>
    </nav>
  );
}

