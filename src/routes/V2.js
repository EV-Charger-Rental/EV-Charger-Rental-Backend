'use strict';

const express = require('express');
const dataModules = require('../models');

const router = express.Router();

const basicAuth = require('../middleware/basic.js')
const bearerAuth = require('../middleware/bearer.js')
const permissions = require('../middleware/acl.js')

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  console.log('Available Models:', Object.keys(dataModules));
  console.log('Model Name:', modelName);
  if (dataModules[modelName]) { 
    req.model = dataModules[modelName];
    console.log('req.model', dataModules[modelName]);
    next();
  } else {
    next('Invalid Model');
  }
});

// available models: [reviews, charger, reservation, users ]

router.get('/:model',bearerAuth,permissions('read'),handleGetAll);

// http://localhost:3000/api/v2/reviews

router.get('/:model/:id',bearerAuth,permissions('read'), handleGetOne);

// http://localhost:3000/api/v2/reviews/1
// {
//   "reviewer_id": 1,
//   "target_id": 1,
//   "rating": 5,
//   "comment":"fff"
// }


router.post('/:model', bearerAuth,permissions('create'),handleCreate);

// http://localhost:3000/api/v2/reviews
// {
//   "reviewer_id": 1,
//   "target_id": 1,
//   "rating": 5,
//   "comment":"fff"
// }


router.put('/:model/:id', handleUpdate);

// http://localhost:3000/api/v2/reviews/1
// {
//   "reviewer_id": 1,
//   "target_id": 1,
//   "rating": 5,
//   "comment":"no please no no "
// }

router.delete('/:model/:id',bearerAuth,permissions('delete'), handleDelete);

// http://localhost:3000/api/v2/reviews/1


async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id)
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj)
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}
//////////////////////////////////////////////

router.get('/:model/:statusTime/:id',bearerAuth,permissions('read'), handleGetOneBasedOntime);

async function handleGetOneBasedOntime(req, res) {

  const statusTime=req.params.statusTime;
  const id = req.params.id;

  // console.log("*******************",id);
  // console.log("*******************",statusTime);
  let theRecord;
  
  theRecord = await req.model.getSession(statusTime,id);
    console.log("*****************",theRecord);
  

  
  res.status(200).json(theRecord);
}



///////////////////////////////////////////////////////////////////////////////
router.get('/:model/:renterLocation/:availability/:chargerType',bearerAuth,permissions('read'), handleGetChargers);

async function handleGetChargers(req, res) {

   const renterLocation = req.params.renterLocation; // Assuming the renter location is passed as a query parameter
    const availability = req.params.availability; // Assuming the availability status is passed as a query parameter
    const chargerType = req.params.chargerType; // Assuming the charger type is passed as a query parameter
    console.log(availability,chargerType)
    let theRecord = await req.model.getChargers(renterLocation,availability,chargerType);

    res.json(theRecord);
  }





module.exports = router;
