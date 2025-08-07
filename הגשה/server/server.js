const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'book.json');

// קריאת כל הספרים מהקובץ – בזמן אמת
app.get('/books', (req, res) => {
  try {
    const books = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בקריאת קובץ הספרים' });
  }
});

// הוספת ספר חדש ושמירה לקובץ
app.post('/books', (req, res) => {
  const newBook = req.body;

  if (!newBook.name || !newBook.price) {
    return res.status(400).json({ error: 'חסר שם או מחיר' });
  }

  try {
    const books = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    books.push(newBook);
    fs.writeFileSync(dataPath, JSON.stringify(books, null, 2));
    res.status(201).json({ message: 'Book added', book: newBook });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בעדכון קובץ הספרים' });
  }
});

// מחיקת ספר
app.delete('/books/:id', (req, res) => {
  const bookIndex = parseInt(req.params.id) - 1; // המרה לאינדקס (id מתחיל מ-1)

  try {
    const books = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    if (bookIndex < 0 || bookIndex >= books.length) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    books.splice(bookIndex, 1); // מחיקה לפי אינדקס
    fs.writeFileSync(dataPath, JSON.stringify(books, null, 2));
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה במחיקת הספר' });
  }
});

// עדכון ספר קיים (לדוגמה עדכון count)
app.put('/books/:id', (req, res) => {
  const bookIndex = parseInt(req.params.id) - 1; // המרה לאינדקס
  const updateData = req.body;

  try {
    const books = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    if (bookIndex < 0 || bookIndex >= books.length) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    books[bookIndex] = { ...books[bookIndex], ...updateData };
    fs.writeFileSync(dataPath, JSON.stringify(books, null, 2));
    res.status(200).json({ message: 'Book updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בעדכון הספר' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
