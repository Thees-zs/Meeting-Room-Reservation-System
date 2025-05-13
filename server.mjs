import express from 'express';
import cors from 'cors';
import { syncDatabase, Room, Booking } from './src/models/index.mjs';
import roomRoutes from './src/routes/roomRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

// Sync database and start server
syncDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
