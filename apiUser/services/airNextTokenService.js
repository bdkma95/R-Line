const { abi } = require('../conf/AirnectToken');
var Web3 = require('web3');
// var web3 = new Web3('http://localhost:8545');  // Localhost (default: none)

var web3 = new Web3('http://ganache-cli:8545');

const { runMethods } = require('./utils/helpers')
const fs = require('fs');
var contract = null;
fs.readFile('./addressSmartContract.txt', 'utf8', function(err, data) {
    const content = data;
    contract = web3 && web3.eth && new web3.eth.Contract(abi, content)
});


async function run(inputs, funct, stateMutability, _sender) {

    const contract = web3 && web3.eth && new web3.eth.Contract(abi, "0x778cF027280cd298BaAC01F979958D1EF2dB116F")
    const response = await runMethods(inputs, funct, stateMutability, _sender,contract)
    return response;
}

module.exports = {
    run: run
};