import { Booking, Room } from '../models/index.mjs';
import { Op } from 'sequelize';

export const getAllBookings = async () => {
  return await Booking.findAll({
    include: [{ model: Room, as: 'room' }]
  });
};

export const getBookingById = async (id) => {
  return await Booking.findByPk(id, {
    include: [{ model: Room, as: 'room' }]
  });
};

export const createBooking = async (bookingData) => {
  return await Booking.create(bookingData);
};

export const updateBooking = async (id, bookingData) => {
  const booking = await Booking.findByPk(id);
  if (!booking) throw new Error('Booking not found');
  return await booking.update(bookingData);
};

export const deleteBooking = async (id) => {
  const booking = await Booking.findByPk(id);
  if (!booking) throw new Error('Booking not found');
  return await booking.destroy();
};

export const checkRoomAvailability = async (roomId, startTime, endTime) => {
  const conflictingBookings = await Booking.findAll({
    where: {
      roomId,
      [Op.or]: [
        { startTime: { [Op.between]: [startTime, endTime] } },
        { endTime: { [Op.between]: [startTime, endTime] } },
        { 
          [Op.and]: [
            { startTime: { [Op.lte]: startTime } },
            { endTime: { [Op.gte]: endTime } }
          ]
        }
      ],
      status: { [Op.not]: 'cancelled' }
    }
  });

  return conflictingBookings.length === 0;
};
