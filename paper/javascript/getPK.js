/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main(magv) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..','first-network', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(magv);
        return identity.credentials.privateKey

    } catch (error) {
        return false
    }
}
//let mssv='B1609577';
//let maLopHocPhan='CT001'
//let diemmoi='A'
//let dinhdanh='TCDe';
//let signature ='MEYCIQDgL3K5sY7eiOoDn5nHVf0XyreJrNxVrnTDW1NcxCQsOwIhAN0sg9D6z+Gt99LVINh7wVIuTAk1ROlpWh5W96JgsGEr'
module.exports = main
//main('TVChau')
