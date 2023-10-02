"use strict";

const chargerModel = (sequelize, DataTypes) => sequelize.define('Charger', {
  ChargerType: { type: DataTypes.STRING, required: true },
  status: { type: DataTypes.STRING, required: true },
  username: { type: DataTypes.STRING}, // Change the primary key to 'username'
  price: { type: DataTypes.STRING, required: true },
  Chargerlocation: { type: DataTypes.STRING, required: true }
});

module.exports = chargerModel;
