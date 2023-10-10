'use strict';
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const reviewsModel = require('./reviews/reviews.js');
const chargerModel = require('./charger/charger.js');
const reservationModel = require('./reservations/reservations.js');
const userModel = require('./users/users.js');
const messagesModel=require('./messagesTable/messages.js');
const roomsModel=require('./rooms/rooms.js');
const privateMessagesModel=require('./messagesTable/privateMessages.js');
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const converationsModal = require('./newMesagesTables/conversations.js');
const newMessagesModal = require('./newMesagesTables/newMessages.js');
const participantsModal = require('./newMesagesTables/participants .js');
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
const users = userModel(sequelize, DataTypes);
const reviews = reviewsModel(sequelize, DataTypes);
const charger = chargerModel(sequelize, DataTypes);
const reservation = reservationModel(sequelize, DataTypes);
const messages=messagesModel(sequelize,DataTypes);
const rooms=roomsModel(sequelize,DataTypes);
const privateMessages=privateMessagesModel(sequelize,DataTypes);
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const conversations = converationsModal(sequelize, DataTypes);
const newMessages = newMessagesModal(sequelize, DataTypes);
const participants = participantsModal(sequelize, DataTypes);


users.hasMany(reviews, { foreignKey: 'reviewer_id', sourceKey: 'id' });
reviews.belongsTo(users, { foreignKey: 'reviewer_id', targetKey: 'id' });

users.hasMany(reviews, { foreignKey: 'target_id', sourceKey: 'id' });
reviews.belongsTo(users, { foreignKey: 'target_id', targetKey: 'id' });

users.hasMany(charger, { foreignKey: 'owner_id', sourceKey: 'id' });
charger.belongsTo(users, { foreignKey: 'owner_id', targetKey: 'id' });

users.hasMany(reservation, { foreignKey: 'renter_id', sourceKey: 'id' });
reservation.belongsTo(users, { foreignKey: 'renter_id', targetKey: 'id' });

users.hasMany(reservation, { foreignKey: 'Provider_id', sourceKey: 'id' });
reservation.belongsTo(users, { foreignKey: 'Provider_id', targetKey: 'id' });

charger.hasMany(reservation, { foreignKey: 'charger_id', sourceKey: 'id' });
reservation.belongsTo(charger, { foreignKey: 'charger_id', targetKey: 'id' });

messages.hasMany(rooms,{foreignKey:'room_id',sourceKey:'id'});
rooms.belongsTo(messages,{foreignKey:'room_id',targetKey:'id'});

//fixed this

users.hasMany(privateMessages,{foreignKey:'sender',sourceKey:'username'});
privateMessages.belongsTo(users,{foreignKey:'sender',targetKey:'username'});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
users.hasMany(participants, { foreignKey: 'userId', sourceKey: 'id' });
participants.belongsTo(users, { foreignKey: 'userId', targetKey: 'id' });

// users.hasMany(participants, { foreignKey: 'userName', sourceKey: 'username' });
// participants.belongsTo(users, { foreignKey: 'userName', targetKey: 'username' });

conversations.hasMany(participants, { foreignKey: 'conversationId', sourceKey: 'id' });
participants.belongsTo(conversations, { foreignKey: 'conversationId', targetKey: 'id' });

conversations.hasMany(newMessages, { foreignKey: 'conversationId', sourceKey: 'id' });
newMessages.belongsTo(conversations, { foreignKey: 'conversationId', targetKey: 'id' });


users.hasMany(newMessages, { foreignKey: 'senderId', sourceKey: 'id' });
newMessages.belongsTo(users, { foreignKey: 'senderId', targetKey: 'id' });

users.hasMany(newMessages, { foreignKey: 'recieverId', sourceKey: 'id' });
newMessages.belongsTo(users, { foreignKey: 'recieverId', targetKey: 'id' });






module.exports = {
  db: sequelize,
  reviews: new Collection(reviews),
  charger: new Collection(charger),
  reservation: new Collection(reservation),
  users: users,
  originalReviews: reviews,
  originalCharger: charger,
  originalReservation: reservation,
  messagesModal: messages,
  roomsModal: rooms,
  privateMessagesModal: privateMessages,
  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    conversationsModal: conversations,
    newMessagesModal: newMessages,
    participantsModal: participants,
};