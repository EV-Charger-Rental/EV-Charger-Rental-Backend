"use strict";

const dayjs = require('dayjs');

const chargerModel = (sequelize, DataTypes) => sequelize.define('Charger', {
  ChargerType: { type: DataTypes.STRING, required: true },
  status: { type: DataTypes.STRING, required: true },
  owner_id: { type: DataTypes.INTEGER, required: true },
  price: { type: DataTypes.FLOAT, required: true },
  latitude: { type: DataTypes.FLOAT, allowNull: false },
  longitude: { type: DataTypes.FLOAT, allowNull: false },
  chargerAddress: { type: DataTypes.STRING, allowNull: false }, // Add chargerAddress column
});

module.exports = chargerModel;

