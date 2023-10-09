'use strict';
const dayjs = require('dayjs');

const reservationModel = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    charger_id: { type: DataTypes.INTEGER, allowNull: false },
    renter_id: { type: DataTypes.INTEGER, allowNull: false },
    Provider_id: { type: DataTypes.INTEGER, allowNull: false },
    creation_date: { type: DataTypes.DATE, allowNull: true },
    start_time: { type: DataTypes.STRING, allowNull: false }, // Change data type to STRING
    end_time: { type: DataTypes.STRING, allowNull: false },   // Change data type to STRING
    total_price: { type: DataTypes.FLOAT, allowNull: true },
    reservation_status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'open',
    },
  });

  return Reservation;
};

module.exports = reservationModel;
