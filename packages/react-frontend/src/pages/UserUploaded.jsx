// UserUploaded.jsx

import PDFListPage from "../components/PDFListPage";

export default function UserUploads() {
  const username = "Briggs";
  const currentUser = "Briggs";  
  const isOwner = currentUser === username;

  const subtitle = isOwner
    ? "Take a look at your uploaded posts!"
    : `Take a look at ${username}'s uploaded posts!`;

  const uploads = [
    { id: 6, title: "Machine Learning Basics", type: "PDF", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=ML+Basics", views: 845, uploadedAt: "2025-01-15T13:00:00Z" },
    { id: 7, title: "Deep Learning Notes", type: "Notes", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Deep+Learning", views: 780, uploadedAt: "2025-01-17T11:30:00Z" },
    { id: 9, title: "Neural Networks Explained", type: "Video", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Neural+Nets", views: 990, uploadedAt: "2025-01-18T08:00:00Z" },
    { id: 10, title: "Probability for CS", type: "Textbook", author: "Bret Holladay", image: "https://via.placeholder.com/200x280?text=Probability", views: 720, uploadedAt: "2025-01-19T14:45:00Z" },
  ];

  return (
    <PDFListPage
      pageTitle={`${username}'s Uploaded Posts`}
      pageSubtitle={subtitle}
      items={uploads}
    />
  );
}