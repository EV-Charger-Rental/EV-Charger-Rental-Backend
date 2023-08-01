// +------------------------+
// |        Charger         |
// +------------------------+
// | id (PK)                |
// | type                   |
// | status                 |
// | owner_id (FK)          |
// | price                  |
// +------------------------+

"use strict";

const dayjs = require('dayjs');

const chargerModel = (sequelize, DataTypes) => sequelize.define('Charger', {
    type: { type: DataTypes.STRING, required: true },
    status: {type: DataTypes.STRING,required: true,},
    owner_id: { type: DataTypes.INTEGER, required: true },
    price: { type: DataTypes.FLOAT, required: true },
    location: { type: DataTypes.STRING, required: true }
  });

module.exports = chargerModel;









// const dayjs = require('dayjs');

// const chargerModel = (sequelize, DataTypes) => sequelize.define('Charger', {
//     type: { type: DataTypes.STRING, required: true },
//     status: {
//         type: DataTypes.VIRTUAL,
//       async get() {
//           const now = dayjs();
          
//           const getReservations = async () => {
//               const reservations = await sequelize.models.Reservation.findAll({ where: { charger_id: this.id } });
//             //   console.log('reservations=============>', reservations);
//               return reservations;
//         };
  
//         const reservations = await getReservations();

//         console.log('reservations=============>', reservations.length);

//         if (reservations.length === 0) {
//             // console.log('========================available');
//             return 'available';
//         }

//         const conflictingReservations = reservations.filter(reservation => {
//           const start = dayjs(reservation.start_time);
//           const end = dayjs(reservation.end_time);
//           return now.isAfter(start) && now.isBefore(end);
//         });

//         console.log('conflictingReservations=============>', conflictingReservations);

//         if (conflictingReservations.length > 0) {
//           return 'unavailable';
//         } else {
//           return 'available';
//         }
        
//       },
//        required: true,
//     },
//     owner_id: { type: DataTypes.INTEGER, required: true },
//     price: { type: DataTypes.FLOAT, required: true },
//   }, {
//     // Option to include virtual attributes in the JSON output
//     toJSON: { virtuals: true },
//   });

// module.exports = chargerModel;
