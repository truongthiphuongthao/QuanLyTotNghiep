/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
async function main () {
    try {
        let dinhdanh = 'admin'
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
        // Sinh vien thu nhat
        await contract.submitTransaction(
            'dangKyHocPhan',
            'B1609549',
            'hocki1',
            JSON.stringify(
                {
                    'CT001':{diem: -1, magv: null},
                    'CT002':{diem: -1, magv: null},
                    'CT003':{diem: -1, magv: null}
                }
            )
        )
        await contract.submitTransaction(
            'dangKyHocPhan',
            'B1609549',
            'hocki2',
            JSON.stringify(
                {
                    'CT004':{diem: -1, magv: null},
                    'CT005':{diem: -1, magv: null},
                    'CT006':{diem: -1, magv: null}
                }
            )
        )
        await contract.submitTransaction(
            'dangKyHocPhan',
            'B1609549',
            'hocki3',
            JSON.stringify(
                {
                    'CT007':{diem: -1, magv: null},
                    'CT008':{diem: -1, magv: null},
                    'CT009':{diem: -1, magv: null}
                }
            )
        )
        // Sinh vien thu 2
        await contract.submitTransaction(
            'dangKyHocPhan',
            'B1609550',
            'hocki1',
            JSON.stringify(
                {
                    'CT001':{diem: -1, magv: null},
                    'CT002':{diem: -1, magv: null}
                }
            )
        )
        await contract.submitTransaction(
            'dangKyHocPhan',
            'B1609550',
            'hocki2',
            JSON.stringify(
                {
                    'CT003':{diem: -1, magv: null},
                    'CT004':{diem: -1, magv: null},
                    'CT005':{diem: -1, magv: null}
                }
            )
        )
         await contract.submitTransaction(
            'dangKyHocPhan',
            'B1609550',
            'hocki3',
            JSON.stringify(
                {
                    'CT006':{diem: -1, magv: null},
                    'CT007':{diem: -1, magv: null},
                    'CT008':{diem: -1, magv: null},
                    'CT009':{diem: -1, magv: null}
                }
            )
        )
        // Sinh vien thu 3
        await contract.submitTransaction(
            'dangKyHocPhan',
            'B1609552',
            'hocki1',
            JSON.stringify(
                {
                    'CT001':{diem: -1, magv: null},
                    'CT002':{diem: -1, magv: null},
                    'CT003':{diem: -1, magv: null}
                }
            )
        )
        await contract.submitTransaction(
            'dangKyHocPhan',
            'B1609552',
            'hocki3',
            JSON.stringify(
                {
                    'CT004':{diem: -1, magv: null},
                    'CT005':{diem: -1, magv: null},
                    'CT006':{diem: -1, magv: null}
                }
            )
        )

        console.log('Transaction has been submitted dangKyHocPhan');
        // Disconnect from the gateway.
        await gateway.disconnect();
        return true
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return false;
    }
}
 //main()
module.exports = main

