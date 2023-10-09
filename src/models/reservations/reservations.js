"use strict";


const reservationModel = (sequelize, DataTypes) => sequelize.define('Reservation', {
  charger_id: { type: DataTypes.INTEGER, allowNull: false },
  renter_id: { type: DataTypes.INTEGER, allowNull: false },
  Provider_id: { type: DataTypes.INTEGER, allowNull: false },
  startTime: { type: DataTypes.STRING, allowNull: false }, // Change data type to DATE
  endTime: { type: DataTypes.STRING, allowNull: false },   // Change data type to DATE
  total_price: { type: DataTypes.FLOAT, allowNull: true },
  reservation_status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'open',
  },
});

module.exports = reservationModel;
