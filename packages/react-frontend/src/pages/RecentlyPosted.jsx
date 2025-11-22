import { Link } from "react-router-dom";

export default function RecentlyPosted({ items = [] }) {
  return (
    <div className="page-container">
      <main className="page-content">
        <div className="recent-layout">
          <section>
            <h1>Recently Posted</h1>
            <p>
              These are the newest books, papers, notes, and study materials added 
              to OpenShelf. Check out the latest contributions from students and 
              researchers across the platform.
            </p>
          </section>
          <div className="recent-grid">
            {items.map((item, index) => (
              <div className="recent-card" key={index}>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="recent-image"
                  />
                )}
                <div className="recent-info">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.link && (
                    <Link className="recent-link" to={item.link}>
                      View More →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

