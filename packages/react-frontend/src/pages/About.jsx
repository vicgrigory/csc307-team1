import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="page-container">
      <section>
        <h1>About Us</h1>
        <p>
          OpenShelf is a free digital library for copyright-free books, music, and media. 
          Our team is dedicated to making open resources accessible to everyone.
        </p>
      </section>

      <section>
        <h2>Our Mission</h2>
        <p>
          Our mission is to democratize access to knowledge and creativity. 
          We aim to provide a safe, organized, and user-friendly platform for exploring and sharing open content.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>Email: support@openshelf.com</p>
      </section>
    </div>
  );
}

