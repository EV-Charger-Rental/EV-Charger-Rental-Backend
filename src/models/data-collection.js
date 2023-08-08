'use strict';
const { Op } = require('sequelize');
// THIS IS THE STRETCH GOAL ...
// It takes in a schema in the constructor and uses that instead of every collection
// being the same and requiring their own schema. That's not very DRY!

class DataCollection {

  constructor(model) {
    this.model = model;
  }

  get(id) {
    if (id) {
      return this.model.findOne({ where: { id:id } });
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
    const record = await this.model.findOne( { id } );
    console.log('record', record);
    return record.update(data);
  }
  

  delete(id) {
    return this.model.destroy({ where: { id:id} });
  }


  ////////////////////////
  getSession(statusTime, id) {
    const currentTime = new Date();
    console.log(">>>>>>>>>>",currentTime);
    console.log(">>>>>>>>>>",statusTime);
    console.log(">>>>>>>>>>",id);
  
    if (statusTime === "scheduled") {
      return this.model.findAll({
        where: {
          shipper_id: id,
          total_price: null,
          start_time: {
            [Op.lt]: currentTime, // Assuming you want start_time < currentTime
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
    
    if(statusTime === "history") {
      console.log("kkkk");
      return this.model.findAll({
        where: {
          shipper_id: id,
          total_price:{ [Op.ne]: null}, 
        }
      });
    }
  
  }

////////////////////////////////////////////////////////////////////////
//  getChargers(renterLocation,availability, chargerType) {
//   const filters = {
//     include: [
//       {
//         model: "user",
//         as: 'shipper',
//         where: {
//           location: renterLocation,
//           role: 'shipper',
//         },
//       },
//     ],
//     where: {
//       location: renterLocation,
//     },
//   };

//   if (availability === "available") {
//     filters.where.status = "available";
//   }

//   if (chargerType) {
//     filters.where.type = chargerType;
//   }

//   console.log("Filters:", filters);

//   // Assuming you have a Charger model defined as chargerModel
//   const chargers =  this.model.findAll(filters);
//   return chargers;
// }

//   console.log("kkkkkkkkkkkkkkkkk");
//   return this.model.findAll({
//     where: {
//       status: availability,
//       ChargerType : chargerType
//     }
//   }); 
//  }
// }


//***********************************************************//

getChargers(renterLocation, availability, chargerType) {
  console.log("kkkkkkkkkkkkkkkkk");
  return this.model.findAll({
    where: {
      status: availability,
      ChargerType : chargerType,
      Chargerlocation :renterLocation

    }})


   
 
}
getShipperReservations(id,shipper)
{
  if(shipper=="shipper")
  {
    return this.model.findAll({
      where: {
        shipper_id: id}})
  }
  else
  {
    return this.model.findAll({
      where: {
        renter_id: id}})
  }

  

}}



module.exports = DataCollection;
