#!/bin/sh

geth --datadir=/home/app/.ethereum/rinkeby init rinkeby.json
geth --rinkeby --rpc.allow-unprotected-txs  --identity="airnextfirstnode" --syncmode="full" --networkid=4 --datadir=/home/app/.ethereum/rinkeby --cache=512 --ethstats='airnextfirstnode:Respect my authoritah!@stats.rinkeby.io' --bootnodes=enode://a24ac7c5484ef4ed0c5eb2d36620ba4e4aa13b8c84684e1b4aab0cebea2ae45cb4d375b77eab56516d34bfbd3c1a833fc51296ff084b770b94fb9028c4d25ccf@52.169.42.101:30303
geth ipc --ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --ipcpath "/home/app/.ethereum/rinkeby/geth.ipc"
geth attach ipc:/home/app/.ethereum/rinkeby/geth.ipc
geth attach http://191.168.1.1:8545
geth attach ws://191.168.1.1:8546
geth --rpc.allow-unprotected-txs 
geth --ws --ws.port 3334 --ws.api "eth,net,web3"
geth --ws --ws.origins https://localhost:8080