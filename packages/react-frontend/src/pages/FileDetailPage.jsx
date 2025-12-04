import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FileViewer from "../components/FileViewer";
import StarRating from "../components/StarRating";
import ReviewCard from "../components/ReviewCard";
import AddReviewForm from "../components/AddReviewForm";
import DiscussionThread from "../components/DiscussionThread";
import DiscussionForm from "../components/DiscussionForm";
import "./FileDetailPage.css";

export default function FileDetailPage() {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const mockUser = {
      username: "testuser",
      _id: "123",
      type: "regular",
    };
    setCurrentUser(mockUser);
  }, []);

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}`);

        if (!response.ok) {
          throw new Error("File not found");
        }

        const fileData = await response.json();
        setFile(fileData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (fileId) {
      fetchFileData();
    }
  }, [fileId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}/reviews`);
        if (response.ok) {
          const reviewData = await response.json();
          setReviews(reviewData);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    if (fileId && activeTab === "reviews") {
      fetchReviews();
    }
  }, [fileId, activeTab]);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}/discussions`);
        if (response.ok) {
          const discussionData = await response.json();
          setDiscussions(discussionData);
        }
      } catch (err) {
        console.error("Failed to fetch discussions:", err);
      }
    };

    if (fileId && activeTab === "discussions") {
      fetchDiscussions();
    }
  }, [fileId, activeTab]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const userReview = currentUser
    ? reviews.find((review) => review.userID?.username === currentUser.username)
    : null;

  const handleAddReview = async (reviewData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reviewData,
          username: currentUser?.username || "testuser"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add review");
      }

      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setShowAddReview(false);
    } catch (err) {
      console.error("Failed to add review:", err);
      throw err;
    }
  };

  const handleEditReview = async (reviewId, content, rating) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          rating,
          username: currentUser?.username || "testuser"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit review");
      }

      const reviewsResponse = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}/reviews`);
      if (reviewsResponse.ok) {
        const reviewData = await reviewsResponse.json();
        setReviews(reviewData);
      }
    } catch (err) {
      console.error("Failed to edit review:", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser?.username || "testuser"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const handleAddDiscussion = async (content, parentId = null) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}/discussions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, parentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add discussion");
      }

      const discussionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}/discussions`);
      if (discussionsResponse.ok) {
        const discussionData = await discussionsResponse.json();
        setDiscussions(discussionData);
      }
    } catch (err) {
      console.error("Failed to add discussion:", err);
      throw err;
    }
  };

  const handleEditDiscussion = async (discussionId, content) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/discussions/${discussionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit discussion");
      }

      const discussionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}/discussions`);
      if (discussionsResponse.ok) {
        const discussionData = await discussionsResponse.json();
        setDiscussions(discussionData);
      }
    } catch (err) {
      console.error("Failed to edit discussion:", err);
    }
  };

  const handleDeleteDiscussion = async (discussionId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/discussions/${discussionId}`, {
        method: "DELETE",
        headers: {
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete discussion");
      }

      const discussionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}/discussions`);
      if (discussionsResponse.ok) {
        const discussionData = await discussionsResponse.json();
        setDiscussions(discussionData);
      }
    } catch (err) {
      console.error("Failed to delete discussion:", err);
    }
  };

  const handleLikeDiscussion = async (discussionId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/discussions/${discussionId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to like discussion");
      }

      const discussionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}/discussions`);
      if (discussionsResponse.ok) {
        const discussionData = await discussionsResponse.json();
        setDiscussions(discussionData);
      }
    } catch (err) {
      console.error("Failed to like discussion:", err);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading file...</p>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="page-container">
        <div className="error-state">
          <h2>File Not Found</h2>
          <p>{error || "The file you're looking for doesn't exist."}</p>
          <button onClick={() => navigate("/")} className="back-btn">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="file-detail-page">
        {}
        <section className="file-viewer-section">
          <FileViewer
            fileUrl={file.gridfsId ? `${import.meta.env.VITE_API_URL}/files/${fileId}/download` : file.link}
            fileType={file.filetype}
            fileName={file.title}
          />

          <div className="file-metadata">
            <div className="file-info">
              <h1 className="file-title">{file.title}</h1>
              <div className="file-meta-details">
                <span className="file-type">{file.filetype}</span>
                {file.creator && (
                  <>
                    <span className="meta-separator">•</span>
                    <span className="file-creator">by {file.creator}</span>
                  </>
                )}
                {file.creationDate && (
                  <>
                    <span className="meta-separator">•</span>
                    <span className="file-date">
                      {new Date(file.creationDate).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
              {file.tags && file.tags.length > 0 && (
                <div className="file-tags">
                  {file.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="file-rating-summary">
              <StarRating
                rating={averageRating}
                size="large"
                showCount={true}
                reviewCount={reviews.length}
              />
            </div>
          </div>
        </section>

        {}
        <section className="tabs-section">
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({reviews.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "discussions" ? "active" : ""}`}
              onClick={() => setActiveTab("discussions")}
            >
              Discussions ({discussions.length})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "reviews" && (
              <div className="reviews-tab">
                {!userReview && !showAddReview && currentUser && (
                  <button
                    onClick={() => setShowAddReview(true)}
                    className="add-review-btn"
                  >
                    Write a Review
                  </button>
                )}

                {showAddReview && (
                  <AddReviewForm
                    onSubmit={handleAddReview}
                    onCancel={() => setShowAddReview(false)}
                  />
                )}

                {reviews.length === 0 ? (
                  <div className="empty-state">
                    <p>No reviews yet. Be the first to review this file!</p>
                  </div>
                ) : (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review._id}
                        review={review}
                        currentUser={currentUser}
                        onEdit={handleEditReview}
                        onDelete={handleDeleteReview}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "discussions" && (
              <div className="discussions-tab">
                {currentUser && (
                  <DiscussionForm onSubmit={(content) => handleAddDiscussion(content)} />
                )}

                <DiscussionThread
                  discussions={discussions}
                  currentUser={currentUser}
                  onReply={handleAddDiscussion}
                  onEdit={handleEditDiscussion}
                  onDelete={handleDeleteDiscussion}
                  onLike={handleLikeDiscussion}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
