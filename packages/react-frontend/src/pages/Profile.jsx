import { Link } from "react-router-dom";
import { useState } from "react";

export default function Profile() {
  // Example user data (can come from backend later)
  const username = "Briggs";
  const accountType = "Moderator";

  const [bio, setBio] = useState("This is where your bio will appear.");
  const [isEditing, setIsEditing] = useState(false);

  // Profile picture state
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");

  // Example lists
  const favoriteMedia = ["Pride and Prejudice", "The Beatles Anthology", "Metropolis (1927)"];
  const uploadedMedia = ["My Original Short Film", "Nature Sound Pack", "Public Domain Poem Reading"];
  const reviews = [
    "Loved this piece — beautifully restored!",
    "Interesting remix concept.",
    "Could use better audio quality, but great find."
  ];

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

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={profilePic}
          alt={`${username}'s profile`}
          className="profile-picture"
        />
        <div className="profile-info">
          <h1>{username}'s Profile</h1>
          <p className="account-type">{accountType} Account</p>
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
      </div>

      {/* Bio Section */}
      <section>
        <h2>About Me</h2>
        {isEditing ? (
          <div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              cols="50"
            />
            <br />
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <div>
            <p>{bio}</p>
            <button onClick={handleEdit}>Edit Bio</button>
          </div>
        )}
      </section>

      {/* Account Info */}
      <section>
        <h2>Account Info</h2>
        <ul>
          <li>Email: user@example.com</li>
          <li>Member since: Jan 2025</li>
        </ul>
      </section>

      {/* Favorite Media */}
      <section>
        <h2>Favorite Media</h2>
        <ul>
          {favoriteMedia.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Uploaded Media */}
      <section>
        <h2>Uploaded Media</h2>
        <ul>
          {uploadedMedia.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Reviews */}
      <section>
        <h2>Reviews</h2>
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>{review}</li>
          ))}
        </ul>
      </section>

      {/* Settings */}
      <section>
        <h2>Settings</h2>
        <p>Manage your account preferences:</p>
        <button onClick={handleChangePasscode}>Change Passcode</button>
        <button onClick={handleChangeEmail}>Change Email</button>
      </section>
    </div>
  );
}

