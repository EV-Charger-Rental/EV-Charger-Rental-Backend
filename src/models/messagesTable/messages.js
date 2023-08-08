"use strict"

const messagesModel = (sequelize, DataTypes) => sequelize.define('Messages', {
    message: { type: DataTypes.STRING, required: true },
    room_name: { type: DataTypes.STRING, required: true },
    username: { type: DataTypes.STRING, required: true },

});

module.exports = messagesModel;