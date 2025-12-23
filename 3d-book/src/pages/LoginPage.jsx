// --- START OF FILE src/LoginPage.jsx ---
import React, { useState } from 'react';
import { api } from '../api/api'; // Import the API

export default function LoginPage({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login(email, password);
      setLoading(false);
      
      if (res.success) {
        onLogin(res.user);
      } else {
        setError(res.message || "Login failed");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setLoading(false);
      setError("Server connection failed");
    }
  };

  const overlayStyle = {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.8)', zIndex: 900,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    backdropFilter: 'blur(8px)'
  };

  const cardStyle = {
    background: '#fffbf0', padding: '40px', width: '350px',
    border: '1px solid #8b0000', borderRadius: '2px',
    fontFamily: "'Georgia', serif", textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
  };

  const inputStyle = {
    width: '100%', padding: '12px', margin: '8px 0',
    border: '1px solid #ccc', background: '#fafafa',
    fontFamily: 'inherit', boxSizing: 'border-box', color: '#000'
  };

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#8b0000', margin: '0 0 20px 0', letterSpacing: '2px', fontSize: '24px' }}>
          ĐĂNG NHẬP
        </h2>
        
        {error && <div style={{color: 'red', fontSize: '12px', marginBottom: '10px'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input 
            type="text" // changed from email to text to match username/email flexibility
            placeholder="Email" 
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Mật khẩu" 
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '12px', marginTop: '20px',
              background: '#222', color: '#fff', border: 'none',
              cursor: loading ? 'wait' : 'pointer', 
              fontWeight: 'bold', letterSpacing: '1px', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "ĐANG XÁC THỰC..." : "TRUY CẬP KỆ SÁCH"}
          </button>
        </form>

        <p 
          onClick={onSwitchToRegister}
          style={{ marginTop: '20px', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', color: '#555' }}
        >
          Chưa có tài khoản? Đăng ký ngay
        </p>
      </div>
    </div>
  );
}