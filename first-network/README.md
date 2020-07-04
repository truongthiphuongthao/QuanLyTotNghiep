## Build Your First Network (BYFN)
## First NetWork include org1, org2, orderer
## org1 : peer0.org1.example.com
##        peer0.org2.example.com
## org2: peer0.org1.example.com
##       peer0.org2.example.com
## Start first-network without deploy chaincode
sudo ./byfn up -n -a
## Deploy chaincode by docker cli
./startChannel.sh
## in bash cli we will deploy chaincode fabcar
./scripts/deployChaincode.sh fabcar/chaincode/ node fabcar 1
## Run fabcar by open the new terminal
cd fabcar/javascript/
node enrollAdmin.js
node registerUser.js
node invoke.js
node query.js
# Check docker logs
docker logs [id] 
#Remove id in wallet 
cd fabcar/
sudo ./networkDown.sh
#Stop first-network
sudo ./byfn.sh down


