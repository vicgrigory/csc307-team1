export default function Profile() {
  return (
    <div className="page-container">
      <h1>User Profile</h1>
      <p>Welcome, [Username]!</p>
      <p>This is where user information will appear.</p>

      <section>
        <h2>Account Info</h2>
        <ul>
          <li>Email: user@example.com</li>
          <li>Member since: Jan 2025</li>
          <li>Favorite Media: Books, Music</li>
        </ul>
      </section>

      <section>
        <h2>Settings</h2>
        <p>Profile settings will go here.</p>
      </section>
    </div>
  );
}

