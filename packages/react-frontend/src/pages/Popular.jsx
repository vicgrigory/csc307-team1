import { Link } from "react-router-dom";

export default function Popular({ items = [] }) {
  return (
    <div className="page-container">
      <main className="page-content">
        <div className="popular-layout">
          <section>
            <h1>Most Popular Media</h1>
            <p>
              Here are the most viewed, saved, and interacted-with pieces of media 
              on OpenShelf. These resources reflect what students and researchers 
              are finding most helpful across the platform.
            </p>
          </section>
          <div className="popular-grid">
            {items.map((item, index) => (
              <div className="popular-card" key={index}>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="popular-image"
                  />
                )}
                <div className="popular-info">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.link && (
                    <Link className="popular-link" to={item.link}>
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

