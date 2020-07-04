
/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const { Gateway, Wallets } = require('fabric-network');



async function main(dinhDanh,msgv) {
   try{  
	console.log(dinhDanh);
        // load the network configuration
        //const ccpPath = path.resolve(__dirname, '..', '..','test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccpPath = path.resolve(__dirname, '..', '..','first-network', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(dinhDanh);
        if (userIdentity) {
            console.log(`An identity for the user "${dinhDanh}" already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }


        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true}});

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('paper');

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.

        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: dinhDanh,
            role: 'client',
	        attrs: [{name: 'firstName', value: msgv, ecert: true}]
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: dinhDanh,
            enrollmentSecret: secret,
            attrs_reqs: [{name: 'firstName', optional: false}]
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
		        rootCertificate : enrollment.rootCertificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put(dinhDanh, x509Identity);
	    console.log(`Successfully registered "${dinhDanh}" user and importedit into the wallet\n privateKey: ${x509Identity.credentials.privateKey}`);
        const result = `Successfully registered "${dinhDanh}" user and imported it into the wallet <br> privateKey: ${x509Identity.credentials.privateKey}`;
	await gateway.disconnect();
	return result;
   } catch(error){
	   console.error(`Failed:${error}`);
	   return false
	}
}
//let dinhdanh='TVChau'
//let magv='TVChau'
//let dinhDanh = 'appUser';
//main(dinhdanh,magv);
module.exports = main

