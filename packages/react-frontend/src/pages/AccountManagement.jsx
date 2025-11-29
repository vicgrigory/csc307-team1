import { useState } from "react";

export default function AccountManagement() {

  const [username] = useState("Briggs");
  const [email, setEmail] = useState("user@example.com");
  const [accountType] = useState("Moderator");
  const [bio, setBio] = useState("This is where your bio will appear.");

  const [profilePic, setProfilePic] = useState("https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/w_2240,c_limit/Monkey-Selfie.jpg");

  const [currentView, setCurrentView] = useState("general");

  const [isEditingBio, setIsEditingBio] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showEmail, setShowEmail] = useState(false);
  const [allowComments, setAllowComments] = useState(true);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const handleResetPassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    alert("Password reset successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangeEmail = () => {
    const newEmail = prompt("Enter new email address:", email);
    if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setEmail(newEmail);
      alert("Email updated successfully!");
    } else if (newEmail) {
      alert("Please enter a valid email address");
    }
  };

  const handleSaveBio = () => {
    setIsEditingBio(false);
  };


  const styles = {
    container: {
      display: "flex",
      gap: "3rem",
      minHeight: "600px",
      maxWidth: "1200px",
      margin: "0 auto"
    },
    sidebar: {
      width: "280px",
      flexShrink: 0,
      paddingRight: "2rem",
      borderRight: "2px solid #e0e0e0"
    },
    profilePicContainer: {
      marginBottom: "2rem",
      textAlign: "center"
    },
    profilePicWrapper: {
      position: "relative",
      display: "inline-block",
      width: "150px",
      height: "150px"
    },
    profilePic: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      objectFit: "cover",
      backgroundColor: "#e8e8e8",
      border: "4px solid #fff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      display: "block",
      visibility: "visible"
    },
    editButton: {
      position: "absolute",
      bottom: "8px",
      right: "8px",
      backgroundColor: "#4a5568",
      color: "white",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "18px",
      border: "3px solid #fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      transition: "all 0.2s",
      textAlign: "center",
      lineHeight: "40px"
    },
    usernameSection: {
      marginBottom: "2rem",
      paddingBottom: "1.5rem",
      borderBottom: "2px solid #e0e0e0"
    },
    username: {
      fontSize: "1.75rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
      color: "#2d3748"
    },
    accountType: {
      fontStyle: "italic",
      color: "#718096",
      fontSize: "0.95rem",
      margin: 0
    },
    quickActionsSection: {
      marginBottom: "2rem"
    },
    actionButton: {
      display: "block",
      width: "100%",
      padding: "0.75rem 1rem",
      marginBottom: "0.75rem",
      backgroundColor: "#4299e1",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.95rem",
      fontWeight: "500",
      cursor: "pointer",
      textAlign: "left",
      transition: "all 0.2s",
      boxShadow: "0 2px 4px rgba(66,153,225,0.3)"
    },
    settingsSection: {
      marginTop: "1rem"
    },
    settingsTitle: {
      fontSize: "1.1rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "#2d3748"
    },
    settingsMenu: {
      listStyle: "none",
      padding: 0,
      margin: 0
    },
    menuItem: {
      marginBottom: "0.5rem"
    },
    menuButton: (isActive) => ({
      background: isActive ? "#edf2f7" : "transparent",
      border: "none",
      padding: "0.75rem 1rem",
      cursor: "pointer",
      width: "100%",
      textAlign: "left",
      fontWeight: isActive ? "600" : "normal",
      fontSize: "0.95rem",
      color: isActive ? "#2d3748" : "#4a5568",
      borderRadius: "6px",
      transition: "all 0.2s",
      borderLeft: isActive ? "4px solid #4299e1" : "4px solid transparent"
    }),
    mainContent: {
      flex: 1,
      paddingLeft: "2rem"
    },
    contentTitle: {
      fontSize: "2rem",
      fontWeight: "600",
      marginBottom: "1.5rem",
      color: "#2d3748"
    },
    sectionTitle: {
      fontSize: "1.3rem",
      fontWeight: "500",
      marginBottom: "1rem",
      color: "#2d3748"
    },
    bioBox: {
      backgroundColor: "#f7fafc",
      padding: "1.25rem",
      borderRadius: "8px",
      maxWidth: "700px",
      marginBottom: "1rem",
      border: "1px solid #e2e8f0",
      minHeight: "80px"
    },
    bioText: {
      margin: 0,
      lineHeight: "1.6",
      color: "#4a5568"
    },
    textarea: {
      width: "100%",
      maxWidth: "700px",
      padding: "0.75rem",
      borderRadius: "6px",
      border: "2px solid #cbd5e0",
      fontSize: "1rem",
      fontFamily: "inherit",
      resize: "vertical"
    },
    primaryButton: {
      padding: "0.75rem 1.5rem",
      backgroundColor: "#4299e1",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: "0 2px 4px rgba(66,153,225,0.3)",
      marginRight: "0.75rem"
    },
    secondaryButton: {
      padding: "0.75rem 1.5rem",
      backgroundColor: "#e2e8f0",
      color: "#4a5568",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s"
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "6px",
      border: "2px solid #cbd5e0",
      fontSize: "1rem",
      marginTop: "0.5rem",
      transition: "border-color 0.2s"
    },
    label: {
      fontWeight: "500",
      color: "#2d3748",
      marginBottom: "0.5rem",
      display: "block"
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      fontSize: "1rem",
      color: "#4a5568",
      cursor: "pointer"
    },
    checkbox: {
      marginRight: "0.75rem",
      width: "18px",
      height: "18px",
      cursor: "pointer"
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "general":
        return (
          <div>
            <h2 style={styles.contentTitle}>General Settings</h2>

            <div style={{ marginBottom: "3rem" }}>
              <h3 style={styles.sectionTitle}>Account Bio</h3>
              {isEditingBio ? (
                <div>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="5"
                    style={styles.textarea}
                  />
                  <div style={{ marginTop: "1rem" }}>
                    <button onClick={handleSaveBio} style={styles.primaryButton}>
                      Save Bio
                    </button>
                    <button
                      onClick={() => setIsEditingBio(false)}
                      style={styles.secondaryButton}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={styles.bioBox}>
                    <p style={styles.bioText}>{bio}</p>
                  </div>
                  <button onClick={() => setIsEditingBio(true)} style={styles.primaryButton}>
                    Edit Bio
                  </button>
                </div>
              )}
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={styles.sectionTitle}>Account Actions</h3>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button onClick={handleChangeEmail} style={styles.primaryButton}>
                  Change Email
                </button>
                <button onClick={() => setCurrentView("password")} style={styles.primaryButton}>
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div>
            <h2 style={styles.contentTitle}>Privacy Settings</h2>

            <div style={{ marginBottom: "2rem" }}>
              <label htmlFor="profileVisibility" style={styles.label}>
                Profile Visibility
              </label>
              <select
                id="profileVisibility"
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value)}
                style={{ ...styles.input, width: "auto", minWidth: "200px" }}
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={showEmail}
                  onChange={(e) => setShowEmail(e.target.checked)}
                  style={styles.checkbox}
                />
                Show email on profile
              </label>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                  style={styles.checkbox}
                />
                Allow comments on uploads
              </label>
            </div>
          </div>
        );

      case "recently-viewed":
        return (
          <div>
            <h2 style={styles.contentTitle}>Recently Viewed</h2>
            <p style={{ color: "#718096", marginBottom: "1.5rem" }}>
              Your recently viewed items will appear here.
            </p>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0
            }}>
              {[
                { title: "Pride and Prejudice", time: "2 days ago" },
                { title: "The Beatles Anthology", time: "5 days ago" },
                { title: "Metropolis (1927)", time: "1 week ago" }
              ].map((item, index) => (
                <li
                  key={index}
                  style={{
                    padding: "1rem",
                    marginBottom: "0.75rem",
                    backgroundColor: "#f7fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span style={{ fontWeight: "500", color: "#2d3748" }}>{item.title}</span>
                  <span style={{ color: "#718096", fontSize: "0.9rem" }}>Viewed {item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "password":
        return (
          <div>
            <h2 style={styles.contentTitle}>Reset Password</h2>

            <div style={{ maxWidth: "500px" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label htmlFor="currentPassword" style={styles.label}>
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  style={styles.input}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label htmlFor="newPassword" style={styles.label}>
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  style={styles.input}
                />
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label htmlFor="confirmPassword" style={styles.label}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  style={styles.input}
                />
              </div>

              <div>
                <button onClick={handleResetPassword} style={styles.primaryButton}>
                  Save Password
                </button>
                <button
                  onClick={() => setCurrentView("general")}
                  style={styles.secondaryButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <input
        type="file"
        id="profilePicUpload"
        accept="image/*"
        onChange={handleProfilePicChange}
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          opacity: "0"
        }}
      />
      <div style={styles.container}>
        {/* Left Sidebar */}
        <div style={styles.sidebar}>
          {/* Profile Picture */}
          <div style={styles.profilePicContainer}>
            <div style={styles.profilePicWrapper}>
              <img
                src={profilePic}
                alt="Profile"
                style={styles.profilePic}
              />
              <label
                htmlFor="profilePicUpload"
                style={styles.editButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2d3748"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4a5568"}
              >
                ✎
              </label>
            </div>
          </div>

          {/* Username Section */}
          <div style={styles.usernameSection}>
            <h2 style={styles.username}>{username}</h2>
            <p style={styles.accountType}>[{accountType} account]</p>
          </div>

          {/* Quick Actions */}
          <div style={styles.quickActionsSection}>
            <button
              onClick={() => setCurrentView("password")}
              style={styles.actionButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3182ce"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4299e1"}
            >
              Reset passcode
            </button>
            <button
              onClick={handleChangeEmail}
              style={styles.actionButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#3182ce"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4299e1"}
            >
              Change email
            </button>
          </div>

          {/* Settings Menu */}
          <div style={styles.settingsSection}>
            <h3 style={styles.settingsTitle}>Settings</h3>
            <ul style={styles.settingsMenu}>
              <li style={styles.menuItem}>
                <button
                  onClick={() => setCurrentView("general")}
                  style={styles.menuButton(currentView === "general")}
                  onMouseEnter={(e) => {
                    if (currentView !== "general") {
                      e.currentTarget.style.backgroundColor = "#f7fafc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentView !== "general") {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  General
                </button>
              </li>
              <li style={styles.menuItem}>
                <button
                  onClick={() => setCurrentView("privacy")}
                  style={styles.menuButton(currentView === "privacy")}
                  onMouseEnter={(e) => {
                    if (currentView !== "privacy") {
                      e.currentTarget.style.backgroundColor = "#f7fafc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentView !== "privacy") {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  Privacy
                </button>
              </li>
              <li style={styles.menuItem}>
                <button
                  onClick={() => setCurrentView("recently-viewed")}
                  style={styles.menuButton(currentView === "recently-viewed")}
                  onMouseEnter={(e) => {
                    if (currentView !== "recently-viewed") {
                      e.currentTarget.style.backgroundColor = "#f7fafc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentView !== "recently-viewed") {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  Recently Viewed
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={styles.mainContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
