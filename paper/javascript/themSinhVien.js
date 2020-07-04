/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
async function main (dinhdanh) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..','first-network', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(dinhdanh);
        if (!identity) {
            console.log(`An identity for the user ${dinhdanh} does not exist in the wallet`);
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
        await contract.submitTransaction('themSinhVien', 'B1609549' ,'Phương Thảo', '001');
        await contract.submitTransaction('themSinhVien', 'B1609550' ,'Quang Huy', '002');
        await contract.submitTransaction('themSinhVien', 'B1609552' ,'Huỳnh Hiếu', '003');
         console.log('Transaction has been submitted themSinhVien');
        // Disconnect from the gateway.
        await gateway.disconnect();
        //response.msg ='submitPaper Transaction has been submitted'
		return 'Successfully added student ';
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return false;
    }
}
// let mssv = 'B1609549'
// let ten = 'Phuong Thao'
// let cmnd = '092198000255'
// let dinhdanh = 'appUser';
// main(mssv, ten , cmnd , dinhdanh);
module.exports = main;

