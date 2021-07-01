const net = require('net');
const uuid  = require('uuid-random');
const functions = require('./function');
const fs = require('fs');
const path = require('path')
//const JSONSocket = require('json-socket');
const privateKey = fs.readFileSync(path.join(__dirname,"./keys/private.pem"),'utf8');
//const publicKey = fs.readFileSync(path.join(__dirname,"./keys/public.pem"),'utf8');
const replica = require('./replica');
const sync = require('./sync');
const clientPage = require('./client')
//const checkData = require('./checkData')
const SENDData = require('./SENDData');
//const port = 69;
//const { connections } = require('mongoose');
//const { count } = require('console');
const connection = require('./mhelper').connection();
let c = 0;
const tcpDialer = require('tcp-ping');
//const { emitKeypressEvents } = require('readline');
const node = connection.collection("node")
const isNodeAvailable = require('is-port-reachable');
const io = require('socket.io-client')
//const { publicDecrypt } = require('crypto');
exports.client = async function client()
{
    //let c = 0;
//  let client = new JSONSocket(new net.Socket());

  const data = await replica.replica(privateKey);
  console.log(data,"from replica")
  if(data.data!=undefined||data!=undefined)
{
  if(data.data.length>0)
  {
      //multiple client for data hosting from collection node.
      const getNODE = await getAllNodes();
      //const updtre = await updatekr();
   //   console.log(getNODE);
      const multiNode = await MULTIPLE_NODE_DIALER(getNODE);
      for(let i =1;i<multiNode.length;i++)
      {
          console.log("ENTERED");
          c = 0;
          const element = multiNode[i];
          const ip = element.node_ip;
          const port = element.port;
          const hostPublicKey = element.publicKey;
          const client = io.connect(`http://${element.node_ip}:${element.port}`)
//          client.connect(port,ip,()=> {
    client.on('connect',()=>
    {
        console.log("connected to the server");
        const uid = uuid();
       let data1 =  {data:uid}
        const signature = functions.signTransaction(privateKey,data1);
        //console.log(signature,"from client");
        const data3 = {signature:signature,data:{data:uid},type:"verification",guid:multiNode[0].hash,element:multiNode[0]};
        client.emit("data_transport_protocol",data3);
        client.on('verified_details', function(RECEIVED_DATA) {
            c++;
            console.log(RECEIVED_DATA,c,"verified details");
           // console.log(RECEIVED_DATA,"length",RECEIVED_DATA.length)
           //console.log(JSON.parse(RECEIVED_DATA))
           if(c===1)
           {
               console.log(RECEIVED_DATA);
            if(RECEIVED_DATA.response)
            {
                //console.log("HELLO WORLD",data.data[0].signature,"parsed data",data.data[0].signature.toJSON())
                console.log(data.data[0].signature,"before sending");
                client.emit("verify_response",data)
                //client.sendMessage(data)
                client.on("received_host",async (message)=>
                {
                    console.log("MESSAGE RECEIVED PROCESSING THE ANOTHER REQUEST");
                    if(message.data)
                    {
                    console.log(message,c);
                    const DATA_RECEIVED_SEND_DATA = await SENDData.SENDData(message.data,privateKey,hostPublicKey);
                    client.emit("receive",DATA_RECEIVED_SEND_DATA)
                   // client.sendMessage(DATA_RECEIVED_SEND_DATA);
                 } })
                client.on("last",(message1)=>
                {
                    if(c===2)
                    {
                    const DATA_TO_SYNC = message1.data.data;
                    if(message1.type==="sync")
                    {
                        console.log("IMOK")
                    const syncData =  sync.clientSync(DATA_TO_SYNC,"localhost");
                    if(syncData)
                    {
                        console.log("DONE")
                       // client.end((err)=>
                        //{
                          //  if(err)
                           // {
                             //   throw err;
                           // }
                            //else
                            //{
                              //  console.log("Connection Closed");
                           // }
                       // })
                    }
                }
            }
                })
            }
        }
        });
       // client.sendMessage(data3);
        //console.log("Waiting For Response");

    })
  //          });
            client.on("error",(err)=>
            {
                if(err)
                console.log(err);
            })
            client.on('close', function() {
                console.log('Server Disconnected');
            });
      }
      //const checkDataResponse = await checkData.checkData(data,privateKey,publicKey);
      //console.log(checkDataResponse,"from check data")
  }
}
}


exports.notifyReplica = async function notifyReplica()
{

    const REPLICA_COUNT = await replicaCounter();
    const COUNTER = await counter();
    const getAllNode = await getAllNodes();
    //console.log(`${REPLICA_COUNT}===${COUNTER}`)
     if(REPLICA_COUNT===COUNTER&&getAllNode.length>0)
    {
      //  console.log("client is sleeping......")
        await clientPage.notifyReplica();
    }
    else if(COUNTER<REPLICA_COUNT)
    {
        let countInsert = await COUNTER_INSERT(REPLICA_COUNT);
        if(countInsert)
        {
            //console.log("client fired")
            await clientPage.client();
            await clientPage.notifyReplica();
        }
    }
}
const replicaCounter = ()=>
new Promise((res,rej)=>
{
    const replica = connection.collection("replica")
    replica.countDocuments({},(err,count)=>
    {
        if(err)
        {
            rej(err);
        }
        else
        {
            //console.log(count);
            res(count);
        }
    })
})
const counter = ()=>
new Promise((res,rej)=>
    {
    const counter = connection.collection("counter")
        counter.find().toArray((err,response)=>
        {
            if(err)
            {
                rej(err);
            }
            else
            {
               // console.log(response[response.length-1].count);
                res(response[response.length-1].count);
            }
        })
})
const COUNTER_INSERT = (count)=>
new Promise((res,rej)=>
{
    const counter = connection.collection("counter");
    counter.insertOne({count:count},(err,response)=>
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
});
const MULTIPLE_NODE_DIALER = async(data)=>
{
    const UP_NODES = [];
    const DOWN_NODES = [];
    console.log(data.length,"multiple")
    let c = 0;
    for(let i = 0;i<data.length;i++)
    {
        const element = data[i];
        const check =  await  isNodeAvailable(element.port,{host:element.node_ip})
        if(check)
        {
            c++;
            console.log("UP",element)
            UP_NODES.push(element);
        }
        else
        {
            console.log("DOWN",element)

            DOWN_NODES.push(element);
          //down the project
        }
        const status = await UPDATE_NODES(UP_NODES,DOWN_NODES);
        console.log(c,"up nodes");
        //console.log(DOWN_NODES,"down nodes")
    }
    return UP_NODES;
}
const  UPDATE_NODES = async (UP_NODES,DOWN_NODES)=>
{
    if(UP_NODES.length>0)
    {
        const check = await UP_THE_NODES(UP_NODES);

    }
    if(DOWN_NODES.length>0)
    {
        const check1 = await DOWN_THE_NODES(DOWN_NODES);
    }
    return true;
}
const DOWN_THE_NODES = async (data)=>
{
    let checkU=false;
    for(let i = 0;i<data.length;i++)
    {
        const element = data[i];
        const check = await UPDATE_DOWN_NODES(element.port,element.node_ip);
        if(check)
        {
            checkU = true;

        }
    }
    return checkU;
}

const UP_THE_NODES = async (data)=>
{
    let checkU = false;
    for(let i = 0;i<data.length;i++)
    {
        const element = data[i];
        const check = await UPDATE_UP_NODES(element.port,element.node_ip);
        if(check)
        {
            checkU = true;
        }
    }

}
const UPDATE_UP_NODES = (port,ip)=>
new Promise((res,rej)=>
{
    node.updateOne({$and:[{node_ip:ip},{port:port}]},{$set:{status:"UP"}},(err)=>
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
})
const UPDATE_DOWN_NODES = (port,ip)=>
new Promise((res,rej)=>
{
    node.updateOne({$and:[{node_ip:ip},{port:port}]},{$set:{status:"DOWN"}},(err)=>
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
})


const BOOL_NODE_DIALER = (ip,port)=>
new Promise((res,rej)=>
{
    console.log(port);
    tcpDialer.ping({address:ip,port:port},(err)=>
    {
      if(err)
      {
        console.log(err);
        res(false);
      }
      else
      {
        res(true);
      }
    })
})

const getAllNodes =  ()=>
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
            res(response);
        }
    })
})