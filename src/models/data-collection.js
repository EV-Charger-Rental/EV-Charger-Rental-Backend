'use strict';
const { Op } = require('sequelize');
class DataCollection {

  constructor(model) {
    this.model = model;
  }

  get(id) {
    if (id) {
      return this.model.findOne({ where: { id: id } });
    }
    else {
      return this.model.findAll({});
    }
  }

  create(record) {
    return this.model.create(record);
  }

  update = async (id, data) => {
    console.log('id', id);
    console.log('data', data);
    const record = await this.model.findOne({ id });
    console.log('record', record);
    return record.update(data);
  }


  delete(id) {
    return this.model.destroy({ where: { id: id } });
  }


  getSession(statusTime, id) {
    const currentTime = new Date();
    if (statusTime === "scheduled") {
      return this.model.findAll({
        where: {
          shipper_id: id,
          total_price: null,
          start_time: {
            [Op.lt]: currentTime,
          }
        }
      });
    }
    if (statusTime === "now") {
      return this.model.findAll({
        where: {
          shipper_id: id,
          total_price: null,
          start_time: {
            [Op.gt]: currentTime,
          }
        }
      });
    }

    if (statusTime === "history") {
      return this.model.findAll({
        where: {
          shipper_id: id,
          total_price: { [Op.ne]: null },
        }
      });
    }
  }

  getChargers(renterLocation, availability, chargerType) {
    return this.model.findAll({
      where: {
        status: availability,
        ChargerType: chargerType,
        Chargerlocation: renterLocation
      }
    })}

  getShipperReservations(id, shipper) {
    if (shipper == "shipper") {
      return this.model.findAll({
        where: {
          shipper_id: id
        }
      })
    }
    else {
      return this.model.findAll({
        where: {
          renter_id: id
        }
      })
    }

  }
}



module.exports = DataCollection;
