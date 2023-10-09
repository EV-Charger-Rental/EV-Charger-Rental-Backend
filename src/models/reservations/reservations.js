const reservationModel = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    charger_id: { type: DataTypes.INTEGER, allowNull: false },
    renter_id: { type: DataTypes.INTEGER, allowNull: false },
    Provider_id: { type: DataTypes.INTEGER, allowNull: false },
    startClok: { type: DataTypes.STRING, allowNull: false },
    endClok: { type: DataTypes.STRING, allowNull: false },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }, {
    // Other model options
  });

  // Define a hook to calculate and set total_price before creating or updating a record
  Reservation.beforeCreate(async (reservation, options) => {
    await calculateAndSetTotalPrice(reservation, sequelize);
  });

  Reservation.beforeUpdate(async (reservation, options) => {
    await calculateAndSetTotalPrice(reservation, sequelize);
  });

  // Function to calculate and set the total_price based on startClok and endClok
  async function calculateAndSetTotalPrice(reservation, sequelize) {
    if (reservation.startClok && reservation.endClok) {
      const startTimeParts = reservation.startClok.split(':');
      const endTimeParts = reservation.endClok.split(':');

      // Ensure both parts are valid integers
      if (startTimeParts.length === 2 && endTimeParts.length === 2) {
        const startHour = parseInt(startTimeParts[0]);
        const endHour = parseInt(endTimeParts[0]);

        // Calculate the total time in Hours
        const totalHours = endHour - startHour;

        // Fetch the charger's price from the Charger model
        const Charger = sequelize.models.Charger;
        const charger = await Charger.findByPk(reservation.charger_id);

        if (charger) {
          // Use the charger's price to calculate the total price
          const pricePerHour = charger.price;
          const totalPrice = totalHours * pricePerHour;
          
          // Set the calculated total_price
          reservation.total_price = totalPrice;
        }
      }
    }
  }

  return Reservation;
};

module.exports = reservationModel;
