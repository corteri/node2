const functions = require('./function')
const signature = require('./signature')
const replica = require('./mhelper').connection().collection("replica");
const crypto = require('crypto')
const users = require('./mhelper').connection().collection("users");
exports.checkData = async function checkData(data,privateKey,hostPublicKey)
{
    //console.log(data)
    const RECEIVEDSignature = data.signature;
    const RECEIVEDData = data.data;
    const isVerified = crypto.verify("SHA256",Buffer.from(JSON.stringify(RECEIVEDData)),hostPublicKey,Buffer.from(RECEIVEDSignature));
    if(isVerified)
    {
      //console.log("verified")
      const DATA_HELPER_RECEIVED_DATA = await DATA_HELPER();
     // console.log(DATA_HELPER_RECEIVED_DATA)
      if(DATA_HELPER_RECEIVED_DATA>1)
      {
        //console.log("HELLO WORLD PART! ")
        const RETURNEDData = await signature.signatureReplicaException(RECEIVEDData);
       // console.log(RETURNEDData,"returnded frp")
        if(RETURNEDData.response)
        {
            if(RETURNEDData.sent.length>0)
            {
                //check the users collection for insert purpose and leave it as it is.
                const DATA_TO_BE_Sent = await MATCHData(RETURNEDData.sent);
                const SIGNATURE_TO_BE_SENT = functions.signTransaction(privateKey,DATA_TO_BE_Sent)
                //console.log(DATA_TO_BE_Sent,"from check data");
                return {response:true,data:DATA_TO_BE_Sent,signature:SIGNATURE_TO_BE_SENT}
            }
            else
            {
                return {response:false,reason:"DATA NOT VERIFIED "}
            }
        }
      }
      else
      {
        const SIGNATURE_TO_BE_SENT = functions.signTransaction(privateKey,RECEIVEDData);
        return {response:true,data:RECEIVEDData,signature:SIGNATURE_TO_BE_SENT}
      }
    }
    else
    {
        return {response:false,reason:"SIGNATURE NOT VERIFIED"}
    }
}
const MATCHData = async (data)=>
{
    let data1 =[]

    for(let i = 0;i<data.length;i++)
    {
        let check = await CHECKReplica(data[i].uid);
      //  console.log(check)
        if(check>0)
        {
         // console.log(" available")
        }
        else
        {
            data1.push(data[i]);
        }
    }
    //console.log(data1,"Data 1");
    return data1;

}
const CHECKReplica = async (uid)=>
{
    const data = await a(uid);
    //console.log(data,"data")
    return data;

}
const a = (uid) =>
new Promise((res, rej) => {
  try {
    replica.find({uid:uid}).toArray((err, response) => {
      if (err) {
        rej(err);
      }
  //    console.log(response[response.length-1]);
      res(response.length);
    });
  } catch (e) {
    console.error(e);
  }
});


const DATA_HELPER =  async ()=>
{
  const DATA_SEND = await b();
  return DATA_SEND;
}

const b = () =>
new Promise((res, rej) => {
  try {
    users.find().toArray((err, response) => {
      if (err) {
        rej(err);
      }
      res(response.length);
    });
  } catch (e) {
    console.error(e);
  }
});