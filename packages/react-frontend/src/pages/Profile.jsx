import { Link } from "react-router-dom";
import { useState } from "react";

export default function Profile() {
  const username = "Briggs";
  const accountType = "Moderator";
  const [bio, setBio] = useState("This is where your bio will appear.");
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState("https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/w_2240,c_limit/Monkey-Selfie.jpg");
  const favoriteMedia = ["The Giver", "A Rush of Blood to the Head", "School of Rock (2003)"];
  const uploadedMedia = ["My Original Short Film", "White Noise", "Deaf Poetry Coffee Shop Recording"];
  const reviews = ["Loved this piece — beautifully restored!", "Interesting remix concept.", "Could use better audio quality, but great find."];
  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
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
      <section>
        <h2>Account Info</h2>
        <ul>
          <li>Email: briggswillmurphy@gmail.com</li>
          <li>Member since: Jan 2025</li>
        </ul>
      </section>
      <section>
        <h2>Favorite Media</h2>
        <ul>
          {favoriteMedia.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Uploaded Media</h2>
        <ul>
          {uploadedMedia.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Reviews</h2>
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>{review}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Settings</h2>
        <p>Manage your account preferences:</p>
        <button onClick={handleChangePasscode}>Change Passcode</button>
        <button onClick={handleChangeEmail}>Change Email</button>
      </section>
    </div>
  );
}

