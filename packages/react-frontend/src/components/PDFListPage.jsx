
import { Link } from "react-router-dom";
import "./PDFListPage.css";

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
                    <p className="pdf-list-empty">There are currently no media types uploaded to this page...</p>
                ) : (
                    <ul className="pdf-card-grid">
                        {items.map((item) => (
                            <li key={item.id} className="pdf-card-wrapper">
                                <Link to={`/file/${item.id}`} className="pdf-card-link">
                                    <div className="pdf-card-image-wrapper">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="pdf-card-image"
                                        />
                                    </div>

                                    <div className="pdf-card-body">
                                        <h2 className="pdf-card-title">{item.title}</h2>
                                        <p className="pdf-card-metadata">
                                            <span className="pdf-card-type">{item.type}</span>
                                            {" • "}
                                            <span className="pdf-card-author">{item.author}</span>
                                        </p>

                                        {(typeof item.views === "number" || item.uploadedAt) && (
                                            <p className="pdf-card-extra">
                                                {typeof item.views === "number" && (
                                                    <span>{item.views} views</span>
                                                )}

                                                {item.uploadedAt && (
                                                    <span>
                                                        {typeof item.views === "number" && " • "}
                                                        Uploaded {formatDate(item.uploadedAt)}
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}