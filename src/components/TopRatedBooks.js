import React from 'react';
import { Link } from 'react-router-dom';
import './TopRatedBooks.css';

export default function TopRatedBooks({ books }) {
  const topRatedBooks = books
    .filter(book => book.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  if (topRatedBooks.length === 0) {
    return null;
  }

  return (
    <div className="top-rated-section">
      <h3>ספרים עם הדירוגים הגבוהים ביותר</h3>
      <ul className="top-rated-list">
        {topRatedBooks.map((book) => (
          <li key={book.id}>
            <div className="top-rated-item">
              <Link to={`/book/${book.id}`} className="top-rated-link">
                {book.name} - {book.author}
              </Link>
              <div className="rating-display">
                דירוג: <span className="rating-value">{(book.rating || 0).toFixed(1)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
