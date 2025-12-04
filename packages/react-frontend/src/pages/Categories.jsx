import "./Categories.css";

export default function Categories() {
  const classes = ["COMS 101", "ENGL 145", "PHIL 230"];

  const mediaTypes = ["PDF", "MP3"];

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
        <p>Select a class or media type to explore related materials.</p>

        <div className="category-divider"></div>

        <section>
          <h2>Classes</h2>
          {renderCards(classes)}
        </section>

        <section>
          <h2>Media Types</h2>
          {renderCards(mediaTypes)}
        </section>
      </main>
    </div>
  );
}

