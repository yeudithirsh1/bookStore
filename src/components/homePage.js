import { Link } from 'react-router-dom';
import './homePage.css';

const HomePage = () => (
  <div className="homepage-container">
    <div className="welcome-section">
      <h1 className="welcome-title">ברוכים הבאים</h1>
      <p className="welcome-subtitle">גלו את עולם הספרים שלנו</p>
      
      <Link to="books" className="enter-store-link">
        <span className="arrow">←</span>
        <span>כניסה לחנות</span>
      </Link>
    </div>
  </div>
);

export default HomePage;