/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

//exports.queryPaper = async function(mssv) 
async function main (mssv, dinhdanh){
   // let response = {}
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..','first-network','connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(dinhdanh);
        if (!identity) {
            console.log(`An identity for the user "${dinhdanh}" does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: dinhdanh, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('paper');

        const result = await contract.evaluateTransaction('xetTotNghiep', mssv);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        return result.toString()
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return false
    }
}
// let dinhdanh ='admin';
// let mssv = 'B1609549';
// main(mssv,dinhdanh);
module.exports = main;

