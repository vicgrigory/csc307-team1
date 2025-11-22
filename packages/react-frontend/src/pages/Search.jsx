import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState([]);

  // Unified search function with backend integration
  const fetchSearchResults = async (query, mediaTypes) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (mediaTypes && mediaTypes.length > 0) {
        params.append("mediaTypes", mediaTypes.join(","));
      }
      // note: subject and genre filters are stored in state but the backend file schema does not currently support them. 

      const response = await fetch(`http://localhost:8000/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Search failed");
      }
      const data = await response.json();

      // Map backend data to frontend display format
      const formattedResults = data.map((item) => ({
        id: item._id,
        title: item.title,
        author: item.creator || "Unknown",
        type: item.filetype === "pdf" ? "Book" : item.filetype === "mp3" ? "Music" : item.filetype,
        year: item.creationDate ? new Date(item.creationDate).getFullYear() : "N/A",
        description: item.description || "No description available.",
        subject: "General", // Placeholder until Schema update
        genre: "General"    // Placeholder until Schema update
      }));

      setSearchResults(formattedResults);
      setHasSearched(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
      fetchSearchResults(queryParam, []); //note, the empty array is just an assumption that url searches won't have any extra filters
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery }); 
    fetchSearchResults(searchQuery, selectedMediaTypes);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setSelectedSubjects([]);
    setSelectedGenres([]);
    setSelectedMediaTypes([]);
    setSearchParams({});
  };

  const toggleFilter = (filterArray, setFilterArray, value) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter(item => item !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const styles = {
    pageLayout: {
      display: "flex",
      gap: "2rem",
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "2rem"
    },
    sidebar: {
      width: "250px",
      flexShrink: 0
    },
    filterSection: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "1.5rem",
      marginBottom: "1rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    },
    filterTitle: {
      fontSize: "1.1rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "#2d3748",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer"
    },
    checkboxList: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem"
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      fontSize: "0.95rem",
      color: "#4a5568"
    },
    checkbox: {
      marginRight: "0.75rem",
      width: "16px",
      height: "16px",
      cursor: "pointer"
    },
    mainContent: {
      flex: 1,
      minWidth: 0
    },
    header: {
      marginBottom: "2rem"
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "0.5rem",
      color: "#1a202c"
    },
    subtitle: {
      color: "#718096",
      fontSize: "1.1rem"
    },
    searchSection: {
      backgroundColor: "white",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      marginBottom: "2rem"
    },
    searchWrapper: {
      display: "flex",
      gap: "1rem",
      marginBottom: "1rem",
      flexWrap: "wrap"
    },
    searchInput: {
      flex: 1,
      minWidth: "300px",
      padding: "0.875rem 1rem",
      fontSize: "1rem",
      border: "2px solid #e2e8f0",
      borderRadius: "6px",
      outline: "none"
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem"
    },
    searchButton: {
      padding: "0.875rem 2rem",
      backgroundColor: "#4299e1",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s"
    },
    clearButton: {
      padding: "0.875rem 2rem",
      backgroundColor: "#e2e8f0",
      color: "#4a5568",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s"
    },
    resultsHeader: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "1.5rem",
      color: "#2d3748"
    },
    resultsList: {
      display: "grid",
      gap: "1rem"
    },
    resultCard: {
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "1.5rem",
      transition: "all 0.2s",
      cursor: "pointer"
    },
    resultHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "start",
      marginBottom: "0.75rem"
    },
    resultTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#2d3748",
      marginBottom: "0.25rem"
    },
    resultAuthor: {
      color: "#718096",
      fontSize: "0.95rem"
    },
    resultType: {
      padding: "0.25rem 0.75rem",
      borderRadius: "4px",
      fontSize: "0.875rem",
      fontWeight: "500",
      backgroundColor: "#edf2f7",
      color: "#4a5568"
    },
    resultDescription: {
      color: "#4a5568",
      lineHeight: "1.6",
      marginBottom: "0.75rem"
    },
    resultFooter: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: "0.75rem",
      borderTop: "1px solid #e2e8f0"
    },
    resultYear: {
      color: "#718096",
      fontSize: "0.9rem"
    },
    viewButton: {
      padding: "0.5rem 1rem",
      backgroundColor: "#4299e1",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "0.9rem",
      fontWeight: "500",
      cursor: "pointer"
    },
    noResults: {
      textAlign: "center",
      padding: "3rem",
      backgroundColor: "white",
      borderRadius: "8px",
      border: "1px solid #e2e8f0"
    },
    noResultsText: {
      fontSize: "1.1rem",
      color: "#718096"
    }
  };

  return (
    <div className="page-container">
      <div style={styles.pageLayout}>
        {/* Filters Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.filterSection}>
            <div style={styles.filterTitle}>
              Subject <span>^</span>
            </div>
            <div style={styles.checkboxList}>
              {["Art", "Biology", "Business", "Chemistry", "Computer Science", "Economics", "Engineering", "English", "Finance", "Geography", "History", "Mathematics", "Music", "Physics", "Political Science", "Psychology"].map(subject => (
                <label key={subject} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => toggleFilter(selectedSubjects, setSelectedSubjects, subject)}
                    style={styles.checkbox}
                  />
                  {subject}
                </label>
              ))}
            </div>
          </div>

          <div style={styles.filterSection}>
            <div style={styles.filterTitle}>
              Genre <span>v</span>
            </div>
            <div style={styles.checkboxList}>
              {["Romance", "Rock", "Sci-Fi", "Historical", "Classical", "Horror", "Educational", "Drama", "Comedy", "Documentary"].map(genre => (
                <label key={genre} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() => toggleFilter(selectedGenres, setSelectedGenres, genre)}
                    style={styles.checkbox}
                  />
                  {genre}
                </label>
              ))}
            </div>
          </div>

          <div style={styles.filterSection}>
            <div style={styles.filterTitle}>
              Media Type <span>^</span>
            </div>
            <div style={styles.checkboxList}>
              {["Book", "Music", "Film"].map(type => (
                <label key={type} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedMediaTypes.includes(type)}
                    onChange={() => toggleFilter(selectedMediaTypes, setSelectedMediaTypes, type)}
                    style={styles.checkbox}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={styles.mainContent}>
          <div style={styles.header}>
            <h1 style={styles.title}>Search Library</h1>
            <p style={styles.subtitle}>
              Discover copyright-free books, music, and films
            </p>
          </div>

          {/* Search Section */}
          <div style={styles.searchSection}>
            <form onSubmit={handleSearch}>
              <div style={styles.searchWrapper}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or author..."
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  style={styles.searchButton}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3182ce"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4299e1"}
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  style={styles.clearButton}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#cbd5e0"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e2e8f0"}
                >
                  Clear Filters
                </button>
              </div>
            </form>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div>
              <h2 style={styles.resultsHeader}>
                {searchResults.length > 0
                  ? `${searchResults.length} Result${searchResults.length !== 1 ? "s" : ""} Found`
                  : "No Results Found"}
              </h2>

              {searchResults.length > 0 ? (
                <div style={styles.resultsList}>
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      style={styles.resultCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                        e.currentTarget.style.borderColor = "#cbd5e0";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                      }}
                    >
                      <div style={styles.resultHeader}>
                        <div>
                          <div style={styles.resultTitle}>{result.title}</div>
                          <div style={styles.resultAuthor}>by {result.author}</div>
                        </div>
                        <span style={styles.resultType}>{result.type}</span>
                      </div>

                      <p style={styles.resultDescription}>{result.description}</p>

                      <div style={styles.resultFooter}>
                        <span style={styles.resultYear}>Published: {result.year}</span>
                        <button
                          style={styles.viewButton}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3182ce"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4299e1"}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.noResults}>
                  <p style={styles.noResultsText}>
                    No items found matching your search. Try different keywords or adjust your filters.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}