import { useState } from "react";
import "./DiscussionForm.css";

export default function DiscussionForm({
  onSubmit,
  onCancel,
  placeholder = "Join the discussion...",
  submitText = "Post Comment",
}) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.trim().length < 1) {
      alert("Please enter a comment.");
      return;
    }

    if (content.length > 2000) {
      alert("Comment is too long. Maximum 2000 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="discussion-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows="3"
        maxLength="2000"
        disabled={isSubmitting}
      />
      <div className="form-footer">
        <span className="char-count">{content.length}/2000</span>
        <div className="form-actions">
          {onCancel && (
            <button type="button" onClick={onCancel} className="cancel-btn" disabled={isSubmitting}>
              Cancel
            </button>
          )}
          <button type="submit" className="submit-btn" disabled={isSubmitting || content.trim().length === 0}>
            {isSubmitting ? "Posting..." : submitText}
          </button>
        </div>
      </div>
    </form>
  );
}
