const crypto = require('crypto')
const fs = require('fs');
const key = "helloworldhowareyou";
const path = require('path')
exports.generateKeyPair =  function generateKeyPair()
{
    const {privateKey,publicKey} = crypto.generateKeyPairSync("rsa",{modulusLength:2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase:key
        }
    });
    fs.writeFileSync(path.join(__dirname,'./keys/public.pem'),publicKey,'utf8');
    fs.writeFileSync(path.join(__dirname,'./keys/private.pem'),privateKey,'utf8');
    return true;
}