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

  Reservation.addHook('beforeCreate', async (reservation) => {
    console.log('reservation============>', reservation);
    const now = dayjs();
    const formattedTime = now.format('YYYY-MM-DD HH:mm:ss');
    reservation.setDataValue('creation_date', formattedTime);

    const chargerInstance = await sequelize.models.Charger.findOne({
      where: { id: reservation.charger_id }
    });

    if (chargerInstance) {
      const unitPrice = chargerInstance.price;
      const startTime = dayjs(reservation.start_time, 'HH:mm').format('HH:mm'); // Ensure proper formatting
      const endTime = dayjs(reservation.end_time, 'HH:mm').format('HH:mm');     // Ensure proper formatting
      const start = dayjs(startTime, 'HH:mm');
      const end = dayjs(endTime, 'HH:mm');
      const duration = end.diff(start, 'hour');
      const price = duration * unitPrice;
      reservation.setDataValue('total_price', parseFloat(price));
      reservation.setDataValue('start_time', `${startTime}-${endTime}`); // Format as "00:00-23:59"
      reservation.setDataValue('end_time', '23:59'); // Set end_time to 23:59 as requested
    }
  });

  return Reservation;
};

module.exports = reservationModel;
