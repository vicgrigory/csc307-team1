import { useState } from "react";
import DiscussionForm from "./DiscussionForm";
import "./DiscussionThread.css";

function DiscussionItem({ discussion, currentUser, onReply, onEdit, onDelete, onLike, depth = 0 }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(discussion.content);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isOwner = currentUser && discussion.userID?.username === currentUser.username;
  const isModerator = currentUser && currentUser.type === "moderator";
  const canEdit = isOwner || isModerator;
  const hasLiked = currentUser && discussion.likes?.includes(currentUser._id);
  const maxDepth = 2;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleReply = async (content) => {
    await onReply(discussion._id, content);
    setShowReplyForm(false);
  };

  const handleEdit = async () => {
    if (editContent.trim()) {
      await onEdit(discussion._id, editContent);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment and all its replies?")) {
      onDelete(discussion._id);
    }
  };

  const handleLike = () => {
    if (currentUser) {
      onLike(discussion._id);
    } else {
      alert("Please log in to like comments.");
    }
  };

  const replyCount = discussion.replies?.length || 0;

  return (
    <div className={`discussion-item depth-${depth}`}>
      <div className="discussion-main">
        <div className="discussion-avatar">
          {discussion.userID?.username?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="discussion-content-wrapper">
          <div className="discussion-header">
            <span className="discussion-author">{discussion.userID?.username || "Anonymous"}</span>
            <span className="discussion-date">{formatDate(discussion.createdAt || new Date())}</span>
            {discussion.updatedAt !== discussion.createdAt && (
              <span className="discussion-edited">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="discussion-edit">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows="3"
                maxLength="2000"
              />
              <div className="edit-actions">
                <button onClick={handleEdit} className="save-btn">Save</button>
                <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="discussion-text">{discussion.content}</p>
          )}

          <div className="discussion-actions">
            <button
              onClick={handleLike}
              className={`like-btn ${hasLiked ? "liked" : ""}`}
              disabled={!currentUser}
            >
              ♥ {discussion.likeCount || 0}
            </button>
            {depth < maxDepth && (
              <button onClick={() => setShowReplyForm(!showReplyForm)} className="reply-btn">
                Reply
              </button>
            )}
            {canEdit && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                  Edit
                </button>
                <button onClick={handleDelete} className="delete-btn">
                  Delete
                </button>
              </>
            )}
            {replyCount > 0 && (
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="collapse-btn">
                {isCollapsed ? `▶ Show ${replyCount} ${replyCount === 1 ? "reply" : "replies"}` : "▼ Hide replies"}
              </button>
            )}
          </div>

          {showReplyForm && (
            <div className="reply-form-container">
              <DiscussionForm
                onSubmit={handleReply}
                onCancel={() => setShowReplyForm(false)}
                placeholder={`Reply to ${discussion.userID?.username || "Anonymous"}...`}
                submitText="Reply"
              />
            </div>
          )}
        </div>
      </div>

      {!isCollapsed && discussion.replies && discussion.replies.length > 0 && (
        <div className="discussion-replies">
          {discussion.replies.map((reply) => (
            <DiscussionItem
              key={reply._id}
              discussion={reply}
              currentUser={currentUser}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiscussionThread({ discussions, currentUser, onReply, onEdit, onDelete, onLike }) {
  const [sortBy, setSortBy] = useState("best");

  const sortDiscussions = (discussionList) => {
    const sorted = [...discussionList];

    switch (sortBy) {
      case "best":
        return sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return sorted;
    }
  };

  const sortedDiscussions = sortDiscussions(discussions || []);

  return (
    <div className="discussion-thread">
      <div className="discussion-header-controls">
        <h3>Discussion ({discussions?.length || 0} comments)</h3>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="best">Best</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="discussion-list">
        {sortedDiscussions.length === 0 ? (
          <p className="no-discussions">No comments yet. Be the first to start the discussion!</p>
        ) : (
          sortedDiscussions.map((discussion) => (
            <DiscussionItem
              key={discussion._id}
              discussion={discussion}
              currentUser={currentUser}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              depth={0}
            />
          ))
        )}
      </div>
    </div>
  );
}
