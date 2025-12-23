import React, { useState } from 'react';
import '../styles/JournalPage.css';

export default function JournalPage({ data, className, onSave, onClose }) {
  const [rating, setRating] = useState(data.rating || 0);
  const [isCompleted, setIsCompleted] = useState(data.is_completed || false);
  // eslint-disable-next-line no-empty-pattern
  const [] = useState(data.notes || "");
  
  const handleRating = (value) => {
    setRating(value);
    // eslint-disable-next-line react-hooks/immutability
    data.rating = value; 
  };

  const toggleCompleted = () => {
    const newValue = !isCompleted;
    setIsCompleted(newValue);
    // eslint-disable-next-line react-hooks/immutability
    data.is_completed = newValue;
  };

  return (
    <div className={className}>
      <h3 className="journal-header">Ghi chú cá nhân</h3>
      
      <textarea 
        defaultValue={data.notes}
        placeholder="Ghi lại suy nghĩ của bạn ở đây..."
        className="journal-textarea"
        // eslint-disable-next-line react-hooks/immutability
        onChange={(e) => data.notes = e.target.value}
      />

      <div className="journal-footer">
         <div className="journal-rating-section">
            <label className="journal-rating-label">Đánh giá cá nhân:</label>
            <div className="journal-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`journal-star ${star <= rating ? 'active' : 'inactive'}`}
                  title={`${star} Stars`}
                >
                  ★
                </span>
              ))}
            </div>
         </div>
         
         <div className="journal-completion-container">
            <button
              onClick={toggleCompleted}
              className={`journal-btn-completion ${isCompleted ? 'completed' : 'incomplete'}`}
            >
              {isCompleted ? "Đã Hoàn Thành" : "Chưa Hoàn Thành"}
            </button>
         </div>

         <div className="journal-actions">
            <button onClick={onSave} className="journal-btn">
              Lưu
            </button>
            <button onClick={onClose} className="journal-btn journal-btn-close">
              Đóng sách
            </button>
         </div>
      </div>
    </div>
  );
}