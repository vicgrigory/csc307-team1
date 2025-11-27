import PDFListPage from "../components/PDFListPage";

export default function Recommend() {
  const recommendedItems = [
    {
      id: 201,
      title: "Neural Networks Explained",
      type: "Video",
      author: "Paul Anderson",
      image: "https://via.placeholder.com/200x280?text=Data+Structures",
      views: 1320,
      uploadedAt: "2025-01-10T10:00:00Z"
    },
    {
      id: 202,
      title: "Probability for CS",
      type: "Textbook",
      author: "Bret Holladay",
      image: "https://via.placeholder.com/200x280?text=Algebra",
      views: 980,
      uploadedAt: "2025-01-12T10:00:00Z"
    },
    {
      id: 203,
      title: "Database Systems Summary",
      type: "Slides",
      author: "Andrew Migler",
      image: "https://via.placeholder.com/200x280?text=Quantum",
      views: 1450,
      uploadedAt: "2025-01-14T10:00:00Z"
    }
  ];

  return (
    <PDFListPage
      pageTitle="Recommended For You"
      pageSubtitle="Personalized picks based on your reading history and interests."
      items={recommendedItems}
    />
  );
}

