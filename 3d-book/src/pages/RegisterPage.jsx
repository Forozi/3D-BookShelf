// --- START OF FILE src/RegisterPage.jsx ---
import React, { useState } from 'react';
import { api } from '../api/api';

export default function RegisterPage({ onRegisterSuccess, onCancel }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.register(formData.email, formData.password);
      setLoading(false);
      
      if (res.success) {
        alert("Registration Successful! Please Login.");
        onRegisterSuccess();
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err) {
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
    border: '2px solid #355e3b', borderRadius: '2px',
    fontFamily: "'Georgia', serif", textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
  };

  const inputStyle = {
    width: '100%', padding: '12px', margin: '8px 0',
    border: '1px solid #ccc', background: '#fafafa',
    fontFamily: 'inherit', boxSizing: 'border-box'
  };

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#355e3b', margin: '0 0 20px 0', letterSpacing: '1px' }}>NEW MEMBERSHIP</h2>
        
        {error && <div style={{color: 'red', fontSize: '12px', marginBottom: '10px'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input 
            name="email"
            type="text" 
            placeholder="Choose Username" 
            style={inputStyle}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input 
            name="password"
            type="password" 
            placeholder="Create Password" 
            style={inputStyle}
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '12px', marginTop: '20px',
              background: '#355e3b', color: '#fff', border: 'none',
              cursor: loading ? 'wait' : 'pointer', 
              fontWeight: 'bold', letterSpacing: '1px', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "PROCESSING..." : "REGISTER"}
          </button>
        </form>

        <p 
          onClick={onCancel}
          style={{ marginTop: '20px', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', color: '#555' }}
        >
          Return to Login
        </p>
      </div>
    </div>
  );
}