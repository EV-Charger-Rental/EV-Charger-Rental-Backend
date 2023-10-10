// CREATE TABLE messages (
//     id UUID PRIMARY KEY,
//     conversation_id UUID REFERENCES conversations(id),
//     body TEXT,
//     contentType ENUM('text', 'image') NOT NULL,
//     createdAt TIMESTAMP,
//     senderId UUID REFERENCES users(id)
// );

"use strict";

const messagesModal = (sequelize, DataTypes) => sequelize.define('NewMessages', {
    body: {
        type: DataTypes.TEXT,
        required: true
    },
    contentType: {
        type: DataTypes.ENUM('text', 'image'),
        required: true
    },
    createdAt: {
        type: DataTypes.DATE,
        required: true
    },
    senderId: {
        type: DataTypes.INTEGER,
        required: true
    },
    recieverId: {
        type: DataTypes.INTEGER,
        required: true
    },
    conversationId: {
        type: DataTypes.INTEGER,
        required: true
    }
    });
module.exports = messagesModal;