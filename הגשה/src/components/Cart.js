import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

export default function Cart({ cart, setCart, books, setBooks, mode = 'page' }) {
  const [isOpen, setIsOpen] = useState(false);
  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    
    const currentItem = cart.find(item => item.id === bookId);
    const quantityChange = newQuantity - currentItem.quantity;
    
    // עדכון המלאי בשרת
    const currentBook = books.find(b => b.id === bookId);
    const newInventory = Math.max(0, currentBook.b_count - quantityChange);
    
    fetch(`http://localhost:3001/books/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ b_count: newInventory }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update inventory');
        
        // עדכון המלאי ברשימת הספרים
        setBooks(prevBooks =>
          prevBooks.map(b =>
            b.id === bookId ? { ...b, b_count: newInventory } : b
          )
        );
        
        // עדכון הכמות בעגלה
        setCart(prevCart =>
          prevCart.map(item =>
            item.id === bookId ? { ...item, quantity: newQuantity } : item
          )
        );
      })
      .catch(err => alert('Error updating inventory: ' + err.message));
  };

  const removeFromCart = (bookId) => {
    const itemToRemove = cart.find(item => item.id === bookId);
    if (itemToRemove) {
      // החזרת הכמות למלאי
      const currentBook = books.find(b => b.id === bookId);
      const newInventory = currentBook.b_count + itemToRemove.quantity;
      
      fetch(`http://localhost:3001/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ b_count: newInventory }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update inventory');
          
          setBooks(prevBooks =>
            prevBooks.map(b =>
              b.id === bookId ? { ...b, b_count: newInventory } : b
            )
          );
        })
        .catch(err => alert('Error updating inventory: ' + err.message));
    }
    
    setCart(prevCart => prevCart.filter(item => item.id !== bookId));
  };

  const clearCart = () => {
    // החזרת כל הפריטים למלאי
    cart.forEach(item => {
      const currentBook = books.find(b => b.id === item.id);
      const newInventory = currentBook.b_count + item.quantity;
      
      fetch(`http://localhost:3001/books/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ b_count: newInventory }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update inventory');
          
          setBooks(prevBooks =>
            prevBooks.map(b =>
              b.id === item.id ? { ...b, b_count: newInventory } : b
            )
          );
        })
        .catch(err => alert('Error updating inventory: ' + err.message));
    });
    
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.discount > 0 
        ? item.price * (1 - item.discount / 100) 
        : item.price;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  // מצב עמוד מלא
  if (mode === 'page') {
    if (cart.length === 0) {
      return (
        <div className="cart-container">
          <h2>עגלת הקניות שלך</h2>
          <div className="empty-cart">
            <p>העגלה ריקה</p>
            <Link to="/books" className="continue-shopping">
              המשך קניות
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="cart-container">
        <h2>עגלת הקניות שלך</h2>
        
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h3>{item.name}</h3>
                <p>מחבר: {item.author || 'אנונימי'}</p>
                {item.discount > 0 && (
                  <span className="discount-badge">{item.discount}% הנחה</span>
                )}
              </div>
              
              <div className="item-price">
                {item.discount > 0 ? (
                  <div>
                    <span className="discounted-price">
                      ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                    </span>
                    <span className="original-price">${item.price}</span>
                  </div>
                ) : (
                  <span className="price">${item.price}</span>
                )}
              </div>
              
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>
              
              <div className="item-total">
                ${((item.discount > 0 
                  ? item.price * (1 - item.discount / 100) 
                  : item.price) * item.quantity).toFixed(2)}
              </div>
              
              <button 
                className="remove-item" 
                onClick={() => removeFromCart(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <div className="total-price">
            <h3>סכום כולל: ${getTotalPrice()}</h3>
          </div>
          
          <div className="cart-actions">
            <button className="clear-cart" onClick={clearCart}>
              נקה עגלה
            </button>
            <button className="checkout">
              מעבר לתשלום
            </button>
          </div>
          
          <Link to="/books" className="continue-shopping">
            המשך קניות
          </Link>
        </div>
      </div>
    );
  }

  // מצב צף
  return (
    <>
      <div className="floating-cart-button" onClick={() => setIsOpen(!isOpen)}>
        🛒
        {cart.length > 0 && (
          <span className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
        )}
      </div>

      {isOpen && (
        <div className="floating-cart-overlay" onClick={() => setIsOpen(false)}>
          <div className="floating-cart-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3>עגלת קניות</h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart-message">
                <p>העגלה ריקה</p>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {cart.map(item => (
                    <div key={item.id} className="mini-cart-item">
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>{item.author || 'אנונימי'}</p>
                        <div className="item-price">
                          {item.discount > 0 ? (
                            <span className="discounted">
                              ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                            </span>
                          ) : (
                            <span>${item.price}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      
                      <button 
                        className="remove-btn" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="total">
                    <strong>סכום כולל: ${getTotalPrice()}</strong>
                  </div>
                  <div className="cart-actions">
                    <Link 
                      to="/cart" 
                      className="view-cart-btn"
                      onClick={() => setIsOpen(false)}
                    >
                      צפה בעגלה המלאה
                    </Link>
                    <button className="checkout-btn">
                      מעבר לתשלום
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}