// create a table that will store the rooms that will be included in the chat page 

"use strict"

const roomsModel = (sequelize, DataTypes) => sequelize.define('Rooms', {
    room_name: { type: DataTypes.STRING, required: true, unique: true },
});

module.exports = roomsModel;
