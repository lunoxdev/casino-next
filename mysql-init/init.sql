CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(12) UNIQUE NOT NULL,
  token VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(255) NOT NULL
);

-- Optional: Seed the database with a default admin user with a token
INSERT INTO players (name, token, refresh_token)
VALUES ('admin', 'admin-token-123', 'admin-refresh-token-456');
