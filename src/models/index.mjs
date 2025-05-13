import { Sequelize, DataTypes } from 'sequelize';
import { readFileSync } from 'fs';
const config = JSON.parse(readFileSync(new URL('../../config/config.json', import.meta.url)));

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    timezone: dbConfig.timezone
  }
);

import roomModel from '../../models/room.js';
import bookingModel from '../../models/booking.js';

export const Room = roomModel(sequelize, DataTypes);
export const Booking = bookingModel(sequelize, DataTypes);

// Setup associations
Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

export async function syncDatabase() {
  await sequelize.sync();
}
