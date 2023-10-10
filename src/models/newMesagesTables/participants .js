// CREATE TABLE participants (
//     user_id UUID REFERENCES users(id),
//     conversation_id UUID REFERENCES conversations(id),
//     role VARCHAR(255),
//     PRIMARY KEY(user_id, conversation_id) -- Composite primary key
// );

"use strict";

const participantsModal = (sequelize, DataTypes) => sequelize.define('Participants', {
    role: {
        type: DataTypes.STRING,
        required: false
    },
    userId: {
        type: DataTypes.INTEGER,
        required: true
    },
    conversationId: {
        type: DataTypes.INTEGER,// forien key in conversations table
        required: true
    },
    // userName: {
    //     type: DataTypes.STRING,
    //     required: true
    // },
    staus: {
        type: DataTypes.STRING,
        required: false
    },
    lastActivity: {
        type: DataTypes.STRING,
        required: false
    }

});

module.exports = participantsModal;