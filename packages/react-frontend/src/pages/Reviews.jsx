// Reviews.jsx

import "./Reviews.css"

// Helper function to handle upload dates
function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function Reviews() {
  const username = "Briggs";       
  const currentUser = "Briggs";    
  const isOwner = currentUser === username;

  const subtitle = isOwner
    ? "See all of the reviews you've left on OpenShelf."
    : `See all of ${username}'s reviews on OpenShelf.`;

    const reviews = [
        { id: 1, title: "Graph Theory Homework", author: "Damon Lin", type: "PDF", review: "Loved this piece — beautifully restored!", rating: 5, image: "https://via.placeholder.com/200x280?text=Graph+Theory", reviewedDate: "2025-01-20T10:15:00Z" },
        { id: 2, title: "Deep Learning Notes", author: "Paul Anderson", type: "Notes", review: "Interesting remix concept.", rating: 4, image: "https://via.placeholder.com/200x280?text=Deep+Learning", reviewedDate: "2025-01-19T18:40:00Z" },
        { id: 3, title: "CS1 Study Guide", author: "Ayaan Kazerouni", type: "Notes", review: "Could use better audio quality, but great find.", rating: 3, image: "https://via.placeholder.com/200x280?text=CS1", reviewedDate: "2025-01-18T14:05:00Z" },
    ];

  return (
    <div className="page-container reviews-page">
      <main className="page-content">
        <h1>{username}'s Reviews</h1>
        <p className="reviews-subtitle">{subtitle}</p>
        <div className="category-divider" /> 

        <div className="profile-media-card-wrapper">
          {reviews.map((item) => (
            <div key={item.id} className="profile-media-card">
              <h3>
                {item.title} • {item.type} • {item.author}
              </h3>
              <p className="review-date">Posted on {formatDate(item.reviewedDate)}</p>
              <p className="review-text">“{item.review}”</p>
              <p className="review-rating">Rating: {item.rating} / 5 ⭐</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}