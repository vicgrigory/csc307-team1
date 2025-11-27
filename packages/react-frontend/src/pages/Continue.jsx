import PDFListPage from "../components/PDFListPage";

export default function Continue() {
  const continueReadingItems = [
    {
      id: 101,
      title: "Machine Learning Basics",
      type: "PDF",
      author: "Paul Anderson",
      image: "https://via.placeholder.com/200x280?text=Algorithms",
      views: 1203,
      progress: "Page 240 of 1312"
    },
    {
      id: 102,
      title: "Deep Learning Notes",
      type: "Notes",
      author: "Paul Anderson",
      image: "https://via.placeholder.com/200x280?text=C++",
      views: 842,
      progress: "Page 4 of 62"
    },
    {
      id: 103,
      title: "Research Methods Primer",
      type: "Textbook",
      author: "Jean Davidson",
      image: "https://via.placeholder.com/200x280?text=Linear+Algebra",
      views: 960,
      progress: "Page 12 of 242"
    }
  ];

  return (
    <PDFListPage
      pageTitle="Continue Reading"
      pageSubtitle="Pick up where you left off on your saved textbooks, PDFs, and notes."
      items={continueReadingItems}
    />
  );
}

