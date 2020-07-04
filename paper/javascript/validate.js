'use strict';

const { FileSystemWallet, Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const { KJUR, KEYUTIL, X509 } = require('jsrsasign');
const CryptoJS = require('crypto-js');

//async function main(dinhDanh, dulieu, signature) {
exports.validate = async function(dinhDanh, dulieu, signature){
    try {

	/*const ccpPath = path.resolve(__dirname, '..', '..','first-network', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);*/

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);


        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(dinhDanh);

        // calculate Hash from the data
        const fileLoaded = dulieu;
        var hashToAction = CryptoJS.SHA256(fileLoaded).toString();
        console.log("Hash of the file: " + hashToAction);

        // get certificate from the certfile
        const certLoaded = userIdentity.credentials.certificate;

        // perform signature checking
	    var userPublicKey = KEYUTIL.getKey(certLoaded);
	//console.log(userPublicKey);
        var recover = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
        recover.init(userPublicKey);
        recover.updateHex(hashToAction);
        var getBackSigValueHex =new Buffer.from(signature, 'base64').toString('hex');
        console.log("Signature verified with certificate provided: " + recover.verify(getBackSigValueHex));
 
        // Disconnect from the gateway.
        //await gateway.disconnect();
	   return recover.verify(getBackSigValueHex); 

    } catch (error) {
        console.error(`Failed verify: ${error}`);
        return false
    }
}
//let signature ='MEQCIBQA4tZwQWffzcC3lQr8xeX34hpRu+vwtCzQeKH1kekaAiAO5nx/pUlpzNeI8pqUlM25P9BJQbCWZ3uTeGwQlJIwyw==';
//main('ptcang','B1609577hocki1CT001Aptcang',signature);
