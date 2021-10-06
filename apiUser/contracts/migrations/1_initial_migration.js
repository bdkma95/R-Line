    const fs = require('fs');
    const Migrations = artifacts.require("Migrations");
    const AirnextToken = artifacts.require("AirnextToken");
    var Web3 = require('web3');
   // var web3 = new Web3('http://localhost:8545');  // Localhost (default: none)

    var web3 = new Web3('http://ganache-cli:8545');

    module.exports = async function(deployer) {
        const users = await web3.eth.getAccounts();
        console.log(users)
        await deployer.deploy(Migrations);
        const t = await deployer.deploy(AirnextToken, users[0], users[1], users[2], users[3]);
        fs.unlink('../addressSmartContract.txt',function(err) {
            if (err) throw err;
            console.log('Fichier Suppr !');
        fs.appendFile('../addressSmartContract.txt', t.address, function(err) {
            if (err) throw err;
            console.log('Fichier créé !');
        });
        });
    };