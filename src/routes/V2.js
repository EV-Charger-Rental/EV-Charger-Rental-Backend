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

router.get('/:model', bearerAuth, permissions('read'), handleGetAll);
router.get('/:model/:id', bearerAuth, permissions('read'), handleGetOne);
router.post('/:model', bearerAuth, permissions('create'), handleCreate);
router.put('/:model/:id', handleUpdate);
router.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);
router.get('/:model/:statusTime/:id', bearerAuth, permissions('read'), handleGetOneBasedOntime);
router.get('/:model/:renterLocation/:availability/:chargerType', bearerAuth, permissions('read'), handleGetChargers);
router.get('/:model/:id/:shipper/all/plugTime', bearerAuth, permissions('read'), handleGetAllShipperReservations);
router.get('/:model/:id/:renter/all/plugTime', bearerAuth, permissions('read'), handleGetAllRenterReservations);


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


async function handleGetOneBasedOntime(req, res) {
  const statusTime = req.params.statusTime;
  const id = req.params.id;
  let theRecord;
  theRecord = await req.model.getSession(statusTime, id);
  res.status(200).json(theRecord);
}


async function handleGetChargers(req, res) {
  const renterLocation = req.params.renterLocation;
  const availability = req.params.availability;
  const chargerType = req.params.chargerType;
  console.log(availability, chargerType)
  let theRecord = await req.model.getChargers(renterLocation, availability, chargerType);
  res.json(theRecord);
}


async function handleGetAllShipperReservations(req, res) {
  const id = req.params.id;
  const shipper = req.params.shipper;
  let theRecord = await req.model.getShipperReservations(id, shipper)
  res.status(200).json(theRecord);
}


async function handleGetAllRenterReservations(req, res) {
  const id = req.params.id
  const renter = req.params.renter;
  let theRecord = await req.model.getShipperReservations(id, renter)
  res.status(200).json(theRecord);
}



module.exports = router;
