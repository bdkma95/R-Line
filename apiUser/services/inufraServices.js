
const { ethers } = require("ethers");
const router = express.Router();

const { runMethods } = require('./utils/helpers')

var wsProvider = new ethers.providers.WebSocketProvider("wss://rinkeby.infura.io/ws/v3/06e18a4c75604ff0a2927f6305f1f20e",'rinkeby');



async function run(inputs, funct, stateMutability, _sender) {

    const contract = new ethers.Contract("", "CONTRACT_ABI", wsProvider);
    const response = await runMethods(inputs, funct, stateMutability, _sender,contract)
    return response;
}

module.exports = {
    run: run
};