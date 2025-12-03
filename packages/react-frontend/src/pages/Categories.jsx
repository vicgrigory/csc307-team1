// Categories.jsx

import "./Categories.css";

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

  const getImage = (name) => 
    `https://via.placeholder.com/200x250?text=${encodeURIComponent(name)}`;

  const renderCards = (items) => (
    <div className="category-card-grid">
      {items.map((item) => (
        <div key={item} className="category-card-wrapper">
          <div className="category-card">
            <img src={getImage(item)} alt={item} />
            <h3>{item}</h3>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="page-container categories-page">
      <main className="page-content">
        <h1>Categories</h1>
        <p>Select a category to explore related materials.</p>

        <div className="category-divider"></div>

        <section>
          <h2>Subjects</h2>
          {renderCards(subjects)}
        </section>

        <section>
          <h2>Genres</h2>
          {renderCards(genres)}
        </section>

        <section>
          <h2>Media Types</h2>
          {renderCards(mediaTypes)}
        </section>
      </main>
    </div>
  );
}
