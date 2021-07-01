const crypto = require('crypto');
//const key = "WorldIsFuckingAmazingUNDERSTANDORNOT"
const key = "helloworldhowareyou";



exports.signTransaction = function signTransaction(privateKey,data)
{
    const algorithm = "SHA256";
    //data = data.uid+data.uuid+data.node+data.field+data.type;
     //data = data.toString();
    // Converting string to buffer
    data = JSON.stringify(data);
     data = Buffer.from(data);
     //console.log(data,"from client");
    // Sign the data and returned signature in buffer
    const signature = crypto.sign(algorithm,data,{key:privateKey.toString(),passphrase:key});
    //console.log(signature.toJSON(),"tojson");
    //const newData = signature.toJSON()
    //console.log(Buffer.from(newData),"to buffer")
    //console.log(signature,"original")
    return signature.toJSON();
}