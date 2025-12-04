import { useState } from "react";
import StarRating from "./StarRating";
import "./AddReviewForm.css";

export default function AddReviewForm({ onSubmit, onCancel }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    if (content.trim().length < 10) {
      alert("Review must be at least 10 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, title: title.trim(), content: content.trim() });
      setRating(0);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="add-review-form" onSubmit={handleSubmit}>
      <h3>Write a Review</h3>

      <div className="form-group">
        <label>Your Rating *</label>
        <StarRating
          rating={rating}
          interactive={true}
          onChange={setRating}
          size="large"
        />
      </div>

      <div className="form-group">
        <label>Title (optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience in one line"
          maxLength="100"
        />
      </div>

      <div className="form-group">
        <label>Review *</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your detailed thoughts about this file..."
          rows="6"
          maxLength="1000"
          required
        />
        <span className="char-count">{content.length}/1000</span>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
