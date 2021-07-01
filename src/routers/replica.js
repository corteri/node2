const connection  = require('./mhelper').connection();
const con = connection.collection("replica");
const blockValidator = require('./validater')
const signature = require('./signature')
//const crypto = require('crypto');
const  functions = require('./function')
exports.replica = async function replica(privateKey)
{
    //const replicaData = await init();
    //return replicaData();
    const data = await blockValidator.replicaValidator();
    console.log(data,"verifying the data from replica part")
    console.log(data)
    if(data.response)
    {
        if(data.verifiedData.length>0)
        {
          //  console.log(data.verifiedData.length,"from verifie")
           // console.log(data.corruptedData,"from verifie")

            const signatureData = await signature.signatureReplica(data.verifiedData);
            //console.log(signatureData,"signature data");
            if(signatureData.response)
            {
                if(signatureData.stay.length>2)
                {
                    console.log("DATA IS MANIPULATED")
                }
                else{
             //       console.log(signatureData.stay.length,signatureData.sent.length,"from replica send function")
                    let signatureSign = functions.signTransaction(privateKey,signatureData.sent);
                    return ({data:signatureData.sent,signature:signatureSign,type:"replica"});
                }
            }
            else
            {
                new Error("Getting error in signature replica after signature data response");
            }

        }
        else
        {
            new Error("Data is manipulated needs to be changed");
        }

    }
    else
    {

    }
}
const init = ()=>
{
    new Promise((res,rej)=>
    {
        con.find().toArray((err,response)=>
        {
            if(err)
            {
                rej(err);
            }
            else
            {
                res(response);
            }
        })

    })
}

async function publicKey(uid) {
    const data = await a(uid);
    return data;
  }
  const a = (uid) =>
    new Promise((res, rej) => {
      try {
        users.find({uid:uid}).toArray((err, response) => {
          if (err) {
            rej(err);
          }
          res(response);
        });
      } catch (e) {
        console.error(e);
      }
 });