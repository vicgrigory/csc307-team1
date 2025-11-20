import "./Home.css";
import { Link } from "react-router-dom";
import logo from "../assets/OpenShelf-Logo.png";
import profile_pic from "../assets/Profile-Picture.png";

export default function Home() {
  return (
    <div className="page-container">
      <main className="home-page-content">
        <section className="home-hero">
          <h1>Welcome to OpenShelf!</h1>
          <p>
            OpenShelf is a student-driven digital library where you can upload, share,
            and discover textbooks, research papers, videos, and other academic media,
            designed by students, for students.
          </p> 
          <p>
            Feel free to dive in, share your knowledge,
            and discover something new today - access to academic materials has never been easier!
          </p>
        </section>
      </main>
    </div>
  );
}

