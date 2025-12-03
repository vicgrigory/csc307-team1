// PDFListPage.jsx

import "./PDFListPage.css";
import { useRef } from "react";

// Helper function to handle upload dates
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// Helper function to pick readable text color
function getContrastingTextColor(bgColor) {
    const color = bgColor.replace("#", "");
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 140 ? "#ffffff" : "#000000";
}

const typeColors = {
    "Book": "#d2573e",
    "Notes": "#ed8d37",
    "Audio": "#529184",
    "Video": "#a54337",
    "Slides": "#426375",
    "Paper": "#498366",
    "Other": "#ea8235",
};

const fallbackColors = ["#f5deb3", "#c4edf2", "#603b20", "#faecd7"];

// Scrollable Row Component
function PDFRow({ title, items }) {
    const rowRef = useRef(null);

    const scroll = (direction) => {
        const element = rowRef.current;
        if (!element) return;
        const amount = direction === "left" ? -element.clientWidth : element.clientWidth;
        element.scrollBy({ left: amount, behavior: "smooth" });
    };

    return (
        <section className="pdf-section">
            <h2 className="pdf-section-title">{title}</h2>

            <div className="pdf-row-wrapper">
                <button className="row-arrow left" onClick={() => scroll("left")}>‹</button>

                <div className="pdf-row" ref={rowRef}>
                    {items.map((item) => {
                        const backgroundColor =
                            typeColors[item.type] || fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
                        const textColor = getContrastingTextColor(backgroundColor);

                        return (
                            <div
                                key={item.id}
                                className="pdf-card"
                                style={{ backgroundColor, color: textColor }}
                            >
                                {item.image && (
                                    <div className="pdf-card-image-wrapper">
                                        <img src={item.image} alt={item.title} className="pdf-card-image" />
                                    </div>
                                )}
                                <div className="pdf-card-text">
                                    <p className="pdf-card-title">{item.title}</p>
                                    <p className="pdf-card-meta">{item.type} • {item.author}</p>
                                    {(typeof item.views === "number" || item.uploadedAt) && (
                                        <p className="pdf-card-extra">
                                            {typeof item.views === "number" && `${item.views} views`}
                                            {item.uploadedAt && (typeof item.views === "number" ? " • " : "") + `Uploaded ${formatDate(item.uploadedAt)}`}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button className="row-arrow right" onClick={() => scroll("right")}>›</button>
            </div>
        </section>
    );
}

export default function PDFListPage({ pageTitle, pageSubtitle, items }) {
    return (
        <div className="pdf-list-page">
            <header className="pdf-list-header">
                <h1>{pageTitle}</h1>
                {pageSubtitle && <p className="pdf-list-subtitle">{pageSubtitle}</p>}
                <div className="pdf-list-divider"></div>
            </header>

            <main className="pdf-list-content">
                {!items || items.length === 0 ? (
                    <p className="pdf-list-empty">
                        There are currently no media types uploaded to this page...
                    </p>
                ) : (
                    <PDFRow title="Recently Uploaded" items={items} />
                )}
            </main>
        </div>
    );
}

