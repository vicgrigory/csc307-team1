export default function Categories() {
  const subjects = [
    "Art", "Biology", "Business", "Chemistry", "Computer Science",
    "Economics", "Engineering", "English", "Finance", "Geography",
    "History", "Mathematics", "Music", "Physics", "Political Science",
    "Psychology"
  ];

  const genres = [
    "Romance", "Rock", "Sci-Fi", "Historical", "Classical",
    "Horror", "Educational", "Drama", "Comedy", "Documentary"
  ];

  const mediaTypes = ["Book", "Music", "Film"];

  return (
    <div className="page-container categories-page">
      <main className="page-content">
        <h1>Categories</h1>
        <p>Select a category below to browse resources by topic, style, or format.</p>

        <section>
          <h2>Subjects</h2>
          <ul className="category-list">
            {subjects.map((subject) => (
              <li key={subject} className="category-item">
                {subject}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Genres</h2>
          <ul className="category-list">
            {genres.map((genre) => (
              <li key={genre} className="category-item">
                {genre}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Media Types</h2>
          <ul className="category-list">
            {mediaTypes.map((type) => (
              <li key={type} className="category-item">
                {type}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

