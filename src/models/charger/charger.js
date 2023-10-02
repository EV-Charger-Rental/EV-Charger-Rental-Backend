"use strict";

const dayjs = require('dayjs');

const chargerModel = (sequelize, DataTypes) => sequelize.define('Charger', {
  ChargerType: { type: DataTypes.STRING, required: true },
  status: { type: DataTypes.STRING, required: true, },
  owner_id: { type: DataTypes.INTEGER, required: true },
  price: { type: DataTypes.FLOAT, required: true },
  Chargerlocation: { type: DataTypes.STRING, required: true }
});

module.exports = chargerModel;
