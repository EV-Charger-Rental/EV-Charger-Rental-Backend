"use strict";

const privateMessagesModel = (sequelize, DataTypes) => sequelize.define('PrivateMessages', {
    message: { type: DataTypes.STRING, required: true },
    sender: { type: DataTypes.STRING, required: true },
    receiver: { type: DataTypes.STRING, required: true },
});

module.exports = privateMessagesModel;