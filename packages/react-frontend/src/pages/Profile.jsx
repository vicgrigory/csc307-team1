// Profile.jsx

import "./Profile.css"

import { Link } from "react-router-dom";
import { useState } from "react";

export default function Profile() {
  // Example user data (can come from backend later)
  const username = "Briggs";
  const accountType = "Moderator";

  const isCurrentUser = true;
  const [isPrivate, setIsPrivate] = useState(false);

  const [bio, setBio] = useState("All about me!");
  const [isEditing, setIsEditing] = useState(false);

  // Profile picture state
  const [profilePic, setProfilePic] = useState("https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/w_2240,c_limit/Monkey-Selfie.jpg");

  const followers = ["Matthew", "Tobin", "Vic", "Briggs", "Matthew"]

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
    { id: 2, title: "Linear Algebra Made Easy", type: "Notes", author: "Steven Arata", image: "https://via.placeholder.com/200x280?text=Linear+Algebra" },
    { id: 5, title: "Data Structures in C++", type: "Textbook", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=C++" },
    { id: 7, title: "Deep Learning Notes", type: "Notes", author: "Paul Anderson", image: "https://via.placeholder.com/200x280?text=Deep+Learning" },
    { id: 10, title: "Probability for CS", type: "Textbook", author: "Bret Holladay", image: "https://via.placeholder.com/200x280?text=Probability" },
    { id: 13, title: "Ethics in AI", type: "Article", author: "Jane Lehr", image: "https://via.placeholder.com/200x280?text=AI+Ethics" },
    { id: 15, title: "Graph Theory Homework", type: "PDF", author: "Damon Lin", image: "https://via.placeholder.com/200x280?text=Graph+Theory" },
    { id: 16, title: "CS1 Study Guide", type: "Notes", author: "Ayaan Kazerouni", image: "https://via.placeholder.com/200x280?text=CS1" }
  ];

  const uploaded = [
    { id: 11, title: "Database Systems Summary", type: "Notes", author: "Andrew Migler", image: "https://via.placeholder.com/200x280?text=Databases" },
    { id: 15, title: "Graph Theory Homework", type: "PDF", author: "Damon Lin", image: "https://via.placeholder.com/200x280?text=Graph+Theory" }

  ];

  const reviews = [
    { id: 1, title: "Graph Theory Homework", author: "Damon Lin", type: "PDF", review: "Loved this piece — beautifully restored!", rating: 5, image: "https://via.placeholder.com/200x280?text=Graph+Theory" },
    { id: 2, title: "Deep Learning Notes", author: "Paul Anderson", type: "Notes", review: "Interesting remix concept.", rating: 4, image: "https://via.placeholder.com/200x280?text=Deep+Learning" },
    { id: 3, title: "CS1 Study Guide", author: "Ayaan Kazerouni", type: "Notes", review: "Could use better audio quality, but great find.", rating: 3, image: "https://via.placeholder.com/200x280?text=CS1" }
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
            alt={`${username}'s profile`}
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
          <p><strong>Member since:</strong> Jan 2025</p>
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
                <img
                  src={item.image}
                  alt={item.title}
                  className="media-card-image"
                />
                <div>
                  <h4>{item.title}</h4>
                  <p>
                    {item.type} • {item.author}
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
                <img
                  src={item.image}
                  alt={item.title}
                  className="media-card-image"
                />
                <h4>{item.title}</h4>
                <p>
                  {item.type} • {item.author}
                </p>
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
                  {item.title} • {item.type}
                </h4>
                <p>{item.review}</p>
                <p>Rating: {item.rating} / 5 ⭐</p>
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

