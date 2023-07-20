// +------------------------+
// |        Charger         |
// +------------------------+
// | id (PK)                |
// | type                   |
// | status                 |
// | owner_id (FK)          |
// | price                  |
// +------------------------+

'use strict';

const chargerModel = (sequelize, DataTypes) => sequelize.define('Charger', {
    type: { type: DataTypes.STRING, required: true },
    status: { type: DataTypes.STRING, required: true },
    owner_id: { type: DataTypes.INTEGER, required: true },
    price: { type: DataTypes.INTEGER, required: true },
});

module.exports = chargerModel;