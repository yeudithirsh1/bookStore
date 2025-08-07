import React, { useState } from 'react';
import './Login.css';

export default function Login({ isAdmin, setIsAdmin }) {
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = () => {
    if (password === 'ye32610!') {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
      alert('התחברת כמנהל בהצלחה!');
    } else {
      alert('סיסמה שגויה!');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    alert('התנתקת בהצלחה!');
  };

  return (
    <div className="login-container">
      {!isAdmin ? (
        <>
          <button className="admin-btn" onClick={() => setShowLogin(!showLogin)}>
            כניסת מנהל
          </button>
          {showLogin && (
            <div className="login-form">
              <input
                type="password"
                placeholder="סיסמת מנהל"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button onClick={handleLogin}>התחבר</button>
            </div>
          )}
        </>
      ) : (
        <div className="admin-status">
          <span>מחובר כמנהל</span>
          <button onClick={handleLogout}>התנתק</button>
        </div>
      )}
    </div>
  );
}