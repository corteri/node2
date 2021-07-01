const connection = require('./mhelper').connection();
//connection = connection.connection();
const replica = connection.collection("replica");
const users = connection.collection("users");
const md5 = require('md5');
const { Connection } = require('mongoose');
//const { connections } = require('mongoose');
exports.replicaValidator = async function replicaValidator()
{
    const replica1 =  connection.collection("replica");
  /* const data2 =  await replica1.find();
   data2.toArray((err,response)=>
   {
       if(err)
       {
           throw err;
       }
       else
       {
           console.log(response);
       }
   })
  /*  replica1.find().toArray((err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            console.log(response);
            return callback(response);
        }
    })
    */
    let data = await DataSender();
    return data;
}
exports.userValidator =  async function userValidator()
{
    const data = await userValidatorPromise();
    //if wants to process data
    return data;
}
const userValidatorPromise = ()=>{
    new Promise((res,rej)=>
    {
    let data = [];
    let data2 = [];
    replica.find().toArray((err,response)=>
    {
        if(err)
        {
            rej(err);
        }
        else
        {
            console.length(response.length,"checking the length")
            if(response.length>2)
            {
                //for(let i =1;i<response.length-2;i++)
                //{
                   // const element = response[i];
                  //  const element1 = response[i+1];
                   // let blockchainData =  {uid:element.uid,password:element.password,publicKey:element.publicKey,privateKey:element.privateKey,timestamp:element.timestamp,previousHash:element.previousHash.toString()};
                   // blockchainData = JSON.stringify(blockchainData);
                   // const currentHash = md5(blockchainData);
 //                   let data1 = {uid:element.uid,uuid:element.uuid,collection:element.collection,node:element.node,timestamp:element.timestamp,field:element.field,type:element.type,signature:element.signature,btimestamp:element.btimestamp,previousHash:element.previousHash}
                  //  data1 = JSON.stringify(data);
                    //let currentHash = md5(data1);
                   // if(currentHash===element1.previousHash)
                    //{
                      //  console.log("Hash Verified");
                       // if(i===response.length-1)
                        //{
                          //  data2.push(element1);
                        //}
                        //data2.push(element);
                    //}
                    //else
                    //{
                      //  data.push(element);
                    //}
                //}
                 res({response:true,data:data,data1:response});
            }
            else
            {
                 res({response:false});
            }
        }
    })
})
}



async function DataSender() {
    const data = await a();
    return data;
  }
  const a = () =>
    new Promise(async (res, rej) => {
      try {
          const data = [];
          const verifiedData = [];
     const hello =  await replica.find({type:{$ne:"genesis"}})
     hello.toArray((err,response)=>
        {
            if(err)
            {
                rej(err);
            }
            else
            {
                console.log(response.length,"checking the length")
                if(response.length>0)
                {
                  /*
                    for(let i = 0;i<response.length;i++)
                    {
                        const element = response[i];
                        const sig = element.signature.toJSON();
              //          element.signature = sig;
                    }
                    /*
                    for(let i =2;i<response.length-1;i++)
                    {
                        const element = response[i];
                        const element1 = response[i-1];
                        if(element1.field==null)
                        {
                            element1.field = " ";
                        }
                        //console.log(element1)
                        //let data = {uid:uid,uuid:uuid,collection:collection,node:node,timestamp:timestamp,field:field,type:type,signature:signature,btimestamp:btimestamp,previousHash:previousHash}
                        let data2 = element1.uid.toString()+element1.uuid.toString()+element1.collection.toString()+element1.node.toString()+element1.timestamp.toString()+element1.field.toString()+element1.type.toString()+element1.signature.toString()+element1.btimestamp.toString()+element1.previousHash.toString();
                        let hash = md5(data2);
                       // let currentHash = md5(data22);
                       // console.log(hash)
                        if(element.previousHash===hash)
                        {
                            if(i==2)
                            {
                                verifiedData.push(element1);
                            }
                            verifiedData.push(element);
                           // console.log("Hash Verified");
                        }
                        else
                        {
                             console.log(element,"not verified data")
                            data.push(element);
                        }
                    } */
                   // console.log(data,"it is from validator")
                    res({response:true,verifiedData:response,corruptedData:data});
                }
                else
                {
                    res({response:false});
                }
            }
        })
      } catch (e) {
        console.error(e);
      }
 });