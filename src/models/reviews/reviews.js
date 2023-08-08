'use strict';
const reviewsModel = (sequelize, DataTypes) => sequelize.define('Reviews', {
    reviewer_id: { type: DataTypes.INTEGER, required: true },
    target_id: { type: DataTypes.INTEGER, required: true },
    rating: { type: DataTypes.INTEGER, required: true },
    comment: { type: DataTypes.STRING, required: true },
});

module.exports = reviewsModel;