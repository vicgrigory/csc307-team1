// src/pages/Home.jsx
export default function Home() {
  // Example "Today's Pick" data (replace with dynamic content later)
  const todaysPick = {
    image: "https://via.placeholder.com/200x300", // placeholder image
    title: "Pride and Prejudice",
    author: "Jane Austen"
  };

  return (
    <div className="page-container">
      <h1>Welcome to OpenShelf</h1>
      <p>This is the home page of your digital library.</p>

      {/* Today's Pick Section */}
      <section>
        <h2>Today's Pick</h2>
        <div className="todays-pick">
          <img 
            src={todaysPick.image} 
            alt={todaysPick.title} 
            className="todays-pick-image"
          />
          <p className="todays-pick-title">{todaysPick.title}</p>
          <p className="todays-pick-author">{todaysPick.author}</p>
        </div>
      </section>
    </div>
  );
}

