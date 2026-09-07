-- Notifyr — MySQL schema (Aiven). Run this once against a fresh database.

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  profile_photo_url VARCHAR(500),
  fcm_token VARCHAR(500),
  email_verified BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  global_dnd_schedule JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE qr_codes (
  id VARCHAR(50) PRIMARY KEY,
  status VARCHAR(20) DEFAULT 'unassigned',
  pin_code VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
  id CHAR(36) PRIMARY KEY,
  owner_id CHAR(36) NOT NULL,
  qr_id VARCHAR(50) UNIQUE,
  category VARCHAR(30) NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  item_photo_url VARCHAR(500),
  details JSON,
  private_details JSON,
  status VARCHAR(20) DEFAULT 'active',
  dnd_schedule JSON,
  hide_photo_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id),
  FOREIGN KEY (qr_id) REFERENCES qr_codes(id)
);

CREATE TABLE messages (
  id CHAR(36) PRIMARY KEY,
  item_id CHAR(36) NOT NULL,
  sender_type VARCHAR(10) NOT NULL,
  preset_type VARCHAR(30),
  free_text VARCHAR(150),
  location_lat DOUBLE,
  location_lng DOUBLE,
  read_by_owner BOOLEAN DEFAULT FALSE,
  reply_token VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE message_rate_limits (
  id CHAR(36) PRIMARY KEY,
  item_id CHAR(36) NOT NULL,
  device_hash VARCHAR(100) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE blocked_devices (
  id CHAR(36) PRIMARY KEY,
  owner_id CHAR(36) NOT NULL,
  item_id CHAR(36),
  device_hash VARCHAR(100) NOT NULL,
  blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Helpful indexes not in the original spec but worth having from day one
CREATE INDEX idx_items_owner ON items(owner_id);
CREATE INDEX idx_messages_item ON messages(item_id);
CREATE INDEX idx_ratelimit_lookup ON message_rate_limits(item_id, device_hash, sent_at);
CREATE INDEX idx_blocks_lookup ON blocked_devices(device_hash);
