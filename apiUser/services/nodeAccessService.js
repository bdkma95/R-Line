const net = require('net');
const Web3 = require('web3');
const { abi } = require('../conf/AirnectToken');

const { runMethods } = require('./utils/helpers')

//var web3 = new Web3(new Web3.providers.IpcProvider('/home/oem/.ethereum/rinkeby/geth.ipc', net)); 
var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:3334')); 

var version = web3.version;


async function rinkebyConnect(){

      const contract = web3 && web3.eth && new web3.eth.Contract(abi, "0x778cF027280cd298BaAC01F979958D1EF2dB116F")
      console.log(version);
      console.log("=========================================== BLOCK")
      const blockZero = await web3.eth.getBlock(0);
      console.log(blockZero)
      console.log("=========================================== Sync")
      const isSyncing = await web3.eth.isSyncing();
      console.log(isSyncing)
      console.log("=========================================== Chain id")
      const chainId = await web3.eth.getChainId();
      console.log(chainId)   
      console.log("=========================================== Decimal")
     // const decimal = contract.methods.defaultAccount;
      console.log(contract.methods.defaultAccount)
      console.log("=========================================== Decimal")
      const decimal = contract.methods.decimals().call();
      console.log(decimal)
}

async function run(inputs, funct, stateMutability, _sender) {
    
    const contract = web3 && web3.eth && new web3.eth.Contract(abi, "0x778cF027280cd298BaAC01F979958D1EF2dB116F")
    const response = await runMethods(inputs, funct, stateMutability, _sender,contract)
    return response;
}

module.exports = {
    rinkebyConnect: rinkebyConnect,
    run:run
};