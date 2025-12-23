-- 1. Create Database
CREATE DATABASE IF NOT EXISTS bookdb;
USE bookdb;

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Books Table
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  genre VARCHAR(100),
  publish_date VARCHAR(20),
  notes TEXT,
  cover_url VARCHAR(255),
  rating INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create a Default User (Username: admin@gmail.com, Password: 123)
INSERT INTO users (id, username, password) VALUES (1, 'admin', '123') 
ON DUPLICATE KEY UPDATE id=1;

-- 5. Populate Books (All using book1.webp)
INSERT INTO books (user_id, title, author, genre, publish_date, notes, cover_url, rating, is_completed) VALUES
(1, 'Dế Mèn phiêu lưu ký', 'Tô Hoài', 'Phiêu lưu', '1941', 'Kinh điển.', 'book1.webp', 5, 1),
(1, 'Số đỏ', 'Vũ Trọng Phụng', 'Trào phúng', '1936', 'Hài hước.', 'book1.webp', 5, 1),
(1, 'Truyện Kiều', 'Nguyễn Du', 'Thơ sử thi', '1820', 'Thơ nôm.', 'book1.webp', 4, 1),
(1, 'Mắt biếc', 'Nguyễn Nhật Ánh', 'Tuổi thơ', '1990', 'Buồn.', 'book1.webp', 3, 1),
(1, 'Vợ nhặt', 'Kim Lân', 'Truyện ngắn', '1962', 'Nạn đói.', 'book1.webp', 5, 1),
(1, 'Tắt đèn', 'Ngô Tất Tố', 'Hiện thực', '1937', 'Chị Dậu.', 'book1.webp', 2, 0),
(1, 'Đất rừng phương Nam', 'Đoàn Giỏi', 'Phiêu lưu', '1957', 'Hùng vĩ.', 'book1.webp', 4, 1),
(1, 'Sóng', 'Xuân Quỳnh', 'Thơ', '1967', 'Tình yêu.', 'book1.webp', 5, 1),
(1, 'Chí Phèo', 'Nam Cao', 'Hiện thực', '1941', 'Thị Nở.', 'book1.webp', 5, 1),
(1, 'Kính vạn hoa', 'Nguyễn Nhật Ánh', 'Tuổi thơ', '1995', 'Học trò.', 'book1.webp', 4, 1),
(1, 'Tây Tiến', 'Quang Dũng', 'Thơ', '1948', 'Bi tráng.', 'book1.webp', 3, 0),
(1, 'Lão Hạc', 'Nam Cao', 'Hiện thực', '1943', 'Cậu Vàng.', 'book1.webp', 5, 1),
(1, 'Chiếc lược ngà', 'Nguyễn Quang Sáng', 'Truyện ngắn', '1966', 'Cha con.', 'book1.webp', 4, 1),
(1, 'Tuổi thơ dữ dội', 'Phùng Quán', 'Tuổi thơ', '1988', 'Chiến tranh.', 'book1.webp', 5, 1),
(1, 'Hà Nội băm sáu phố phường', 'Thạch Lam', 'Tùy bút', '1943', 'Ẩm thực.', 'book1.webp', 4, 1),
(1, 'Lục Vân Tiên', 'Nguyễn Đình Chiểu', 'Thơ sử thi', '1850', 'Đạo lý.', 'book1.webp', 2, 0),
(1, 'Bỉ vỏ', 'Nguyên Hồng', 'Hiện thực', '1938', 'Xã hội đen.', 'book1.webp', 3, 1),
(1, 'Người lái đò sông Đà', 'Nguyễn Tuân', 'Tùy bút', '1960', 'Sông nước.', 'book1.webp', 2, 0),
(1, 'Cho tôi xin một vé đi tuổi thơ', 'Nguyễn Nhật Ánh', 'Tuổi thơ', '2008', 'Ký ức.', 'book1.webp', 4, 1),
(1, 'Vội vàng', 'Xuân Diệu', 'Thơ', '1938', 'Mùa xuân.', 'book1.webp', 5, 1),
(1, 'Cánh đồng bất tận', 'Nguyễn Ngọc Tư', 'Truyện ngắn', '2005', 'Miền Tây.', 'book1.webp', 5, 1),
(1, 'Kỹ nghệ lấy tây', 'Vũ Trọng Phụng', 'Trào phúng', '1934', 'Phóng sự.', 'book1.webp', 3, 1),
(1, 'Việt Bắc', 'Tố Hữu', 'Thơ', '1954', 'Kháng chiến.', 'book1.webp', 4, 1),
(1, 'Đời thừa', 'Nam Cao', 'Hiện thực', '1943', 'Văn chương.', 'book1.webp', 4, 0),
(1, 'Tôi thấy hoa vàng trên cỏ xanh', 'Nguyễn Nhật Ánh', 'Tuổi thơ', '2010', 'Anh em.', 'book1.webp', 3, 1),
(1, 'Làng', 'Kim Lân', 'Truyện ngắn', '1948', 'Yêu nước.', 'book1.webp', 4, 1),
(1, 'Chinh phụ ngâm', 'Đặng Trần Côn', 'Thơ', '1741', 'Cổ điển.', 'book1.webp', 3, 0),
(1, 'Bước đường cùng', 'Nguyễn Công Hoan', 'Hiện thực', '1938', 'Nông dân.', 'book1.webp', 2, 0),
(1, 'Tràng giang', 'Huy Cận', 'Thơ', '1939', 'Thiên nhiên.', 'book1.webp', 4, 1),
(1, 'Chuyện con mèo dạy hải âu bay', 'Luis Sepúlveda', 'Tuổi thơ', '1996', 'Nhân văn.', 'book1.webp', 5, 1);