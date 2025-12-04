import { useState } from "react";
import "./StarRating.css";

export default function StarRating({ rating = 0, interactive = false, onChange, size = "medium", showCount = false, reviewCount = 0 }) {
  const [hoverRating, setHoverRating] = useState(0);

  const stars = [1, 2, 3, 4, 5];
  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const handleClick = (star) => {
    if (interactive && onChange) {
      onChange(star);
    }
  };

  const handleMouseEnter = (star) => {
    if (interactive) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const getStarClass = (star) => {
    let className = "star";

    if (displayRating >= star) {
      className += " filled";
    } else if (displayRating > star - 1 && displayRating < star) {
      className += " half";
    }

    if (interactive) {
      className += " interactive";
    }

    return className;
  };

  return (
    <div className={`star-rating ${size}`}>
      <div className="stars">
        {stars.map((star) => (
          <span
            key={star}
            className={getStarClass(star)}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            role={interactive ? "button" : "img"}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            tabIndex={interactive ? 0 : -1}
          >
            ★
          </span>
        ))}
      </div>
      {showCount && reviewCount > 0 && (
        <span className="review-count">({reviewCount})</span>
      )}
      {!showCount && rating > 0 && (
        <span className="rating-number">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
