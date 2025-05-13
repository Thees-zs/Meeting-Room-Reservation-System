'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Rooms', [
      {
        name: 'Executive Boardroom',
        capacity: 12,
        location: 'Floor 10',
        status: 'available',
        image: '/images/boardroom.jpg',
        facilities: JSON.stringify(['projector', 'whiteboard', 'video-conferencing', 'catering']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Innovation Lab',
        capacity: 8,
        location: 'Floor 5',
        status: 'available',
        image: '/images/lab.jpg',
        facilities: JSON.stringify(['smart-board', 'video-conferencing', 'prototyping-tools']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Training Room A',
        capacity: 20,
        location: 'Floor 3',
        status: 'available',
        image: '/images/training.jpg',
        facilities: JSON.stringify(['projector', 'whiteboard', 'sound-system']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Small Meeting Room',
        capacity: 4,
        location: 'Floor 2',
        status: 'available',
        image: '/images/meeting.jpg',
        facilities: JSON.stringify(['monitor', 'whiteboard']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Conference Hall',
        capacity: 50,
        location: 'Floor 1',
        status: 'maintenance',
        image: '/images/conference.jpg',
        facilities: JSON.stringify(['projector', 'sound-system', 'recording', 'catering']),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Rooms', null, {});
  }
};
