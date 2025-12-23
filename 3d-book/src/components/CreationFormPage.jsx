import React from 'react';
import '../styles/CreationFormPage.css';

export default function CreationFormPage({ className, formData, onChange }) {
  return (
    <div className={className}>
      <h3 className="creation-header">THÊM SÁCH MỚI</h3>
      
      <label className="creation-label">TIÊU ĐỀ</label>
      <input 
        type="text" 
        value={formData.title} 
        onChange={(e) => onChange('title', e.target.value)}
        placeholder="Nhập tiêu đề sách..."
        className="creation-input"
      />

      <label className="creation-label">TÁC GIẢ</label>
      <input 
        type="text" 
        value={formData.author} 
        onChange={(e) => onChange('author', e.target.value)}
        placeholder="Nhập tên tác giả..."
        className="creation-input"
      />

      <div className="creation-row">
          <div className="creation-col">
            <label className="creation-label">NĂM XUẤT BẢN</label>
            <input 
                type="text" 
                value={formData.publishDate} 
                onChange={(e) => onChange('publishDate', e.target.value)}
                placeholder="YYYY"
                className="creation-input"
            />
          </div>
          <div className="creation-col">
            <label className="creation-label">THỂ LOẠI</label>
            <select 
                value={formData.genre} 
                onChange={(e) => onChange('genre', e.target.value)}
                className="creation-input"
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
          </div>
      </div>

      <label className="creation-label">GHI CHÚ / ĐÁNH GIÁ</label>
      <textarea 
        value={formData.notes}
        onChange={(e) => onChange('notes', e.target.value)}
        placeholder="Ghi chú ngắn gọn..."
        className="creation-textarea"
      />
    </div>
  );
}