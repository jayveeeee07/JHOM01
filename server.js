const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load data
function loadDB() {
  return JSON.parse(fs.readFileSync('db.json', 'utf8'));
}

// Save data
function saveDB(data) {
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
}

// Get all rooms
app.get('/rooms', (req, res) => {
  const db = loadDB();
  res.json(db.rooms);
});

// Get all bookings
app.get('/bookings', (req, res) => {
  const db = loadDB();
  res.json(db.bookings);
});

// Add a booking
app.post('/bookings', (req, res) => {
  const db = loadDB();
  const newBooking = { id: Date.now(), status: 'Pending', ...req.body };
  db.bookings.push(newBooking);
  saveDB(db);
  res.json({ success: true, booking: newBooking });
});

// Update booking status
app.patch('/bookings/:id', (req, res) => {
  const db = loadDB();
  const booking = db.bookings.find(b => b.id == req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  if (req.body.status) booking.status = req.body.status;
  if (req.body.pin) booking.pin = req.body.pin;

  saveDB(db);
  res.json({ success: true, booking });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
