import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.hasMany(models.Booking, {
        foreignKey: 'roomId',
        as: 'bookings'
      });
    }
  }
  Room.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('available', 'maintenance'),
      defaultValue: 'available'
    },
    image: DataTypes.STRING,
    facilities: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};
