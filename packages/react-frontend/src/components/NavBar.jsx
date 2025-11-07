import { Link } from "react-router-dom";

export default function NavBar({ current }) {
  return (
    <nav>
      {/* Home is always shown */}
      <Link to="/">Home</Link> | 

      {/* Only show About if the current page is Home or About */}
      {current !== "profile" && <><Link to="/about">About</Link> | </>}

      {/* Only show Profile if the current page is Home or Profile */}
      {current !== "about" && <Link to="/profile">Profile</Link>}
    </nav>
  );
}

