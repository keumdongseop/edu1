import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./bookings.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    capacity INTEGER
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    booked_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms (id)
  )`);
  
  db.run(`INSERT OR IGNORE INTO rooms (name, capacity) VALUES 
    ('대회의실', 20)`);
  
  console.log('Database initialized successfully!');
});

db.close();