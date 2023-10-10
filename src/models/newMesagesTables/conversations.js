// CREATE TABLE conversations (
//     id UUID PRIMARY KEY,
//     type ENUM('ONE_TO_ONE', 'GROUP') NOT NULL,
//     unreadCount INT NOT NULL DEFAULT 0
// );

"use strict"

const converationsModal = (sequelize, DataTypes) => sequelize.define('Conversations', {
    type: { type: DataTypes.ENUM('ONE_TO_ONE', 'GROUP'), required: true },
    unreadCount: { type: DataTypes.INTEGER, required: false, defaultValue: 0 },
});

module.exports = converationsModal;
