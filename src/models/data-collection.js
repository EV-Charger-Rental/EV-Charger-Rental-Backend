'use strict';

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
    return this.model.destroy({ id });
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
  
}

  


module.exports = DataCollection;
