const express = require('express');
const metaServices = require('../services/nodeAccessService')
const router = express.Router();

router.get('/test',(req,res)=>{
    console.log("=============test===============")
    metaServices.rinkebyConnect();
})

router.post('/methods', (req, res) => {
    const { inputs, funct, stateMutability, sender } = req.body.body;
    metaServices.run(inputs, funct, stateMutability, sender).then(result => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.end(JSON.stringify(result));
    });
})


module.exports = router;