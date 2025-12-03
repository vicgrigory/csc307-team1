import "./Profile.css";
import PDFListPage from "../components/PDFListPage";

// Example data
const favoriteItems = [
  { id: 1, title: "Algorithms", type: "Book", author: "C. Siu", image: "https://via.placeholder.com/200x280?text=Algorithms" },
  { id: 2, title: "Linear Algebra", type: "Notes", author: "S. Arata", image: "https://via.placeholder.com/200x280?text=Linear+Algebra" },
  { id: 3, title: "Operating Systems", type: "Slides", author: "Z. Peterson", image: "https://via.placeholder.com/200x280?text=OS+Overview" },
  { id: 4, title: "Discrete Math", type: "Book", author: "C. Siu", image: "https://via.placeholder.com/200x280?text=Discrete+Math" },
];

const uploadedItems = [
  { id: 5, title: "Machine Learning Basics", type: "Other", author: "P. Anderson", image: "https://via.placeholder.com/200x280?text=ML+Basics" },
  { id: 6, title: "Neural Networks Explained", type: "Video", author: "P. Anderson", image: "https://via.placeholder.com/200x280?text=Neural+Nets" },
  { id: 7, title: "Probability for CS", type: "Book", author: "B. Holladay", image: "https://via.placeholder.com/200x280?text=Probability" },
  { id: 8, title: "Database Systems Summary", type: "Notes", author: "A. Migler", image: "https://via.placeholder.com/200x280?text=Databases" },
];

const reviewsItems = [
  { id: 9, title: "Intro to HCI", type: "Notes", author: "A. Kazerouni", image: "https://via.placeholder.com/200x280?text=HCI" },
  { id: 10, title: "Ethics in AI", type: "Paper", author: "J. Lehr", image: "https://via.placeholder.com/200x280?text=AI+Ethics" },
  { id: 11, title: "Distributed Systems 101", type: "Slides", author: "D. Sisodia", image: "https://via.placeholder.com/200x280?text=Distributed+Systems" },
  { id: 12, title: "Graph Theory Homework", type: "Other", author: "D. Lin", image: "https://via.placeholder.com/200x280?text=Graph+Theory" },
];

export default function Profile() {
  return (
    <div className="profile-page">
      {/* Top Section */}
      <div className="profile-top">
        <div className="profile-overview">
          <h1>Briggs Murphy</h1>
          <p>Email: briggs@example.com</p>
          <p>Member since: Jan 2025</p>
          <p>Bio: Student, coder, library enthusiast.</p>
        </div>
        <div className="profile-picture">
          <img src="https://via.placeholder.com/150" alt="Profile" />
        </div>
      </div>

      {/* Sections */}
      <div className="profile-sections">
        <div className="profile-column">
          <h2>Favorites</h2>
          <PDFListPage items={favoriteItems} hideHeader={true} />
        </div>
        <div className="profile-column">
          <h2>Uploaded</h2>
          <PDFListPage items={uploadedItems} hideHeader={true} />
        </div>
        <div className="profile-column">
          <h2>Reviews</h2>
          <PDFListPage items={reviewsItems} hideHeader={true} />
        </div>
      </div>
    </div>
  );
}

