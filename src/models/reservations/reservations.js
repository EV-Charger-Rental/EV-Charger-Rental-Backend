// +------------------------+
// |      Reservation       |
// +------------------------+
// | id (PK)                |
// | charger_id (FK)        |
// | renter_id (FK)         |
// | shipper_id (FK)        |
// | start_time             |
// | end_time               |
// | total_price            |
// +------------------------+

'use strict';

const reservationModel = (sequelize, DataTypes) => sequelize.define('Reservation', {
    charger_id: { type: DataTypes.INTEGER, required: true },
    renter_id: { type: DataTypes.INTEGER, required: true },
    shipper_id: { type: DataTypes.INTEGER, required: true },
    start_time: { type: DataTypes.STRING, required: true },
    end_time: { type: DataTypes.STRING, required: true },
    total_price: { type: DataTypes.INTEGER, required: true },
});

module.exports = reservationModel;