// MostPopular.jsx

import PDFListPage from "../components/PDFListPage";

export default function MostPopular() {
  const mostPopular = [
    { id: 1, title: "Introduction to Algorithms", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Algorithms", views: 1542, uploadedAt: "2025-01-05T10:00:00Z" },
    { id: 2, title: "Linear Algebra Made Easy", type: "Notes", author: "Steven Arata", image: "https://via.placeholder.com/200x280?text=Linear+Algebra", views: 1320, uploadedAt: "2025-01-08T14:30:00Z" },
    { id: 3, title: "Operating Systems Overview", type: "Slides", author: "Zach Peterson", image: "https://via.placeholder.com/200x280?text=OS+Overview", views: 1104, uploadedAt: "2025-01-10T08:45:00Z" },
    { id: 4, title: "Discrete Mathematics Essentials", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Discrete+Math", views: 975, uploadedAt: "2025-01-12T11:15:00Z" },
    { id: 5, title: "Data Structures in C++", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=C++", views: 860, uploadedAt: "2025-01-14T09:20:00Z" },
    { id: 6, title: "Machine Learning Basics", type: "PDF", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=ML+Basics", views: 845, uploadedAt: "2025-01-15T13:00:00Z" },
    { id: 7, title: "Deep Learning Notes", type: "Notes", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Deep+Learning", views: 780, uploadedAt: "2025-01-17T11:30:00Z" },
    { id: 9, title: "Neural Networks Explained", type: "Video", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Neural+Nets", views: 990, uploadedAt: "2025-01-18T08:00:00Z" },
    { id: 10, title: "Probability for CS", type: "Textbook", author: "Bret Holladay", image: "https://via.placeholder.com/200x280?text=Probability", views: 720, uploadedAt: "2025-01-19T14:45:00Z" },
  ];

  return (
    <PDFListPage
        pageTitle="Most Popular"
        pageSubtitle="These are the instructional materials/learning resources that students have been viewing the most."
        items={mostPopular}
    />
  );
}  