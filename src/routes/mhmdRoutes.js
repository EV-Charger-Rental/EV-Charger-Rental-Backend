'use strict';

const express = require('express');
const dataModules = require('../models');
const momo = express.Router();
// const basicAuth = require('../middleware/basic.js')
// const bearerAuth = require('../middleware/bearer.js')
// const permissions = require('../middleware/acl.js')

momo.param('model', (req, res, next) => {
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

momo.get('/:model', handleGetAll);
momo.get('/:model/:id', handleGetOne);
momo.post('/:model', handleCreate);
momo.put('/:model/:id', handleUpdate);
momo.delete('/:model/:id', handleDelete);


async function handleGetAll(req, res) {
    let allRecords = await req.model.findAll({});
    res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
    const id = req.params.id;
    let theRecord = await req.model.findOne({ where: { id: id } })
    res.status(200).json(theRecord);
}

// async function handleCreate(req, res) {
//   let obj = req.body;
//   let newRecord = await req.model.create(obj);
//   res.status(201).json(newRecord);
// }


async function handleCreate(req, res) {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);


}

async function handleUpdate(req, res) {
    const id = req.params.id;
    const obj = req.body;

    const findOne = await req.model.findOne({ where: { id: id } })
    console.log("findOne", findOne);
    const updatedRecord = await findOne.update(obj);
    // let updatedRecord = await req.model.update(id, obj)
    res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
    let id = req.params.id;
    let deletedRecord = await req.model.destroy({ where: { id: id } });
    res.status(200).json(deletedRecord);
}


module.exports = momo;