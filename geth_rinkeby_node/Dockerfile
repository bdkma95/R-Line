#These are the commands to run from the Docker CLI to run the Ethereum Go node client
#GETTING THE IMAGE
FROM ethereum/client-go

USER root

EXPOSE 8545

EXPOSE 30303 

EXPOSE 3334

WORKDIR /home/node

COPY init_node.sh  /home/node/

RUN ./init_node.sh

