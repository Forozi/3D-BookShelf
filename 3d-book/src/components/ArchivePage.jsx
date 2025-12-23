import React, { useState, useRef } from 'react';
import { api } from '../api/api';
import '../styles/ArchivePage.css';

export default function ArchivePage({ data, className, onCoverUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('idle');
  
  const [formData, setFormData] = useState({
    title: data.title,
    author: data.author,
    publishDate: data.publishDate,
    genre: data.genre
  });

  const [newCoverFile, setNewCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCoverFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSave = async () => {
    setStatus('saving');
    
    const updates = { ...formData };
    if (newCoverFile) updates.coverFile = newCoverFile;

    try {
      const res = await api.updateBook(data.id, updates);
      // eslint-disable-next-line react-hooks/immutability
      data.title = formData.title;
      data.author = formData.author;
      data.publishDate = formData.publishDate;
      data.genre = formData.genre;
      
      if (res.newCoverUrl && onCoverUpdate) {
         const fullUrl = `http://localhost:5000/uploads/${res.newCoverUrl}`;
         onCoverUpdate(fullUrl);
      }
      
      setIsEditing(false);
      setStatus('idle');
      setNewCoverFile(null);
    } catch (err) {
      console.error("Update failed", err);
      setStatus('error');
    }
  };

  const handleCancel = () => {
    setFormData({
        title: data.title,
        author: data.author,
        publishDate: data.publishDate,
        genre: data.genre
    });
    setNewCoverFile(null);
    setPreviewUrl(null);
    setIsEditing(false);
  };

  return (
    <div className={className}>
      {/* HEADER SECTION */}
      <div className="archive-header">
        <div className="archive-tag">THÔNG TIN SÁCH</div>
        {!isEditing && (
            <button onClick={() => setIsEditing(true)} title="Edit Details" className="archive-btn-edit">✎</button>
        )}
      </div>

      {/* --- TITLE --- */}
      {isEditing ? (
        <input 
            value={formData.title} 
            onChange={(e) => handleChange('title', e.target.value)}
            className="archive-input-base archive-input-title"
        />
      ) : (
        <h2 className="archive-title">{data.title}</h2>
      )}
      
      {/* --- AUTHOR --- */}
      <div className="archive-author-container">
         {isEditing ? (
             <input 
                value={formData.author} 
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="Author Name"
                className="archive-input-base archive-input-author"
            />
         ) : (
            <p className="archive-author">Tác giả: {data.author}</p>
         )}
      </div>

      {/* --- COVER IMAGE UPLOAD --- */}
      {isEditing && (
        <div className="archive-cover-section">
            <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            {previewUrl ? (
                <div onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer' }}>
                    <img src={previewUrl} alt="Preview" className="archive-cover-preview" />
                    <div className="archive-cover-hint">Ấn để thay đổi thông tin</div>
                </div>
            ) : (
                <button onClick={() => fileInputRef.current.click()} className="archive-btn-upload">
                    Đổi ảnh bìa
                </button>
            )}
        </div>
      )}
      
      {/* --- METADATA TABLE --- */}
      <div className="archive-metadata">
         <p className="archive-meta-row">
            <strong className="archive-meta-label">ID</strong> 
            <span className="archive-meta-value">{data.id}</span>
         </p>
         
         <p className="archive-meta-row">
            <strong className="archive-meta-label">Ngày xuất bản</strong> 
            {isEditing ? (
                <input 
                    value={formData.publishDate}
                    onChange={(e) => handleChange('publishDate', e.target.value)}
                    className="archive-input-base archive-input-small"
                />
            ) : (
                <span style={{ float: 'right' }}>{data.publishDate}</span>
            )}
         </p>

         <p className="archive-meta-row">
            <strong className="archive-meta-label">Thể loại</strong> 
            {isEditing ? (
                 <select 
                    value={formData.genre}
                    onChange={(e) => handleChange('genre', e.target.value)}
                    className="archive-input-base archive-select"
                 >
                    <option value="Hiện thực">Hiện thực</option>
                    <option value="Thơ">Thơ</option>
                    <option value="Tuổi thơ">Tuổi thơ</option>
                    <option value="Trào phúng">Trào phúng</option>
                    <option value="Kinh dị">Kinh dị</option>
                    <option value="Truyện ngắn">Truyện ngắn</option>
                    <option value="Thơ sử thi">Thơ sử thi</option>
                    <option value="Phiêu lưu">Phiêu lưu</option>
                    <option value="Tùy bút">Tùy bút</option>
                 </select>
            ) : (
                <span className="archive-meta-value text">{data.genre}</span>
            )}
         </p>
      </div>

      {/* --- ACTION BUTTONS --- */}
      {isEditing && (
        <div className="archive-actions">
            <button onClick={handleSave} disabled={status === 'saving'} className="archive-btn archive-btn-save">
                {status === 'saving' ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
            <button onClick={handleCancel} className="archive-btn archive-btn-cancel">
                Hủy thay đổi
            </button>
        </div>
      )}

      {!isEditing && (
        <div className="archive-footer">
            <div className="archive-logo-icon">❦</div>
            <p className="archive-logo-text">Sách của tôi</p>
        </div>
      )}
    </div>
  );
}