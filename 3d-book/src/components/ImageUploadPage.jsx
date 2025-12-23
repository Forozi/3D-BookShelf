import React, { useRef } from 'react';
import '../styles/ImageUploadPage.css';

export default function ImageUploadPage({ className, coverUrl, onUpload, onConfirm, onClose }) {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpload(url);
    }
  };

  return (
    <div className={`${className} upload-wrapper`}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      <div 
        onClick={() => fileInputRef.current.click()}
        className={`upload-area ${coverUrl ? 'has-image' : 'empty'}`}
      >
        {coverUrl ? (
            <img src={coverUrl} alt="Cover Preview" className="upload-preview" />
        ) : (
            <>
                <div className="upload-icon">📷</div>
                <p className="upload-text">CHỌN BÌA ẢNH</p>
            </>
        )}
      </div>

      <div className="upload-actions">
        <button onClick={onConfirm} className="btn-confirm">
            THÊM VÀO TỦ SÁCH
        </button>
        <button onClick={onClose} className="btn-cancel">
            HỦY
        </button>
      </div>
    </div>
  );
}