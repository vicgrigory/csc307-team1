
import { useState, useEffect } from "react";
import PDFListPage from "../components/PDFListPage";

export default function MostPopular() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:8000/search");
        if (response.ok) {
          const data = await response.json();

          const transformedFiles = data.map((file) => ({
            id: file._id,
            title: file.title,
            type: file.filetype === "pdf" ? "PDF" : file.filetype.toUpperCase(),
            author: file.creator || "Unknown",
            image: `http://localhost:8000/files/${file._id}/thumbnail`,
            uploadedAt: file.upload,
            tags: file.tags || [],
          }));
          setFiles(transformedFiles);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
  }

  return (
    <PDFListPage
        pageTitle="Most Popular"
        pageSubtitle="These are the instructional materials/learning resources that students have been viewing the most."
        items={files}
    />
  );
}  