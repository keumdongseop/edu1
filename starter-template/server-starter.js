import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./bookings.db');

// TODO: Implement GET /api/rooms endpoint
// Should return all rooms from the database
app.get('/api/rooms', (req, res) => {
  // Your code here
});

// TODO: Implement GET /api/bookings endpoint
// Should return all bookings ordered by date and start_time
app.get('/api/bookings', (req, res) => {
  // Your code here
});

// TODO: Implement POST /api/bookings endpoint
// Should create a new booking after checking for conflicts
app.post('/api/bookings', (req, res) => {
  const { room_id, date, start_time, end_time, booked_by } = req.body;
  
  // Your code here:
  // 1. Check if the time slot is already booked
  // 2. If not, create the booking
  // 3. Return appropriate response
});

// TODO: Implement DELETE /api/bookings/:id endpoint
// Should delete a booking by its ID
app.delete('/api/bookings/:id', (req, res) => {
  // Your code here
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});