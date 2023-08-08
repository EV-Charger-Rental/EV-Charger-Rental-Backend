"use strict"

const roomsModel = (sequelize, DataTypes) => sequelize.define('Rooms', {
    room_name: { type: DataTypes.STRING, required: true, unique: true },
});

module.exports = roomsModel;
