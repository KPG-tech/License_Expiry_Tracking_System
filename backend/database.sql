-- Create Database
CREATE DATABASE IF NOT EXISTS license_tracker;
USE license_tracker;

-- 1. Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Providers table (e.g. Microsoft, Adobe)
CREATE TABLE IF NOT EXISTS providers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  license_key VARCHAR(255) NOT NULL,
  provider_id INT,
  provider_name VARCHAR(100), -- Denormalized for simpler queries or fallback
  expiry_date DATE NOT NULL,
  status ENUM('Valid', 'Expiring Soon', 'Expired') DEFAULT 'Valid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE SET NULL
);

-- Seed Data (Development use only)
-- Password for the admin is 'admin123' (hashed via bcrypt)
INSERT IGNORE INTO users (username, password, role) VALUES 
('admin', '$2a$10$wT8vI8eJ.8h2i3g.g5G3f.yB.v.B0Lq1Y2N6.n5iUeO.rCjT6XmH6', 'admin');

INSERT IGNORE INTO providers (name) VALUES ('Microsoft'), ('Adobe'), ('Autodesk');

INSERT INTO licenses (name, license_key, provider_name, expiry_date, status) VALUES 
('Office 365 E3', 'ABCD-EFGH-IJKL-MNOP', 'Microsoft', DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 'Valid'),
('Adobe Creative Cloud', '1234-5678-9012-3456', 'Adobe', DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'Expiring Soon'),
('AutoCAD 2024', 'AUTOCAD-KEY-789', 'Autodesk', DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'Expired');
