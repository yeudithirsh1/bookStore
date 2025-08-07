import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import './components/homePage.css';
import HomePage from './components/homePage';
import BookLayout from './components/bookLayout';
import BooksList from './components/BooksList';
import BookDetails from './components/BookDetails';
import NewBook from './components/newBook';
import Cart from './components/Cart';
import Login from './components/Login';
import ErrorPage from './components/ErrorPage';

function App() {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<BookLayout isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}>
          <Route index element={<HomePage />} />
          <Route path="books" element={
            <div>
              <BooksList books={books} setBooks={setBooks} />
            </div>
          } />
          <Route path="book/:id" element={
            <BookDetails books={books} setBooks={setBooks} cart={cart} setCart={setCart} isAdmin={isAdmin} />
          } />
          <Route path="books/add" element={
            <NewBook books={books} setBooks={setBooks} isAdmin={isAdmin} />
          } />
          <Route path="cart" element={
            <Cart cart={cart} setCart={setCart} books={books} setBooks={setBooks} mode="page" />
          } />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      <Cart cart={cart} setCart={setCart} books={books} setBooks={setBooks} mode="floating" />
    </>
  );
}

export default App;
