// Profile.jsx

import "./Profile.css"

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";

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

export default function Profile() {
  const { token, username: loggedInUsername } = useAuth();

  const [username, setUsername] = useState("");
  const [accountType, setAccountType] = useState("Regular");
  const [bio, setBio] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profilePic, setProfilePic] = useState("");
  const [followers, setFollowers] = useState([]);

  const isCurrentUser = true;

  // Fetch user data from backend
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("https://team1project-g9eehgd9fybtere2.westus3-01.azurewebsites.net//me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch profile data");
        return;
      }

      const data = await res.json();

      setUsername(data.username);
      setAccountType(data.type ?? "Regular");
      setBio(data.about ?? "");
      setProfilePic(data.profile ?? "");
      setFollowers(data.followers ?? []);
    }

    fetchUser();
  }, [token]);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);

  // Placeholder handlers for buttons
  const handleChangePasscode = () => alert("Change passcode functionality coming soon!");
  const handleChangeEmail = () => alert("Change email functionality coming soon!");

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

// Dummy data (replace with actual content later)
  const favoriteMedia = [
    { id: 2, title: "Linear Algebra Made Easy", type: "Notes", author: "Steven Arata", image: "https://via.placeholder.com/200x280?text=Linear+Algebra", uploadedAt: "2025-01-08T14:30:00Z", views: 12 },
    { id: 5, title: "Data Structures in C++", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=C++", uploadedAt: "2025-01-14T09:20:00Z", views: 18 },
    { id: 7, title: "Deep Learning Notes", type: "Notes", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Deep+Learning", uploadedAt: "2025-01-17T11:30:00Z", views: 9 },
    { id: 10, title: "Probability for CS", type: "Textbook", author: "Bret Holladay", image: "https://via.placeholder.com/200x280?text=Probability", uploadedAt: "2025-01-19T14:45:00Z", views: 22 },
    { id: 13, title: "Ethics in AI", type: "Article", author: "Jane Lehr", image: "https://via.placeholder.com/200x280?text=AI+Ethics", uploadedAt: "2025-01-12T16:10:00Z", views: 7 },
    { id: 15, title: "Graph Theory Homework", type: "PDF", author: "Damon Lin", image: "https://via.placeholder.com/200x280?text=Graph+Theory", uploadedAt: "2025-01-10T12:00:00Z", views: 14 },
    { id: 16, title: "CS1 Study Guide", type: "Notes", author: "Ayaan Kazerouni", image: "https://via.placeholder.com/200x280?text=CS1", uploadedAt: "2025-01-11T09:30:00Z", views: 6 }
  ];

  const uploaded = [
    { id: 2, title: "Linear Algebra Made Easy", type: "Notes", author: "Steven Arata", image: "https://via.placeholder.com/200x280?text=Linear+Algebra", uploadedAt: "2025-01-08T14:30:00Z", views: 12 },
    { id: 5, title: "Data Structures in C++", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=C++", uploadedAt: "2025-01-14T09:20:00Z", views: 18 },
    { id: 7, title: "Deep Learning Notes", type: "Notes", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Deep+Learning", uploadedAt: "2025-01-17T11:30:00Z", views: 9 },
    { id: 10, title: "Probability for CS", type: "Textbook", author: "Bret Holladay", image: "https://via.placeholder.com/200x280?text=Probability", uploadedAt: "2025-01-19T14:45:00Z", views: 22 },
    { id: 13, title: "Ethics in AI", type: "Article", author: "Jane Lehr", image: "https://via.placeholder.com/200x280?text=AI+Ethics", uploadedAt: "2025-01-12T16:10:00Z", views: 7 },
    { id: 15, title: "Graph Theory Homework", type: "PDF", author: "Damon Lin", image: "https://via.placeholder.com/200x280?text=Graph+Theory", uploadedAt: "2025-01-10T12:00:00Z", views: 14 },
    { id: 16, title: "CS1 Study Guide", type: "Notes", author: "Ayaan Kazerouni", image: "https://via.placeholder.com/200x280?text=CS1", uploadedAt: "2025-01-11T09:30:00Z", views: 6 }
  ];

  const reviews = [
    { id: 1, title: "Graph Theory Homework", author: "Damon Lin", type: "PDF", review: "Loved this piece — beautifully restored!", rating: 5, image: "https://via.placeholder.com/200x280?text=Graph+Theory", reviewedDate: "2025-01-20T10:15:00Z" },
    { id: 2, title: "Deep Learning Notes", author: "Paul Anderson", type: "Notes", review: "Interesting remix concept.", rating: 4, image: "https://via.placeholder.com/200x280?text=Deep+Learning", reviewedDate: "2025-01-19T18:40:00Z" },
    { id: 3, title: "CS1 Study Guide", author: "Ayaan Kazerouni", type: "Notes", review: "Could use better audio quality, but great find.", rating: 3, image: "https://via.placeholder.com/200x280?text=CS1", reviewedDate: "2025-01-18T14:05:00Z" },
    // { id: 1, title: "Graph Theory Homework", author: "Damon Lin", type: "PDF", review: "Loved this piece — beautifully restored!", rating: 5, image: "https://via.placeholder.com/200x280?text=Graph+Theory", reviewedDate: "2025-01-20T10:15:00Z" },
    // { id: 2, title: "Deep Learning Notes", author: "Paul Anderson", type: "Notes", review: "Interesting remix concept.", rating: 4, image: "https://via.placeholder.com/200x280?text=Deep+Learning", reviewedDate: "2025-01-19T18:40:00Z" },
    // { id: 3, title: "CS1 Study Guide", author: "Ayaan Kazerouni", type: "Notes", review: "Could use better audio quality, but great find.", rating: 3, image: "https://via.placeholder.com/200x280?text=CS1", reviewedDate: "2025-01-18T14:05:00Z" },
  ];

  // Render to others if profile is private
  if (isPrivate && !isCurrentUser) {
    return (
      <div className="page-container">
        <div className="profile-private-message">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
            alt="Locked Icon"
            className="locked-icon"
          />
          <p className="private-text">This profile is currently private</p>
        </div>
      </div>
    );
  }

  // Normal render (owner, or public profile)
  return (
    <div className="page-container">
      {/* Profile Header */}
      <div className="profile-header">
        {/* LEFT: picture */}
        <div className="profile-picture-wrapper">
          <img
            src={profilePic}
            alt={""}
            className="profile-pic"
          />
          <label htmlFor="profilePicUpload" className="upload-button">
            Change Picture
          </label>
          <input
            type="file"
            id="profilePicUpload"
            accept="image/*"
            onChange={handleProfilePicChange}
            style={{ display: "none" }}
          />
        </div>

        {/* MIDDLE: name, buttons, about me, bio */}
        <div className="profile-info">
          <h1 className="profile-username">{username}</h1>

          <div className="profile-settings-tabs">
            <button className="settings-tab" onClick={handleChangePasscode}>
              Change Passcode
            </button>
            <button className="settings-tab" onClick={handleChangeEmail}>
              Change Email
            </button>
            <button
              className="settings-tab"
              onClick={() => setIsPrivate((prev) => !prev)}
            >
              {isPrivate ? "Make Profile Public" : "Make Profile Private"}
            </button>
          </div>

          <h2 className="about-me">About Me</h2>

          <div className="profile-bio-inline">
            {isEditing ? (
              <>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="3"
                />
                <br />
                <button onClick={handleSave}>Save</button>
              </>
            ) : (
              <>
                <p>{bio}</p>
                <button onClick={handleEdit}>Edit Bio</button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: info card next to the name */}
        <aside className="profile-info-card">
          <h3>Profile Overview</h3>
          <p><strong>Member since:</strong> Just now</p>
          <p><strong>Account Type:</strong> {accountType}</p>
          <p><strong>Uploaded media:</strong> {uploaded.length}</p>
          <p><strong>Favorites:</strong> {favoriteMedia.length}</p>
          <p><strong>Reviews:</strong> {reviews.length}</p>
          <p><strong>Followers:</strong> {followers.length}</p>
        </aside>
      </div>

      <hr className="divider" />

      {/* Bottom columns */}
      <div className="profile-bottom-columns">
        {/* Favorite Media */}
        <div className="content-column">
          <h2>Favorite Media</h2>
          <div className="profile-media-card-wrapper">
            {favoriteMedia.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="profile-media-card media-horizontal-card"
              >
                <div className="media-card-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="media-card-image"
                  />
                </div>

                <div className="media-card-content">
                  <h4 className="media-card-title">{item.title}</h4>

                  <p className="media-card-meta">
                    {item.type} • {item.author}
                  </p>

                  <p className="media-card-meta">
                    {item.views != null && <span>{item.views} views</span>}
                    {item.views != null && item.uploadedAt && " • "}
                    {item.uploadedAt && (
                      <span>Uploaded {formatDate(item.uploadedAt)}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {favoriteMedia.length > 5 && (
            <Link to="/favorites" className="view-more-button">
              View More →
            </Link>
          )}
        </div>

        {/* Uploaded Media */}
        <div className="content-column">
          <h2>Uploaded Media</h2>
          <div className="profile-media-card-wrapper">
            {uploaded.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="profile-media-card media-horizontal-card"
              >
                <div className="media-card-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="media-card-image"
                  />
                </div>

                <div className="media-card-content">
                  <h4 className="media-card-title">{item.title}</h4>

                  <p className="media-card-meta">
                    {item.type} • {item.author}
                  </p>

                  <p className="media-card-meta">
                    {item.views != null && <span>{item.views} views</span>}
                    {item.views != null && item.uploadedAt && " • "}
                    {item.uploadedAt && (
                      <span>Uploaded {formatDate(item.uploadedAt)}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {uploaded.length > 5 && (
            <Link to="/uploads" className="view-more-button">
              View More →
            </Link>
          )}
        </div>

        {/* Reviews */}
        <div className="content-column">
          <h2>Reviews</h2>
          <div className="profile-media-card-wrapper">
            {reviews.slice(0, 5).map((item) => (
              <div key={item.id} className="profile-media-card">
                <h4>
                  {item.title} • {item.type} • {item.author}
                </h4>
                <p className="review-metadata">{item.review}</p>
                <p className="review-metadata">Rating: {item.rating} / 5 ⭐ • {formatDate(item.reviewedDate)}</p>
              </div>
            ))}
          </div>

          {reviews.length > 5 && (
            <Link to="/reviews" className="view-more-button">
              View More →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

