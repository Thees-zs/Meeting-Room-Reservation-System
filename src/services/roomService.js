import { Room } from '../models/index.mjs';

export const getAllRooms = async () => {
  return await Room.findAll();
};

export const getRoomById = async (id) => {
  return await Room.findByPk(id);
};

export const createRoom = async (roomData) => {
  return await Room.create(roomData);
};

export const updateRoom = async (id, roomData) => {
  const room = await Room.findByPk(id);
  if (!room) throw new Error('Room not found');
  return await room.update(roomData);
};

export const deleteRoom = async (id) => {
  const room = await Room.findByPk(id);
  if (!room) throw new Error('Room not found');
  return await room.destroy();
};
