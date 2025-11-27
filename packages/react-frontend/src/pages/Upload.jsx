import { useState } from "react";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("Book");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !file) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log({ title, author, type, description, file });
    alert("Media uploaded successfully! (mock)");

    setTitle("");
    setAuthor("");
    setType("Book");
    setDescription("");
    setFile(null);
  };

  return (
    <div className="page-container upload-page">
      <h1>Upload Media</h1>
      <form className="upload-form" onSubmit={handleSubmit}>
        <label>
          Title *
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Author *
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </label>

        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Book">Book</option>
            <option value="Notes">Notes</option>
            <option value="PDF">PDF</option>
            <option value="Video">Video</option>
            <option value="Slides">Slides</option>
            <option value="Paper">Paper</option>
          </select>
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </label>

        <label>
          File *
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </label>

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

