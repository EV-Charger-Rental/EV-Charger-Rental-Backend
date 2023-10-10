'use strict';
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
class DataCollection {
 
  constructor(model,Op) {
    this.model = model;
    this.Op = Op;
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
    const record = await this.model.findOne({where: { id: id }});
    console.log('record', record);
    return record.update(data);
  }


  delete(id) {
    return this.model.destroy({ where: { id: id } });
  }




  getChargers(renterLocation, availability, chargerType) {
    return this.model.findAll({
      where: {
        status: availability,
        ChargerType: chargerType,
        chargerAddress: renterLocation
      }
    })}

   getUserChargers(userId) {
      return this.model.findAll({
        where: { owner_id: userId },
      });
    }
 
  
    getUserReservation(userId) {
      return this.model.findAll({
        where: { Provider_id: userId },
      });
    }

  //   handlePatch(id, data) {
  //    const record =  this.model.findOne({ where: { id: id } });
  //    if (!record) {
  //      throw new Error('Record not found');
  //    }
   
  //    return record.update(data);
  //  }
   getReservationsByRenterId(userId) {
    return this.model.findAll({
      where: {
        renter_id: userId,
      },
    });
  }

  async handlePatch(id, data) {
    const record = await this.model.findOne({ where: { id: id } });
    if (!record) {
      throw new Error('Record not found');
    }
  
    // Check if the 'status' field is present in the data and update it
    if (data.status) {
      record.setDataValue('status', data.status);
    }
  
    // Save the updated record to the database
    await record.save();
  
    return record;
  }
  
  
  // getProviderReservations(id, Provider,statusTime) {
  //   const currentTime = new Date();
  //   if (Provider == "Provider") {
  
  // if (statusTime === "now") {
  //     return this.model.findAll({
  //       where: {
  //         Provider_id: id,
  //         total_price: null,
  //         start_time: {
  //           [Op.gt]: currentTime,
  //         }
  //       }
  //     });
  //   }
    

  //   if (statusTime === "history") {
  //     return this.model.findAll({
  //       where: {
  //         Provider_id: id,
  //         total_price: { [Op.ne]: null },
  //       }
  //     });
  //   }
  // }
  
    

  //   else {
  //    if (statusTime === "now") {
  //     return this.model.findAll({
  //       where: {
  //         renter_id: id,
  //         total_price: null,
  //         start_time: {
  //           [Op.gt]: currentTime,
  //         }
  //       }
  //     });
  //   }

  //   if (statusTime === "history") {
  //     return this.model.findAll({
  //       where: {
  //         renter_id: id,
  //         total_price: { [Op.ne]: null },
  //       }
  //     });
  //   }
  // }

}





module.exports = DataCollection;
