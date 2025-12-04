import { useState } from "react";
import StarRating from "./StarRating";
import "./ReviewCard.css";

export default function ReviewCard({ review, currentUser, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const [editRating, setEditRating] = useState(review.rating);

  const isOwner = currentUser && review.userID?.username === currentUser.username;
  const isModerator = currentUser && currentUser.type === "moderator";
  const canEdit = isOwner || isModerator;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const handleSave = () => {
    if (editContent.trim() && editRating > 0) {
      onEdit(review._id, editContent, editRating);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(review.content);
    setEditRating(review.rating);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      onDelete(review._id);
    }
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-author">
          <div className="author-avatar">
            {review.userID?.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="author-info">
            <span className="author-name">{review.userID?.username || "Anonymous"}</span>
            <span className="review-date">{formatDate(review.createdAt || new Date())}</span>
          </div>
        </div>
        {canEdit && !isEditing && (
          <div className="review-actions">
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit
            </button>
            <button onClick={handleDelete} className="delete-btn">
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="review-content">
        {isEditing ? (
          <div className="review-edit-form">
            <div className="form-group">
              <label>Rating:</label>
              <StarRating
                rating={editRating}
                interactive={true}
                onChange={setEditRating}
                size="medium"
              />
            </div>
            <div className="form-group">
              <label>Review:</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows="4"
                placeholder="Share your thoughts..."
                maxLength="1000"
              />
              <span className="char-count">{editContent.length}/1000</span>
            </div>
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="review-rating">
              <StarRating rating={review.rating} size="small" />
            </div>
            {review.title && <h4 className="review-title">{review.title}</h4>}
            <p className="review-text">{review.content}</p>
          </>
        )}
      </div>
    </div>
  );
}
