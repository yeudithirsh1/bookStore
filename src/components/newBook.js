import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import categories from '../categories';
import './newBook.css';

export default function NewBook({ books, setBooks, isAdmin }) {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [count, setCount] = useState('');
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleCategory = (value) => {
    setCategory(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  };

  const addBook = () => {
    if (!isAdmin) {
      alert('נדרשת הרשאת מנהל להוספת ספר!');
      return;
    }
    if (!name.trim()) {
      alert('חובה למלא שם ספר');
      return;
    }
    if (!price || price <= 0) {
      alert('חובה למלא מחיר תקין');
      return;
    }

    const newBook = {
      name: name.trim(),
      author: author.trim() === '' ? 'אנונימי' : author.trim(),
      price: Number(price),
      discount: Number(discount) || 0,
      b_count: Number(count) || 0,
      category,
      rating: 0,
      ratingCount: 0
    };

    setIsLoading(true);

    fetch('http://localhost:3001/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add book');
        return res.json();
      })
      .then(data => {
        const bookWithId = { ...data.book, id: books.length + 1 };
        setBooks(prevBooks => [...prevBooks, bookWithId]);
        setIsLoading(false);
        
        // איפוס השדות
        setName('');
        setAuthor('');
        setPrice('');
        setDiscount('');
        setCount('');
        setCategory([]);
        
        alert('הספר נוסף בהצלחה!');
        navigate('/books');
      })
      .catch(err => {
        setIsLoading(false);
        alert('שגיאה בהוספת הספר: ' + err.message);
      });
  };

  return (
    <div className='add-page'>
      <div className="add-container">
        <div className="add-header">
          <h1>הוספת ספר חדש</h1>
          <p>הוסף ספר חדש לאוסף שלנו</p>
        </div>

        <form className="add-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>שם הספר *</label>
            <input 
              type="text"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="הכנס את שם הספר" 
              required
            />
          </div>
          
          <div className="form-group">
            <label>שם הסופר</label>
            <input 
              type="text"
              value={author} 
              onChange={(e) => setAuthor(e.target.value)} 
              placeholder="הכנס את שם הסופר" 
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>מחיר *</label>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="₪" 
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label>הנחה %</label>
              <input 
                type="number" 
                value={discount} 
                onChange={(e) => setDiscount(e.target.value)} 
                placeholder="0-100" 
                min="0"
                max="100"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>כמות במלאי</label>
            <input 
              type="number" 
              value={count} 
              onChange={(e) => setCount(e.target.value)} 
              placeholder="כמות זמינה" 
              min="0"
            />
          </div>

          <div className="form-group">
            <label>קטגוריות</label>
            <div className="categories-grid">
              {Object.entries(categories).map(([key, label]) => (
                <label key={key} className="category-item">
                  <input
                    type="checkbox"
                    value={key}
                    checked={category.includes(key)}
                    onChange={() => toggleCategory(key)}
                  />
                  <span className="category-label">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="button" className="submit-btn" onClick={addBook} disabled={isLoading}>
            {isLoading ? 'מוסיף ספר...' : 'הוסף ספר'}
          </button>
        </form>
      </div>
    </div>
  );
}