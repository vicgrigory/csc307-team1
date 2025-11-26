import PDFListPage from "../components/PDFListPage";

export default function RecentlyPosted() {
  const recentlyPosted = [
    { id: 10, title: "Probability for CS", type: "Textbook", author: "Bret Holladay", image: "https://via.placeholder.com/200x280?text=Probability", views: 720, uploadedAt: "2025-01-19T14:45:00Z", description: "Recently added textbook on probability." },
    { id: 9, title: "Neural Networks Explained", type: "Video", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Neural+Nets", views: 990, uploadedAt: "2025-01-18T08:00:00Z", description: "A beginner-friendly explanation of neural networks." },
    { id: 7, title: "Deep Learning Notes", type: "Notes", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Deep+Learning", views: 780, uploadedAt: "2025-01-17T11:30:00Z", description: "Comprehensive notes on deep learning topics." },
    { id: 6, title: "Machine Learning Basics", type: "PDF", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=ML+Basics", views: 845, uploadedAt: "2025-01-15T13:00:00Z", description: "Introductory material for machine learning." },
    { id: 5, title: "Data Structures in C++", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=C++", views: 860, uploadedAt: "2025-01-14T09:20:00Z", description: "C++ data structures explained with examples." },
    { id: 4, title: "Discrete Mathematics Essentials", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Discrete+Math", views: 975, uploadedAt: "2025-01-12T11:15:00Z", description: "Core concepts in discrete mathematics." },
    { id: 3, title: "Operating Systems Overview", type: "Slides", author: "Zach Peterson", image: "https://via.placeholder.com/200x280?text=OS+Overview", views: 1104, uploadedAt: "2025-01-10T08:45:00Z", description: "Slides covering fundamental OS concepts." },
    { id: 2, title: "Linear Algebra Made Easy", type: "Notes", author: "Steven Arata", image: "https://via.placeholder.com/200x280?text=Linear+Algebra", views: 1320, uploadedAt: "2025-01-08T14:30:00Z", description: "Simplified linear algebra notes for quick learning." },
    { id: 1, title: "Introduction to Algorithms", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Algorithms", views: 1542, uploadedAt: "2025-01-05T10:00:00Z", description: "Classic textbook introducing algorithms." },
  ];

  return (
    <PDFListPage
      pageTitle="Recently Posted"
      pageSubtitle="These are the newest books, papers, notes, and study materials added to OpenShelf. Check out the latest contributions from students and researchers across the platform."
      items={recentlyPosted}
    />
  );
}

