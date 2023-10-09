const reservationModel = (sequelize, DataTypes) => sequelize.define('Reservation', {
  charger_id: { type: DataTypes.INTEGER, allowNull: false },
  renter_id: { type: DataTypes.INTEGER, allowNull: false },
  Provider_id: { type: DataTypes.INTEGER, allowNull: false },
  startClok: { type: DataTypes.STRING, allowNull: false },
  endClok: { type: DataTypes.STRING, allowNull: false },
  total_price: {
    type: DataTypes.VIRTUAL,
    async get() {
      // Calculate total price based on startClok and endClok
      if (this.getDataValue('startClok') && this.getDataValue('endClok')) {
        const startTimeParts = this.getDataValue('startClok').split(':');
        const endTimeParts = this.getDataValue('endClok').split(':');

        // Ensure both parts are valid integers
        if (startTimeParts.length === 2 && endTimeParts.length === 2) {
          const startHour = parseInt(startTimeParts[0]);
          const endHour = parseInt(endTimeParts[0]);

          // Calculate the total time in Hours
          const totalHours = endHour - startHour;

          // Fetch the charger's price from the Charger model
          const Charger = sequelize.models.charger;
          const charger = await Charger.findByPk(this.getDataValue('charger_id'));

          if (charger) {
            // Use the charger's price to calculate the total price
            const pricePerHour = charger.price;
            return totalHours * pricePerHour;
          }
        }
      }

      return null;
    },
  },
}
);

module.exports = reservationModel;
