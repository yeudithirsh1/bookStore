import { Link, Outlet } from 'react-router-dom';
import Login from './Login';
import './bookLayout.css';



const BooksLayout = ({ isAdmin, setIsAdmin }) => {
  return (
    <div>
      <header className="clean-header">
        <div className="header-container">
          <div className="logo-title">
          <h1 className="brand-title">חנות ספרים</h1>
          </div>
          <nav className="clean-nav">
            <Link to="books" className="nav-item">
              כל הספרים
            </Link>
            <Link to="books/add" className="nav-item">
              הוסף ספר חדש
            </Link>
            <Link to="cart" className="nav-item">
              עגלת קניות 🛒
            </Link>
            <Link to="/" className="nav-item">
              דף הבית
            </Link>
            <Login isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
          </nav>
        </div>
      </header>
      
      {/* כאן יופיע התוכן המשתנה לפי הניתוב */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default BooksLayout;