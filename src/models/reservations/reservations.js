'use strict';
const dayjs = require('dayjs');

const reservationModel = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    charger_id: { type: DataTypes.INTEGER, allowNull: false },
    renter_id: { type: DataTypes.INTEGER, allowNull: false },
    Provider_id: { type: DataTypes.INTEGER, allowNull: false },
    creation_date: { type: DataTypes.DATE, allowNull: true },
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: false },
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
      const start = dayjs(reservation.start_time);
      const end = dayjs(reservation.end_time);
      const duration = end.diff(start, 'hour');
      const price = duration * unitPrice;
      reservation.setDataValue('total_price', parseFloat(price));
    }
  });

  return Reservation;
};

module.exports = reservationModel;


