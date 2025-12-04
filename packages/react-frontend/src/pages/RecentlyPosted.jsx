
import { useState, useEffect } from "react";
import PDFListPage from "../components/PDFListPage";

export default function RecentlyPosted() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("${import.meta.env.VITE_API_URL}/search");
        if (response.ok) {
          const data = await response.json();

          const transformedFiles = data
            .map((file) => ({
              id: file._id,
              title: file.title,
              type: file.filetype === "pdf" ? "PDF" : file.filetype.toUpperCase(),
              author: file.creator || "Unknown",
              image: `${import.meta.env.VITE_API_URL}/files/${file._id}/thumbnail`,
              uploadedAt: file.upload,
              tags: file.tags || [],
            }))
            .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
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
        pageTitle="Recently Posted"
        pageSubtitle="Recently posted instructional materials/learning resources by other students."
        items={files}
    />
  );
}  