'use strict';
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');



// const clothesModel = require('./clothes/model.js');
// const foodModel = require('./food/model.js');
const reviewsModel = require('./reviews/reviews.js');
const chargerModel = require('./charger/charger.js');
const reservationModel = require('./reservations/reservations.js');
const userModel = require('./users/users.js');
const Collection = require('./data-collection.js');




const POSTGRES_URI = process.env.NODE_ENV === "test" ? "sqlite::memory:" : process.env.DATABASE_URL;
let sequelizeOptions = process.env.NODE_ENV === "production" ?
    {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    } :
    {}


const sequelize = new Sequelize(POSTGRES_URI,sequelizeOptions);
// const food = foodModel(sequelize, DataTypes);
// const clothes = clothesModel(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);
const reviews = reviewsModel(sequelize, DataTypes);
const charger = chargerModel(sequelize, DataTypes);
const reservation = reservationModel(sequelize, DataTypes);


users.hasMany(reviews, { foreignKey: 'reviewer_id', sourceKey: 'id' });
reviews.belongsTo(users, { foreignKey: 'reviewer_id', targetKey: 'id' });

users.hasMany(reviews, { foreignKey: 'target_id', sourceKey: 'id' });
reviews.belongsTo(users, { foreignKey: 'target_id', targetKey: 'id' });

users.hasMany(charger, { foreignKey: 'owner_id', sourceKey: 'id' });
charger.belongsTo(users, { foreignKey: 'owner_id', targetKey: 'id' });

users.hasMany(reservation, { foreignKey: 'renter_id', sourceKey: 'id' });
reservation.belongsTo(users, { foreignKey: 'renter_id', targetKey: 'id' });

users.hasMany(reservation, { foreignKey: 'shipper_id', sourceKey: 'id' });
reservation.belongsTo(users, { foreignKey: 'shipper_id', targetKey: 'id' });

charger.hasMany(reservation, { foreignKey: 'charger_id', sourceKey: 'id' });
reservation.belongsTo(charger, { foreignKey: 'charger_id', targetKey: 'id' });


location.hasMany(charger, { foreignKey: 'location', sourceKey: 'location' });
user.belongsTo(charger, { foreignKey: 'location', targetKey: 'location' });



module.exports = {
  db: sequelize,
  reviews: new Collection(reviews),
  charger: new Collection(charger),
  reservation: new Collection(reservation),
  users: users,
  originalReviews: reviews,
  originalCharger: charger,
  originalReservation: reservation,
};
