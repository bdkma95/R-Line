const express = require('express');
const endpoints = require('../public/listEndPoint.json')
const services = require('../services/airNextTokenService')
const metaServices = require('../services/nodeAccessService')
const router = express.Router();

router.get('/ListSmartContractFunction', (req, res) => {
    res.status(200).json(endpoints)
})

router.post('/methods', (req, res) => {
    const { inputs, funct, stateMutability, sender } = req.body.body;
    services.run(inputs, funct, stateMutability, sender).then(result => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.end(JSON.stringify(result));
    });
})


module.exports = router;