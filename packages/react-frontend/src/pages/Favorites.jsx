import React from "react";

export default function Favorites() {
  const favorites = [
    { id: 1, title: "Intro to Algorithms", type: "Textbook", author: "CLRS", image: "https://via.placeholder.com/200x280?text=Algorithms" },
    { id: 2, title: "Discrete Math Notes", type: "Notes", author: "Christopher Siu", image: "https://via.placeholder.com/200x280?text=Discrete+Math" },
    { id: 3, title: "Operating Systems Summary", type: "PDF", author: "Peterson", image: "https://via.placeholder.com/200x280?text=OS" },
  ];

  return (
    <div className="page-container favorites-page">
      <h1 className="favorites-title">Your Favorites</h1>

      <div className="favorites-grid">
        {favorites.map(item => (
          <div key={item.id} className="favorites-card">
            <img src={item.image} alt={item.title} className="favorites-thumb" />
            <h3 className="favorites-item-title">{item.title}</h3>
            <p className="favorites-meta">{item.type} • {item.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

