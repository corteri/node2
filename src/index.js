//const net = require('net');
const client1 = require('./routers/client');
const fs = require('fs');
const checkData = require('./routers/checkData')
const path = require('path')
const  ReceiveData = require('./routers/ReceiveData');
const sync = require('./routers/sync')
const functions = require('./routers/function')
//const publicKey = fs.readFileSync(path.join(__dirname,"./routers/keys/public.pem"),"utf-8");
const crypto = require('crypto');
//const JsonSocket = require('json-socket');
const privateKey = fs.readFileSync(path.join(__dirname,"./routers/keys/private.pem"),'utf8');
let publicKey = fs.readFileSync(path.join(__dirname,"./routers/keys/public.pem"),'utf8');
const SEND_DATA = require('./routers/SENDData');
let c = 0;
const SF = require('./ServerFunctions')
//const client = new JsonSocket(new net.Socket());
//let c1 = 0;
const io = require('socket.io-client')
const firstBornA = require('./routers/firstBornA');
const uuid = require('uuid-random');
//const publicIP = require('public-ip')
const publicIp = require('public-ip');
const generateKeyPair = require('./routers/generator');
const port = 69;
const express = require('express');
const app = express();
const httpServer = require('http')
const server = httpServer.createServer(app);
const {Server} = require('socket.io')
const socket = new Server(server);
//const { getEventListener } = require('events');
//const e = require('express');
//const publicIp = require('public-ip');
const init = async()=>
{
  let gip = "127.0.0.1"
  const DataCheck = await SF.checkNodeValidity("127.0.0.1",port);
  if(DataCheck)
  {
    console.log("NODE REGISTERED")
  }
  else
  {
    console.log("GENERATING KEY PAIR........");
    const resG = await generateKeyPair.generateKeyPair();
    if(resG)
    {
      console.log("KEY PAIR GENERATED SUCCESSFULLY.....");
      console.log("RESTARTING SYSTEM");
     publicKey = fs.readFileSync(path.join(__dirname,"./routers/keys/public.pem"),'utf8');
     console.log("NEW KEY PAIR GENERATED")
//      process.exit(1);
    }
    const nodeHash = uuid();
    const ip =  gip
    console.log(ip,"MY IP ADDRESS")
    /* CHANGE THE IP HERE WITH THE HARD CODED ONE */
    const conStatus = await SF.singleNodeDialer("127.0.0.1",69);
      if(conStatus)
      {
        const client = io.connect(`http://127.0.0.1:69`);
        client.on("connect",()=>
        {
          console.log("SERVER CONNECTED");
          client.emit("CODE_ADD_ME",{guid:nodeHash,ip:"127.0.0.1",publicKey:publicKey})
         // client.sendMessage({guid:nodeHash,ip:"127.0.0.1",publicKey:publicKey,type:"CODE_ADD_ME",port:port});
          console.log("DOWNLOADING THE DATA PLEASE WAIT")
          client.on("response_code_add_me",async (data)=>
          {
            console.log(data);
            if(data.type==="NODE_AVAILABLE")
            {
              console.log("NODE AVAILABLE");
            }
            else if(data.type==="FETCHED_NODE")
            {
              if(data.RESPONSE)
              {
                const res = await SF.insertNode(nodeHash,"127.0.0.1",publicKey,port);
                if(res)
                {
                if(data.data.length>0)
                {
                  const firstBorn = await data.firstBorn;
                  console.log("INSERTING DATA INSIDE THE DATABASE")
                  const getObj =  await firstBornA.ACCEPT_THE_FIRST_BORN(firstBorn);
                  const NEW_DATA = await SF.SORT_DATA(data.data);
                  console.log(NEW_DATA,"new data")
                  if(NEW_DATA.length>0)
                  {
                  const DATA_FROM_PROTOCOL = await SF.SINGLE_NODE_PROTOCOL(data.data,ip,nodeHash,publicKey,port);
                  console.log(DATA_FROM_PROTOCOL,"from protocol")
                  if(DATA_FROM_PROTOCOL.response)
                  {
                    /*WE HAVE TO CHECK THE LENGTH HERE*/
                    const NODE_INSERT_RESPONSE = await SF.insertNodeMultiple(DATA_FROM_PROTOCOL.insert_node);
                    if(NODE_INSERT_RESPONSE)
                    {
                      const NODE_INSERT_RESPONSE_R = await SF.insertNodeMultipleR(DATA_FROM_PROTOCOL.left_node);
                      if(NODE_INSERT_RESPONSE_R)
                      {
                        console.log("SUCCESSFULLY INSERTED R");
                      }
                      console.log("YOU ARE SUCCESSFULLY CONNECTED TO THE NETWORK")
                    }
                  }
                    //DIAL TO THE NODE FOR INSERTION;
                  }
                }
              }
                //step: check data availability
                //perform multi insert formula with single search entity
              }
              else
              {

              }
            }
          })
      })
        client.on('error',(err)=>
        {
          console.log(err);
        })
      }
      else
      {
        console.log("TRY AGAIN");
      }
      //call add me.
    }
}
init();

socket.on('connection',(socket)=>
{
  socket.on("data_transport_protocol",async (data)=>
  {
    const RECEIVED_DATA = data;
    if(data.type==="verification")
    {
        if(data.guid!=null||data.guid!=undefined)
        {
          console.log("IM HERE")
          const nodeStatus = await SF.checkIncomingNodeValidity(data.guid)
          const guid = data.guid;
          //let add = []
          //add.push(data.element);
          console.log(nodeStatus)
         // const justF = await SF.updatekrf(data.element.publicKey,data.guid)
          //const hostDetails = await SF.getHostDetails(hostIP,hostPORT);
        if(nodeStatus.response)
        {
          const hostPublicKey = nodeStatus.data.publicKey;
        const RECEIVED_DATA = data;
        console.log(RECEIVED_DATA.type)
        if(RECEIVED_DATA.type==="verification")
        {
          //console.log(hostPublicKey,"understood")
          const UID = RECEIVED_DATA.data;
          //console.log(JSON.stringify(UID));
          //console.log(Buffer.from(JSON.stringify(UID)),"from server")
          const SIGNATURE = RECEIVED_DATA.signature;
          //console.log(SIGNATURE,"ssssssssss")
          let bufferData = Buffer.from(SIGNATURE)
    //      console.log(SIGNATURE,"from server")
          //console.log(Buffer.from(UID))
          const isVerified = crypto.verify("SHA256",Buffer.from(JSON.stringify(UID)),hostPublicKey,bufferData);
          //console.log(isVerified)
          //console.log(isVerified,"checking")
          if(isVerified)
          {
            console.log("inside the verified")
            //socket.sendMessage({response:true,message:"Server is ready to accept the data"});
            socket.emit("verified_details",{response:true,message:"Server is ready to accept the data"})
            socket.on("verify_response",async (REPLICA_RECEIVED_DATA)=>
            {
              c++;
              //console.log(REPLICA_RECEIVED_DATA.type,"checking the response");
              console.log(REPLICA_RECEIVED_DATA,"counter",c);
              if(REPLICA_RECEIVED_DATA.type==="replica")
              {
                console.log("hello baby")
                if(c===1)
                {
                  const new_data = REPLICA_RECEIVED_DATA.data;
                const checkReceivedData = await checkData.checkData(REPLICA_RECEIVED_DATA,privateKey,hostPublicKey,guid)
                //console.log(checkReceivedData,"RECEIVED DATA");
                if(checkReceivedData.response)
                {
                  //console.log(checkReceivedData)
                  socket.emit("received_host",{data:checkReceivedData,type:"sync"});
                  socket.on("receive",async (message)=>
                  {
                    let  RECEIVED_DATA_FROM_RECEIVE;
                    if(message.type==="receive")
                    { RECEIVED_DATA_FROM_RECEIVE = await ReceiveData.RECEIVEData(privateKey,hostPublicKey,message);
                    }//console.log(RECEIVED_DATA,"checking the health");
                    if(RECEIVED_DATA_FROM_RECEIVE.response)
                    {
                      console.log("SENDING THE MESSAGE",c);
                      const SYNC_RESPONSE = await sync.serverSync(new_data,"localhost");
                      if(SYNC_RESPONSE)
                      {
                        socket.emit("last",{sync:checkReceivedData,response:true,node:"localhost",type:"sync"})
                        socket.disconnect((disconnect)=>
                        {
                          if(disconnect)
                          {
                            console.log(disconnect);
                          }
                        })
//                      socket.sendMessage({sync:checkReceivedData,response:true,node:"localhost",type:"sync"});
                      console.log("DATA SENT")
                      }
                      else
                     {
                     console.log("HAVE A PROBLEM");
                      }
                  }
                    else
                    {
                      //socket.sendEndMessage("DATA IS MANIPULATED",(err)=>
                      //{
                        //if(err)
                       // {
                         // throw err;
                        //}
                        //else
                        //{
                          //console.log("Connection Closed");
                        //}
                      //})
                    }
                  })
                  /*
                  socket.sendMessage({data:checkReceivedData,type:"sync"},(err)=>
                  {
                    if(err)
                    {
                      throw err;
                    }
                    else
                    {
                      socket.on("message", async (message)=>
                      {
                        //console.log(message,"tisra",c)
                        if(c===2)
                        {
                      }
                      })
                    }
                  });
                }
     //           console.log("CLIENT IS SENDING THE DATA")
              }
            }
            })*/
          }
          else
          {
            socket.emit("verified",{response:false,message:"Keys not matched"});
          //  socket.sendMessage({response:false,message:"Keys not matched"});
          }
        }
      }
      else
      {
        socket.disconnect((close)=>
        {
          if(close)
          {
            console.log("Connection Closed");
          }
        })
        socket.end((err)=>
        {
          if(err)
          {
            throw err;
          }
          else
          {
            console.log("CONNECTION CLOSED");
          }
        })
      }
    })
  }
}
        }
      }
    }
  })
  //const hostIP = socket.remoteAddress;
  //const hostPORT = socket.remotePort
  //console.log(hostIP,hostPORT,"this is ")
//socket = new JsonSocket(socket);
//console.log(socket);

//let gip = await publicIp.v4();
//helper for single_node_protocol

socket.on("ASK_FOR_USER_DATA",async (data)=>
{
  if(data.type==="ASK_FOR_USER_DATA")
  {
    //const port = data.port;
    const guid = data.guid;
    const nodeStatus = await SF.checkIncomingNodeValidity(guid)
    if(nodeStatus.response)
    {
    const publicKey = nodeStatus.data.publicKey;
    let dataAssigned = data.data;
    const isVerified = crypto.verify("SHA256",Buffer.from(JSON.stringify(dataAssigned)),publicKey,Buffer.from(dataAssigned.signature))
    if(isVerified)
    {
      const uid = dataAssigned.uid;
      const DATA = await SF.giveUserData(uid);
      const signature = functions.signTransaction(privateKey,DATA);
      let DATA_TO_SEND = {}
      DATA_TO_SEND.signature = signature;
      DATA_TO_SEND.data = DATA;
      DATA_TO_SEND.type="RESPONSE_FROM_USER"
      socket.emit("RESPONSE_FROM_USER",{DATA_TO_SEND});
      socket.on("message",async (data)=>
      {
        if(data.type==="ASK_FOR_DATA_LAST_PHASE")
        {
          if(data.response)
          {
            const endData = await SF.replicaFinish(uid,guid);
            socket.sendEndMessage({data:endData,type:"LAST_MESSAGE"},(err)=>
            {
              throw err;
            })
          }
        }
      })

    }
    else
    {
      socket.end((err)=>
      {
        if(err)
        {
          throw err;
        }
        else
        {
          console.log("SOCKET END NON VERIFIED");
        }
      })

    }
  }
  else
  {
    socket.end((err)=>
    {
      if(err)
      {
        throw err;
      }
      else
      {
        console.log("SOCKET END");
      }
    })
  }

  }
})
socket.on("HELPER_FOR_SINGLE_NODE_PROTOCOL",async (data)=>
{
  if(data.type==="HELPER_FOR_SINGLE_NODE_PROTOCOL")
  {
    //console.log("HELPER FOR SINGLE NODE PROTOCOL")
    const ip = data.ip;
    const port = data.port;
    const publicKey = data.publicKey;
    const check = await SF.checkNodeValidity(ip,port);
    console.log(check,"inside HF")

    let DATA_TO_BE_SENT = {};
    if(check)
    {
      DATA_TO_BE_SENT.RESPONSE_PROTOCOL=true;

    //  socket.sendMessage({RESPONSE_PROTOCOL:true})
    }
    else
    {
      DATA_TO_BE_SENT.RESPONSE_PROTOCOL =false;
    }
    console.log("ITS ORIGIN DATA",DATA_TO_BE_SENT)
    socket.emit("response_helper_for_single_node_protocol",DATA_TO_BE_SENT)
  }
})
//single_node_protocol
socket.on("SINGLE_NODE_PROTOCOL",async (message)=>
{
  if(message.type==="SINGLE_NODE_PROTOCOL")
  {
    const publicIP = message.data.ip;
    const guid = message.data.guid;
    const publicKey = message.data.publicKey;
    const port = message.data.port
    const validateNode = await SF.checkNodeValidity(publicIP,port);
    console.log("Inside snp",validateNode)
    if(validateNode)
    {
      socket.emit("response_single_node_protocol",{type:"S_NODE_AVAILABLE"});
      //send like there is data available;
    }
    else
    {
    //  const client2 = new JsonSocket(new net.Socket)
      console.log(publicIP,port)
    console.log("Inside snp",validateNode,"now inside the origin to check further")

      const DATA_FROM_ORIGIN = await SF.CHECK_TO_ORIGIN(publicIP,publicKey,port);
      const node_dialer_status = await SF.singleNodeDialer(publicIP,port);
    console.log("Inside snp",DATA_FROM_ORIGIN,"inside the response for origin")
    console.log("Inside snp",node_dialer_status,"node dialer status")
      if(DATA_FROM_ORIGIN)
      {
    console.log("Inside snp for sending")
      if(node_dialer_status)
      {
      let insert_node_status = await SF.insertNode(guid,publicIP,publicKey,port);
      if(insert_node_status)
      {
        console.log("Insertion successful")
        socket.emit("response_single_node_protocol",{type:"S_END_RESPONSE",RESPONSE_S:true});
      // const newDataThrow = await FETCH_ALL_NODE(publicIP,gip);
  //     const DATA_TO_BE_SENT = {data:newDataThrow,type:"FETCHED_NODE",RESPONSE:true};
    //   socket.sendEndMessage(DATA_TO_BE_SENT);
      }
      else
      {
        console.log("Insertion unsuccess")
        socket.emit("response_single_node_protocol",{type:"S_END_RESPONSE",RESPONSE_S:false});
        //if data not inserted
      }
      }
      else
      {
     /*   socket.end((err)=>
        {
          if(err)
          {
            throw err;
          }
          else
          {
            console.log("CONNECTION CLOSED");
          }
        })*/
        console.log("node down");
        //if node is DOWN
      }
    }
    else
    {
         console.log("we are sorry")

          socket.emit("response_single_node_protocol",{RESPONSE_END:"WE_ARE_SORRY"});
    }
    }
  }
})
//add me protocol
socket.on("CODE_ADD_ME",async (message)=>
{
  let gip = await publicIp.v4();
  //c++;
  if(message.type==="CODE_ADD_ME")
  {
   // console.log("YOU ARE ADDED")
   const publicIP = message.ip;
   const guid = message.guid;
   const publicKey = message.publicKey;
   const port = message.port;
   const validateNode = await SF.checkNodeValidity(publicIP,port);
   if(validateNode)
   {
     socket.emit("response_code_add_me",{type:"NODE_AVAILABLE"})
   //  socket.sendEndMessage({type:"NODE_AVAILABLE"});
     //send like there is data available;
   }
   else
   {
     const node_dialer_status = await SF.singleNodeDialer(publicIP,port);
     if(node_dialer_status)
     {
     let insert_node_status = await SF.insertNode(guid,publicIP,publicKey,port);
     if(insert_node_status)
     {
       /*.......WE HAVE TO CHECK IT.....*/
      const newDataThrow = await SF.FETCH_ALL_NODE("127.0.0.1",port);
      const FIRST_BORN  = await SEND_DATA.firstBorn();
      const DATA_TO_BE_SENT = {data:newDataThrow,type:"FETCHED_NODE",RESPONSE:true,firstBorn:FIRST_BORN};
      socket.emit("response_code_add_me",DATA_TO_BE_SENT);
     }
     else
     {
       socket.emit("response_code_add_me",{type:"FETCHED_NODE",RESPONSE:false});
       //if data not inserted
     }
     }
     else
     {
       /*
       socket.end((err)=>
       {
         if(err)
         {
           throw err;
         }
         else
         {
           console.log("CONNECTION CLOSED");
         }
       })*/
       //if node is DOWN
     }
   }
  // socket.sendMessage({type:"RESPONSE_FROM_ADD_ME"});
  }
})
//const message1 = await firstHandShake({type:"firstHandShake",message:"Connection Establish"},socket);
//if(message1)
//{
//socket.sendMessage("Hii You Are Now Connected To THE DEMOCRATIC WEB WE ARE VERIFYING YOU IDENTITY PLEASE WAIT.....");
  //console.log(socket.remoteAddress);
  //console.log(socket.remotePort);
  socket.on("message",async (data)=>
  {
   // let hello = Buffer.from(data);
    //console.log(hello)
   // const hostIP = await socket.remoteAddress;
    //const hostPORT = await socket.remotePort;
    //console.log(hostIP,"ip");
    //console.log(hostPORT,"port")
//    console.log(data.guid,"guid")
if(data.type==="verification")
{
    if(data.guid!=null||data.guid!=undefined)
    {
      console.log("IM HERE")
      const nodeStatus = await SF.checkIncomingNodeValidity(data.guid)
      //let add = []
      //add.push(data.element);
      console.log(nodeStatus)
     // const justF = await SF.updatekrf(data.element.publicKey,data.guid)
      //const hostDetails = await SF.getHostDetails(hostIP,hostPORT);
    if(nodeStatus.response)
    {
      const hostPublicKey = nodeStatus.data.publicKey;
    const RECEIVED_DATA = data;
    console.log(RECEIVED_DATA.type)
    if(RECEIVED_DATA.type==="verification")
    {
      console.log(hostPublicKey,"understood")
      const UID = RECEIVED_DATA.data;
      //console.log(JSON.stringify(UID));
      //console.log(Buffer.from(JSON.stringify(UID)),"from server")
      const SIGNATURE = RECEIVED_DATA.signature;
      //console.log(SIGNATURE,"ssssssssss")
      let bufferData = Buffer.from(SIGNATURE)
//      console.log(SIGNATURE,"from server")
      //console.log(Buffer.from(UID))
      const isVerified = crypto.verify("SHA256",Buffer.from(JSON.stringify(UID)),hostPublicKey,bufferData);
      //console.log(isVerified)
      //console.log(isVerified,"checking")
      if(isVerified)
      {
        console.log("inside the verified")
        socket.sendMessage({response:true,message:"Server is ready to accept the data"});
        socket.on("message",async (REPLICA_RECEIVED_DATA)=>
        {
          c++;
          //console.log(REPLICA_RECEIVED_DATA.type,"checking the response");
          console.log(REPLICA_RECEIVED_DATA,"counter",c);
          if(REPLICA_RECEIVED_DATA.type==="replica")
          {
            console.log("hello baby")
            if(c===1)
            {
              const new_data = REPLICA_RECEIVED_DATA.data;
            const checkReceivedData = await checkData.checkData(REPLICA_RECEIVED_DATA,privateKey,hostPublicKey,guid)
            //console.log(checkReceivedData,"RECEIVED DATA");
            if(checkReceivedData.response)
            {
              //console.log(checkReceivedData)
              socket.sendMessage({data:checkReceivedData,type:"sync"},(err)=>
              {
                if(err)
                {
                  throw err;
                }
                else
                {
                  socket.on("message", async (message)=>
                  {
                    //console.log(message,"tisra",c)
                    if(c===2)
                    {
                    let  RECEIVED_DATA_FROM_RECEIVE;
                    if(message.type==="receive")
                    { RECEIVED_DATA_FROM_RECEIVE = await ReceiveData.RECEIVEData(privateKey,hostPublicKey,message);
                    }//console.log(RECEIVED_DATA,"checking the health");
                    if(RECEIVED_DATA_FROM_RECEIVE.response)
                    {
                      console.log("SENDING THE MESSAGE",c);
                      const SYNC_RESPONSE = await sync.serverSync(new_data,"localhost");
                      if(SYNC_RESPONSE)
                      {
                      socket.sendMessage({sync:checkReceivedData,response:true,node:"localhost",type:"sync"});
                      console.log("DATA SENT")
                      }
                  else
                  {
                     console.log("HAVE A PROBLEM");
                   }}
                    else
                    {
                      //socket.sendEndMessage("DATA IS MANIPULATED",(err)=>
                      //{
                        //if(err)
                       // {
                         // throw err;
                        //}
                        //else
                        //{
                          //console.log("Connection Closed");
                        //}
                      //})
                    }
                  }
                  })
                }
              });
            }
 //           console.log("CLIENT IS SENDING THE DATA")
          }
        }
        })
      }
      else
      {
        socket.sendMessage({response:false,message:"Keys not matched"});
      }

    }
  }
  else
  {
    socket.end((err)=>
    {
      if(err)
      {
        throw err;
      }
      else
      {
        console.log("CONNECTION CLOSED");
      }
    })
  }
}
  }
// console.log(data.toString(),"from port",socket.remotePort)
})
  socket.on("close",(err)=>
  {
    if(err)
    {
      throw err;
    }
    else
    {
      console.log("Client Disconnected");
    }
  })
//}  //see here
})
const firstHandShake = (message,socket)=>
new Promise((res,rej)=>
{
  try{
    socket.sendMessage(message,(err)=>
    {
      if(err)
      {
        rej(err);
      }
      else
      {
        res(true);
      }
    })
  }
  catch(err)
  {
    console.log(err);
  }
})
server.listen(port,()=>
{
  client1.notifyReplica();
  console.log(`socket server is listening on port: ${port}`)
})
//server.listen((port),(err)=>
//{
 // if(err)
  //{
   // throw err;
  //}
  //else
  //{
    //client1.notifyReplica();
    //console.log("TCP server started")
    //setInterval(async ()=>
    //{
     // await SF.R_FIRE();
    //},10000000)
  //}
//})
