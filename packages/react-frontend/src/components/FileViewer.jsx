import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import screenfull from "screenfull";
import "./FileViewer.css";

// Use local worker file from public folder (no CDN/CORS issues)
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function FileViewer({ fileUrl, fileType, fileName }) {
  const [numPages, setNumPages] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1.0);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (screenfull.isEnabled) {
      const handleChange = () => {
        setIsFullscreen(screenfull.isFullscreen);
      };
      screenfull.on("change", handleChange);
      return () => screenfull.off("change", handleChange);
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const toggleFullscreen = () => {
    if (screenfull.isEnabled && viewerRef.current) {
      screenfull.toggle(viewerRef.current);
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "download";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileTypeCategory = () => {
    const type = fileType?.toLowerCase() || "";
    if (type === "pdf" || fileUrl?.toLowerCase().endsWith(".pdf")) return "pdf";
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(type) ||
        /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(fileUrl)) return "image";
    if (["mp4", "webm", "ogg"].includes(type) ||
        /\.(mp4|webm|ogg)$/i.test(fileUrl)) return "video";
    if (["mp3", "wav", "ogg"].includes(type) ||
        /\.(mp3|wav|ogg)$/i.test(fileUrl)) return "audio";
    return "other";
  };

  const renderContent = () => {
    const category = getFileTypeCategory();

    switch (category) {
      case "pdf":
        return (
          <div className="pdf-viewer-container">
            <div className="pdf-controls">
              <div className="zoom-controls">
                <button onClick={zoomOut} disabled={scale <= 0.5}>-</button>
                <button onClick={resetZoom}>{Math.round(scale * 100)}%</button>
                <button onClick={zoomIn} disabled={scale >= 2.0}>+</button>
              </div>
              {numPages && (
                <span className="page-info">
                  {numPages} {numPages === 1 ? 'page' : 'pages'}
                </span>
              )}
            </div>
            <div className="pdf-document-wrapper">
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="loading">Loading PDF...</div>}
                error={<div className="error">Failed to load PDF. <a href={fileUrl} target="_blank" rel="noopener noreferrer">Open file in new tab</a></div>}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="pdf-page"
                  />
                ))}
              </Document>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="image-viewer-container">
            <div className="image-controls">
              <div className="zoom-controls">
                <button onClick={zoomOut} disabled={scale <= 0.5}>-</button>
                <button onClick={resetZoom}>{Math.round(scale * 100)}%</button>
                <button onClick={zoomIn} disabled={scale >= 2.0}>+</button>
              </div>
            </div>
            <div className="image-wrapper" style={{ transform: `scale(${scale})` }}>
              <img src={fileUrl} alt={fileName || "File"} />
            </div>
          </div>
        );

      case "video":
        return (
          <div className="video-viewer-container">
            <video controls>
              <source src={fileUrl} type={`video/${fileType || "mp4"}`} />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case "audio":
        return (
          <div className="audio-viewer-container">
            <audio controls>
              <source src={fileUrl} type={`audio/${fileType || "mp3"}`} />
              Your browser does not support the audio tag.
            </audio>
            <p className="file-name">{fileName}</p>
          </div>
        );

      default:
        return (
          <div className="unsupported-viewer-container">
            <div className="unsupported-message">
              <p>Preview not available for this file type.</p>
              <button onClick={downloadFile} className="download-btn-large">
                Download File
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      ref={viewerRef}
      className={`file-viewer ${isFullscreen ? "fullscreen" : ""}`}
    >
      <div className="viewer-header">
        <h3 className="file-name">{fileName || "Viewing File"}</h3>
        <div className="viewer-actions">
          <button onClick={downloadFile} className="action-btn" title="Download">
            ⬇ Download
          </button>
          {screenfull.isEnabled && (
            <button onClick={toggleFullscreen} className="action-btn" title="Fullscreen">
              {isFullscreen ? "⊗ Exit Fullscreen" : "⛶ Fullscreen"}
            </button>
          )}
        </div>
      </div>
      <div className="viewer-content">
        {renderContent()}
      </div>
    </div>
  );
}
