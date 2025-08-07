import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopRatedBooks from './TopRatedBooks';
import './BooksList.css';
import './homePage.css';

export default function BooksList({ books, setBooks }) {
  useEffect(() => {
    fetch('http://localhost:3001/books')
      .then(res => res.json())
      .then(data => {
        const booksWithId = data.map((book, index) => ({ ...book, id: index + 1 }));
        setBooks(booksWithId);
      })
      .catch(err => {
        console.error('שגיאה בטעינת ספרים:', err);
        alert('שגיאה בטעינת הספרים');
      });
  }, [setBooks]);

  return (
    <div className="books-list">
      <TopRatedBooks books={books} />

      <h2>רשימת ספרים</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link to={`/book/${book.id}`} className="book-link">
              {book.name}
            </Link>
            <div className="book-author">
              {book.author || 'אנונימי'}
            </div>
            <Link to={`/book/${book.id}`}>
              <button className="apply-button">הצג פרטים</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
