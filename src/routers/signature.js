//const e = require('express');
const connection = require('./mhelper').connection()
const con = connection.collection("replica")
const users  = connection.collection("users");
const model = connection.collection("model");
const extra = connection.collection("extra");
const mention = connection.collection("mention")
const notification = connection.collection("notification")
const hashtag = connection.collection("hashtag");
const crypto = require('crypto');
const net = require('net')
const JsonSocket = require('json-socket')
const node = connection.collection("node");
const SF = require('../ServerFunctions')
const functions = require('./function');
//const e = require('express');
const fs = require('fs')
const path = require('path')
const privateKey = fs.readFileSync(path.join(__dirname,"./keys/private.pem"),'utf8');

exports.autoSignatureReplica = function autoSignatureReplica(callback)
{
    let dataArray = [];
    con.find().toArray(async (err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            for(let i = 0;i<response.length;i++)
            {
                const element = response[i];
                console.log(element)
                let publicKey = await publicKey(element.uuid);
                publicKey = publicKey.publicKey;
                let data ={uid:element.uid,uuid:element.uuid,collection:element.collection,node:element.node,timestamp:element.timestamp,field:element.field,type:element.type}
                data = JSON.stringify(data);
                const signature = element.signature;
                const isVerified = crypto.verify("SHA256",Buffer.from(data),publicKey,signature.buffer);
                if(!isVerified)
                {
                    dataArray.push(element);
                }
            }
            return callback(dataArray);
        }
    })
}

exports.signatureReplica =  async function signatureReplica(RECEIVED_DATA)
{
    console.log(RECEIVED_DATA.length,"from simple")
    let DATA_TO_SEND = await signatureReplicaHelper(RECEIVED_DATA);
   // console.log(DATA_TO_SEND,"data which we have to send");
    return DATA_TO_SEND;
}
const signatureReplicaHelper =async (RECEIVED_DATA)=>
{
    try{
        let dataArray = [];
        let sentData = [];
        if(RECEIVED_DATA.length>0)
        {
            for(let i = 0;i<RECEIVED_DATA.length;i++)
            {
                const element = RECEIVED_DATA[i];
                console.log(element,"RD")
                let publicKey1 = await publicKey(element.uuid);
                //console.log(publicKey1)
               // console.log(publicKey1)
                let data ={uid:element.uid,uuid:element.uuid,collection:element.collection,node:element.node,timestamp:element.timestamp,field:element.field,type:element.type}
                data = JSON.stringify(data);
                const signature = element.signature;
               // console.log(signature,"RD")
                const isVerified = crypto.verify("SHA256",Buffer.from(data),publicKey1,Buffer.from(signature));
                if(!isVerified)
                {
                    console.log(element,"verification")
                    dataArray.push(element);
                }
                else
                {
                    console.log(element,"pushing the data inside the protocol")
                    sentData.push(element);
                }
            }
            console.log(sentData,"main proto")
             return({response:true,sent:sentData,stay:dataArray});
        }
        else
        {
            return({response:false});
        }

    }
    catch(err)
    {
        console.log(err);
    }
}

exports.signatureReplicaException =async function signatureReplicaException(RECEIVED_DATA,guid)
{
    console.log(RECEIVED_DATA.length,"from recieved data")
    const DATA_TO_RETURN = await signatureReplicaExceptionHelper(RECEIVED_DATA,guid);
    return DATA_TO_RETURN;
}
const signatureReplicaExceptionHelper = async (RECEIVED_DATA,guid)=>
{

        let dataArray = [];
        let sentData = [];
        console.log(RECEIVED_DATA.length,"from exception");
        if(RECEIVED_DATA.length>0)
        {
            console.log("HELLO WORLD");
            for(let i = 0;i<RECEIVED_DATA.length;i++)
            {
             //   let decision = false;
                const element = RECEIVED_DATA[i];
              //  console.log(element,"element")
              //check the user presence and then follow the other operations
              const check_THE_DATA = await checkDataAvailability(element.uuid,RECEIVED_DATA,guid)
              if(check_THE_DATA.response)
              {
                  if(element.collection==="users")
                  {
                    sentData.push(element);

                  }
                  else if(check_THE_DATA.phase===2)
                  {
                      sentData.push(element);
                  }
                  else
                  {
                let publicKey1 = await publicKey(element.uuid);
                let data ={uid:element.uid,uuid:element.uuid,collection:element.collection,node:element.node,timestamp:element.timestamp,field:element.field,type:element.type}
                data = JSON.stringify(data);
                const signature = element.signature;
                const isVerified = crypto.verify("SHA256",Buffer.from(data),publicKey1,signature.buffer);
                if(!isVerified)
                {
                    if(element.collection==="users")
                    {
                        sentData.push(element);
                    }
                    else
                    {
                    dataArray.push(element);
                }}
                else
                {
                    sentData.push(element);
                }
            }
            }
            }
           // console.log(sentData)
           // console.log({response:true,sent:sentData,stay:dataArray})
             return({response:true,sent:sentData,stay:dataArray});
        }
        else
        {
            return({response:false});
        }
}

exports.autoSignatureUsers = function autoSignatureUsers(callback)
{
    let data1 = []
    users.find().toArray((err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            for(let i = 0;i<response.length;i++)
            {
                const element = response[i];
                let data = {firstname:element.firstname,lastname:element.lastname,uid:element.uid,phone:element.phone,email:element.email,username:element.username,password:element.password,e1:element.e1,timestamp:element.timestamp,node:element.node,publicKey:element.publicKey,privateKey:element.privateKey}
                data = JSON.stringify(data);
                const signature = element.signature;
                const isVerified = crypto.verify("SHA256",Buffer.from(data),publicKey,signature.buffer);
                if(!isVerified)
                {
                    data1.push(element);
                }
            }
            return callback({response:true,data:data1});
        }
    })

}


exports.autoSignatureModel = function autoSignatureModel(callback)
{
    let data1 = []
    model.find().toArray(async (err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            for(let i = 0;i<response.length;i++)
            {
                const element = response[i];
               // let data = {firstname:element.firstname,lastname:element.lastname,uid:element.uid,phone:element.phone,email:element.email,username:element.username,password:element.password,e1:element.e1,timestamp:element.timestamp,node:element.node,publicKey:element.publicKey,privateKey:element.privateKey}
                let data = {data:element.data,tid:element.tid,timestamp:element.timestamp,extra:element.extra,uid:uid};
               data = JSON.stringify(data);
               let publicKey1 = await publicKey(element.uid)
               publicKey1 = publicKey1.publicKey;
                const signature = element.signature;
                const isVerified = crypto.verify("SHA256",Buffer.from(data),publicKey1,signature.buffer);
                if(!isVerified)
                {
                    data1.push(element);
                }
            }
            return callback({response:true,data:data1});
        }
    })

}



exports.autoSignatureHashtag = function autoSignatureHashtag(callback)
{
    let data1 = []
    hashtag.find().toArray(async (err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            for(let i = 0;i<response.length;i++)
            {
                const element = response[i];
                let data = {hashtag:element.hashtag,timestamp:element.timestamp,hid:element.hid,tid:element.tid,uid:element.uid};
                data = JSON.stringify(data);
                const signature = element.signature;
                let publicKey1 =  await publicKey(element.uid);
                publicKey1 = publicKey1.publicKey
                const isVerified = crypto.verify("SHA256",Buffer.from(data),publicKey1,signature.buffer);
                if(!isVerified)
                {
                    data1.push(element);
                }
            }
            return callback({response:true,data:data1});
        }
    })

}



exports.autoSignatureMention = function autoSignatureMention(callback)
{
    let data1 = []
    mention.find().toArray(async (err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            for(let i = 0;i<response.length;i++)
            {
                const element = response[i];
                let data = {uid:uid,sid:sid,rid:rid,notification:notification,attachment:attachment,timestamp:timestamp}
                data = JSON.stringify(data);
                const signature = element.signature;
                let publicKey1 =  await publicKey(element.sid);
                publicKey1 = publicKey1.publicKey
                const isVerified = crypto.verify("SHA256",Buffer.from(data),publicKey1,signature.buffer);
                if(!isVerified)
                {
                    data1.push(element);
                }
            }
            return callback({response:true,data:data1});
        }
    })

}



exports.autoSignatureNotification = function autoSignatureNotification(callback)
{
    let data1 = []
    notification.find().toArray(async (err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            for(let i = 0;i<response.length;i++)
            {
                const element = response[i];
                let data = {uid:uid,sid:sid,rid:rid,notification:notification,attachment:attachment,timestamp:timestamp}
                data = JSON.stringify(data);
                const signature = element.signature;
                let publicKey1 =  await publicKey(element.sid);
                publicKey1 = publicKey1.publicKey
                const isVerified = crypto.verify("SHA256",Buffer.from(data),publicKey1,signature.buffer);
                if(!isVerified)
                {
                    data1.push(element);
                }
            }
            return callback({response:true,data:data1});
        }
    })

}




exports.autoSignatureExtra = function autoSignatureExtra(callback)
{
    let data1 = []
    extra.find().toArray(async (err,response)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            for(let i = 0;i<response.length;i++)
            {
                const element = response[i];
                let data = {tid:element.tid,attachment:element.attachment,timestamp:element.timestamp,links:element.links}
                data = JSON.stringify(data);
                const signature = element.signature;
                let publicKey1 =  await publicKey(element.uid);
                publicKey1 = publicKey1.publicKey
                const isVerified = crypto.verify("SHA256",Buffer.from(data),publicKey1,signature.buffer);
                if(!isVerified)
                {
                    data1.push(element);
                }
            }
            return callback({response:true,data:data1});
        }
    })

}
const checkDataAvailability =  (uid,data,guid)=>
new Promise( (res,rej)=>
{
    users.find({uid:uid}).toArray(async (err,response)=>
    {
        if(err)
        {
            rej(err);
        }
        else
        {
            if(response.length>0)
            {
                res({response:true,phase:1});
            }
            else
            {
                const phase2 = checkInTheChain(data,uid);
                if(phase2)
                {
                    res({response:true,phase:2})
                }
                else
                {
                    const data_to_enter = askForData(uid,guid);
                    if(data_to_enter.response)
                    {
                        const userData = data_to_enter.user;
                        const replicaData = data_to_enter.replica;
                        const userStatus = await insertUSERS(userData);
                        const replicaStatus = await insertREPLICA(replicaData);
                        if(userStatus&&replicaStatus)
                        {
                            res({response:true,phase:3})
                        }
                        else
                        {
                            res({response:false,phase:3})
                        }
                    }
                    else
                    {
                        res({response:false,phase:3})
                    }

                }
            }
        }
    })
})

const askForData = (uid,guid)=>
new Promise(async (res,rej)=>
{
    const nodeStatus = await SF.checkIncomingNodeValidity(guid)
    if(nodeStatus.response)
    {
        const cIp = nodeStatus.data.node_ip;
        const cPort = nodeStatus.data.port;
    const client = new JsonSocket(new net.Socket)
    const connectionStatus = await SF.singleNodeDialer(cIp,cPort);
    const myDetails = await myIP();
    if(connectionStatus)
    {
    client.connect(cPort,cIp,()=>
    {
        console.log("Connected");
        let DATA_TO_SEND ={};
        DATA_TO_SEND.type="ASK_FOR_USER_DATA"
        DATA_TO_SEND.data={uid:uid};
        DATA_TO_SEND.guid = myDetails.hash;
        const signature = functions.signTransaction(privateKey,DATA_TO_SEND.data);
        DATA_TO_SEND.signature = signature;
        client.sendMessage(DATA_TO_SEND,(err)=>
        {
            if(err)
            {
                client.end((err)=>{
                    if(err)
                    {
                        throw err;
                    }})
                //throw err;
            }
        });
        client.on("message",(data)=>
        {
            if(data.type==="RESPONSE_FROM_USER")
            {
                const isVerified = crypto.verify("SHA256",Buffer.from(JSON.stringify(data.data)),nodeStatus.privateKey,Buffer.from(data.signature))
                if(isVerified)
                {
                    console.log("VERIFIED");
                    const userData = data.user;
                    const replicaData = data.replica;
                    client.sendMessage({type:"ASK_FOR_LAST_PHASE"});
                    client.on("message",(data)=>
                    {
                        if(data.data)
                        {
                            res({user:userData,replica:replicaData,response:true});
                        }
                    })

                }
                else
                {
                    console.log("NOT VERIFIED");
                    client.sendEndMessage({response:false,type:"FAILED"});
                }
            }
        })
        //client.sendMessage()
    })
    }
    else
    {
        res({response:false,reason:"NODE_DIAL_FAILED"})

    }}
    else
    {
        res({response:false,reason:"NODE_NOT_AVAILABLE"});
    }
})

const myIP = ()=>
new Promise((res,rej)=>
{
    node.find().toArray((err,response)=>
    {
        if(err)
        {
            rej(err);

        }
        else
        {
            res(response[0]);
        }
    })
})
const checkInTheChain =   (data,uid)=>
{
//    let userData;
    for(let i = 0;i<data.length;i++)
    {
        if(data[i].uuid===uid&&data[i].collection==="users")
        {
            check = true;
           // userData = data[i];
            break;
        }
    }
    if(check)
    {
        return(true);
    }
    else
    {
        return(false)
    }
}
async function publicKey(uid) {
    const data = await a(uid);
   // console.log(data,"data ")
    return data;
  }
  const a = (uid) =>
    new Promise((res, rej) => {
      try {
        users.find({uid:uid}).toArray((err, response) => {
          if (err) {
            rej(err);
          }
      //    console.log(response[response.length-1]);
          res(response[response.length-1].publicKey);
        });
      } catch (e) {
        console.error(e);
      }
 });


 const insertUSERS = (data)=>
 new Promise((res,rej)=>
 {
   users.insertOne(data,(err)=>
   {
       if(err)
       {
           res(false);
           console.log(err);
       }
       else
       {
           res(true);
       }
   })
 })

 const insertREPLICA = (data)=>
 new Promise((res,rej)=>
 {
   replica.insertOne(data,(err)=>
   {
       if(err)
       {
           res(false);
           console.log(err);
       }
       else
       {
           res(true);
       }
   })
 })