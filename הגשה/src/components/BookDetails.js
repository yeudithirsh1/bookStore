import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import './BookDetails.css';
import './homePage.css';

export default function BookDetails({ books, setBooks, cart, setCart, isAdmin }) {
  const { id } = useParams();
  const book = books.find(b => b.id === parseInt(id));
  
  const [bookCount, setBookCount] = useState(0);
  
  useEffect(() => {
    if (book) {
      setBookCount(book.b_count || 0);
    }
  }, [book]);
  const [clicked, setClicked] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (books.length === 0) {
      setLoading(true);
      fetch('http://localhost:3001/books')
        .then(res => res.json())
        .then(data => {
          const booksWithId = data.map((book, index) => ({ ...book, id: index + 1 }));
          setBooks(booksWithId);
          setLoading(false);
        })
        .catch(err => {
          console.error('שגיאה בטעינת ספרים:', err);
          setLoading(false);
        });
    }
  }, [books.length, setBooks]);
  
  if (loading || books.length === 0) {
    return <div>Loading...</div>;
  }
  
  // אם הספרים נטענו אבל הספר לא נמצא
  if (!book) {
    return <Navigate to="/404" replace />;
  }

  const deleteBook = () => {
    if (!isAdmin) {
      alert('נדרשת הרשאת מנהל למחיקת ספר!');
      return;
    }
    fetch(`http://localhost:3001/books/${book.id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('מחיקה נכשלה');
        setBooks(prevBooks => prevBooks.filter(b => b.id !== book.id));
      })
      .catch(err => alert("שגיאה במחיקה: " + err.message));
  };

  const updateInventory = (change) => {
    if (!isAdmin) {
      alert('נדרשת הרשאת מנהל לעדכון מלאי!');
      return;
    }
    const newCount = Math.max(0, bookCount + change);
    fetch(`http://localhost:3001/books/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ b_count: newCount }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update inventory');
        setBookCount(newCount);
        setBooks(prevBooks =>
          prevBooks.map(b =>
            b.id === book.id ? { ...b, b_count: newCount } : b
          )
        );
      })
      .catch(err => alert('Error updating inventory: ' + err.message));
  };

  const updateRating = (newRating) => {
    fetch(`http://localhost:3001/books/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: newRating }),
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update rating');
      
      setBooks(prevBooks =>
        prevBooks.map(b => {
          if (b.id !== book.id) return b;
          const newCount = b.ratingCount + 1;
          const newAverage = ((b.rating * b.ratingCount) + newRating) / newCount;
          return {
            ...b,
            ratingCount: newCount,
            rating: newAverage
          };
        })
      );
    })
    .catch(err => alert('Error updating rating: ' + err.message));
  };

  const addToCart = () => {
    if (bookCount === 0) {
      alert('הספר אזל מהמלאי!');
      return;
    }

    const existingItem = cart.find(item => item.id === book.id);
    
    if (existingItem) {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === book.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart(prevCart => [...prevCart, { ...book, quantity: 1 }]);
    }
    
    // עדכון המלאי בשרת
    const newCount = bookCount - 1;
    fetch(`http://localhost:3001/books/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ b_count: newCount }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update inventory');
        setBookCount(newCount);
        setBooks(prevBooks =>
          prevBooks.map(b =>
            b.id === book.id ? { ...b, b_count: newCount } : b
          )
        );
      })
      .catch(err => alert('Error updating inventory: ' + err.message));
    
    alert('הספר נוסף לעגלה!');
  };

  return (
    <div className="book-list">
      <div className={`book-container ${bookCount === 0 ? 'book-out-of-stock' : ''} ${book.discount >= 50 ? 'book-discount' : ''}`}>
        {book.discount > 0 && (
          <div className="sale-tag">{`${book.discount}% הנחה`}</div>
        )}
        <h2>{book.name}</h2>
        <div className="book-info">
          <p><strong>מזהה ספר:</strong> {book.id}</p>
          <p><strong>מחבר:</strong> {book.author || 'אנונימי'}</p>
          <div className="stock-info">
            <p>{bookCount === 0 ? 'הספר אזל מהמלאי' : `במלאי: ${bookCount}`}</p>
          </div>
          <div className="price-section">
            {book.discount > 0 ? (
              <>
                <span className="discounted-price">{`$${((book.price * (1 - book.discount / 100)).toFixed(2))}`}</span>
                <span className="old-price">{`$${book.price}`}</span>
              </>
            ) : (
              <span className="original-price">{`$${book.price}`}</span>
            )}
          </div>
          <div className="categories-section">
            <p>קטגוריות:</p>
            <ul className="category-list">
              {(book.category || []).map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
          <div className="rating-section">
            <div className="rating-display">
              <p>דירוג: {(book.rating || 0).toFixed(2)} ({book.ratingCount || 0} הצבעות)</p>
            </div>
            {!showRating ? (
              <button className="rating-button" onClick={() => setShowRating(true)}>
                דרג ספר זה
              </button>
            ) : (
              <div className="stars-container active">
                <p>בחר דירוג:</p>
                <input
                  type="range"
                  min="1"
                  max="5"
                  className="rating-slider"
                  onChange={(e) => updateRating(Number(e.target.value))}
                />
                <button className="cancel-button" onClick={() => setShowRating(false)}>
                  בטל
                </button>
              </div>
            )}
          </div>
        </div>
        {bookCount === 0 ? (
          <>
            <div className="out-of-stock-message">
              <p>הספר אזל מהמלאי</p>
            </div>
            <div className="button-row">
              <button className="buy-button" onClick={() => updateInventory(1)}>
                + הוסף למלאי
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="button-row">
              <button className="buy-button" onClick={() => updateInventory(1)}>
                + מלאי
              </button>
            </div>
            <div className="button-row">
              <button className="buy-button" onClick={addToCart}>
                הוסף לעגלה
              </button>
              <button 
                className={`like-button ${clicked ? 'liked' : ''}`} 
                onClick={() => setClicked(!clicked)}
              >
                ♥
              </button>
              <button className="delet-button" onClick={deleteBook}>
                מחיקת ספר
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}