const net = require('net');
const connection = require('./routers/mhelper').connection();
const node = connection.collection("node");
const node_r = connection.collection("nodeR");
const users = connection.collection("users");
const tcpDialer = require('tcp-ping');
const JsonSocket = require('json-socket');
const publicIp = require('public-ip');
const replica = connection.collection("replica");
const SF = require('./ServerFunctions');
const isPort = require('is-port-reachable')
const io = require('socket.io-client')
//let gip;
//const init1 = async ()=>
//{
 //gip =  await publicIp.v4();
//}
//init1();
exports.giveUserData = async function giveUserData(uid)
{
  const userData = await giveUserDataHelper(uid);
  const replicaData = await replicaGiver(uid);
  return {user:userData,replica:replicaData};
}
const giveUserDataHelper = (uid)=>
  users.find({uid:uid}).toArray((err,response)=>
  {
    if(err)
    {
      rej(err);
    }
    else
    {
      res(response[response.length-1]);
    }
  })

  exports.checkIncomingNodeValidity =  async function checkIncomingNodeValidity(guid)
  {
    const data =  await checkIncomingNodeValidityHelper(guid)
    return data;
  }
  const checkIncomingNodeValidityHelper = (guid)=>
  new Promise((res,rej)=>
  {
    node.find({hash:guid}).toArray((err,response)=>
    {
      if(err)
      {
        throw err;
      }
      else
      {
        if(response.length>0)
        {
          res({response:true,data:response[response.length-1]});
        }
        else
        {
          res({response:false});
        }
      }
    })
  })
const replicaGiver = (uid)=>
new Promise((res,rej)=>
{
  replica.find({$and:[{uuid:uid},{collection:"users"}]}).toArray((err,response)=>
  {
    if(err)
    {
      rej(err);
    }
    else
    {
      res(response[response.length-1])
    }
  })
})
exports.replicaFinish = async  function replicaFinish(uid,guid)
{
  const data = await replicaFinishHelper(uid,guid);
  return data;
}
const replicaFinishHelper = (uid,guid)=>
new Promise(async (rej,res)=>
{
  const DATA = await replicaGiver(uid);
  let sync = DATA.sync;
  sync.push(guid);
  replica.updateOne({$and:[{uuid:uid},{collection:"users"}]},{$set:{sync:sync}},(err)=>
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
exports.checkNodeValidity = async  function checkNodeValidity(publicIP,port)
{
  const data = await checkNodeValidityHelper(publicIP,port);
  return data;
}
const checkNodeValidityHelper = (publicIP,port)=>
new Promise(async (res,rej)=>
{
  const dataHELPER = await node.find({$and:[{node_ip:publicIP},{port:port}]});
  dataHELPER.toArray((err,response)=>
  {
    if(err)
    {
      //console.log(err);
      rej(err);
      //res(false);
    }
    else
    {
      if(response.length>0)
      {
        res(true);
      }
      else
      {
        res(false);
      }
    }
  })
})
exports.checkNodeValidityR = async  function checkNodeValidityR(publicIP,port)
{
  const data = await checkNodeValidityRHelper(publicIP,port);
  return data
}
const checkNodeValidityRHelper = (publicIP,port)=>
new Promise((res,rej)=>
{
  node_r.find({$and:[{node_ip:publicIP},{port:port}]}).toArray((err,response)=>
  {
    if(err)
    {
      //console.log(err);
      rej(err);
      //res(false);
    }
    else
    {
      if(response.length>0)
      {
        res(true);
      }
      else
      {
        res(false);

      }
    }
  })
})
exports.insertNode = async  function insertNode(hash,ip,publicKey,port)
{
  const data = await insertNodeHelper(hash,ip,publicKey,port);
  return data
}
const insertNodeHelper=(hash,ip,publicKey,port)=>
new Promise((res,rej)=>
{
  node.insertOne({hash:hash,node_ip:ip,publicKey:publicKey,status:"UP",port:port},(err)=>
  {
    if(err)
    {
      rej(err)
    }
    else
    {
      res(true);
    }
  })
})
exports.insertNodeMultiple = async  function insertNodeMultiple(data)
{
  const data1 = await insertNodeMultipleHelper(data);
  return data1
}
const insertNodeMultipleHelper = (data)=>
new Promise((res,rej)=>
{
  node.insertMany(data,(err)=>
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
exports.insertNodeMultipleR = async  function insertNodeMultipleR(data)
{
  const data1 = await insertNodeMultipleRHelper(data);
  return data1
}
const insertNodeMultipleRHelper = (data)=>
new Promise(async (res,rej)=>
{
  const RESPONSE_FROM_SORT = await SORT_DATA_R(data);
  if(RESPONSE_FROM_SORT.length>0)
  {
  node_r.insertMany(RESPONSE_FROM_SORT,(err)=>
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
}
else
{
  res(true);
}
})
exports.singleNodeDialer = async  function singleNodeDialer(ip,port)
{
  const data = await isPort(port,{host:ip})
  return data
}
const singleNodeDialerHelper  = (ip,port)=>
new Promise((res,rej)=>
{
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
exports.FETCH_ALL_NODE = async  function FETCH_ALL_NODE(publicIP,port)
{
  const data = await FETCH_ALL_NODE_HELPER(publicIP,port);
  return data
}
const FETCH_ALL_NODE_HELPER = (publicIP,port)=>
new Promise((res,rej)=>
{
  //this time only work for port , but in production change it to original ip address.
  node.find({port:{$ne:port}}).toArray((err,response)=>
  {
    if(err)
    {
      console.log(err);
      rej(err);
    }
    else
    {
      res(response);
    }
  })
})
exports.SORT_DATA = async  function SORT_DATA(data)
{
  const data1 = await SORT_DATA_HELPER(data);
  return data1
}
const SORT_DATA_HELPER = async (data)=>
{
  let DATA_TO_SENT = [];
  for(let i = 0;i<data.length;i++)
  {
    const element = data[i];
    const check = await SF.checkNodeValidity(element.node_ip,element.port)
    if(check)
    {

    }
    else
    {
      DATA_TO_SENT.push(element);
    }
  }
  return DATA_TO_SENT;
}
exports.CHECK_TO_ORIGIN =async function CHECK_TO_ORIGIN(ip,publicKey,port)
{
  console.log("check to origin helper")
  const helloWorldData = await SEND_TO_ORIGIN(ip,publicKey,port);
  if(helloWorldData)
  {
    return true;
  }
  else
  {
    return false;
  }
}
const SEND_TO_ORIGIN = (ip,publicKey,port)=>
new Promise((res,rej)=>
{
  const client = io.connect(`http://127.0.0.1:69`);
  client.on("connect", async ()=>
  {
    console.log("connected for origin")
  client.emit("HELPER_FOR_SINGLE_NODE_PROTOCOL",{type:"HELPER_FOR_SINGLE_NODE_PROTOCOL",ip:ip,publicKey:publicKey,port});
  const CHECK_DATA = await MESSAGE_RECEIVER(client);
console.log("check data origin",CHECK_DATA)
  if(CHECK_DATA)
  {
    res(true);
  }
  else
  {
    res(false);
  }
  })
})
const MESSAGE_RECEIVER = (client)=>
new Promise((res,rej)=>
{
  client.on("response_helper_for_single_node_protocol",(data)=>
  {
    if(data.RESPONSE_PROTOCOL)
    {
      /*client.end((err)=>
      {
        if(err)
        {
          throw err;
        }
      })*/
      console.log(data,"inside message receiver");
      res(true);
    }
    else
    {
      /*
      client.end((err)=>
      {
        if(err)
        {
          throw err;
        }
      })*/
      res(false);
    }
  })
})
exports.SINGLE_NODE_PROTOCOL = async  function SINGLE_NODE_PROTOCOL(data,ip_addr,guid,publicKey,port)
{
 // console.log(guid,publicKey,port,ip_addr,"from main function");
  const data1 = await SINGLE_NODE_PROTOCOL_HELPER(data,ip_addr,guid,publicKey,port);
  return data1
}
const SINGLE_NODE_PROTOCOL_HELPER = async (data,ip_addr,guid,publicKey,port)=>
{
  //console.log(data);
  const LEFT_NODE = [];
  const INSERT_NODE = [];
  //const client = new JsonSocket(new net.Socket);
  for(let i = 0;i<data.length;i++)
  {
    const element = data[i];
    const RESPONSE_FROM_NODE_DIALER = await SF.singleNodeDialer(element.node_ip,element.port);
    if(RESPONSE_FROM_NODE_DIALER)
    {
      const RESPONSE_FROM_CONNECTER = await connectSingleNode(client,ip_addr,element.node_ip,publicKey,guid,port,element.port);
      if(RESPONSE_FROM_CONNECTER)
      {
        INSERT_NODE.push(element);
      }
      else
      {
        LEFT_NODE.push(element);
      }
    }
    else
    {
      LEFT_NODE.push(element);
    }
  }
  console.log(INSERT_NODE,LEFT_NODE);
  return {response:true,left_node:LEFT_NODE,insert_node:INSERT_NODE}
}
const connectSingleNode = (client,ip,ip_addr,publicKey,guid,port,port1)=>
new Promise((res,rej)=>
{
  const client = io.connect(`http://${ip_addr}:${port1}`)
  client.on("connect",port1,ip_addr,()=>
      {
        console.log(ip,publicKey,guid,port,"checking above the single node protocol")
        client.sendMessage({type:"SINGLE_NODE_PROTOCOL",data:{ip:ip,guid:guid,publicKey:publicKey,port:port}});
        client.on("response_single_node_protocol",(SINGLE_PROTOCOL)=>
        {
          console.log(SINGLE_PROTOCOL,"received")
          if(SINGLE_PROTOCOL.type==="S_NODE_AVAILABLE")
          {
            console.log("NODE AVAILABLE");
            res(false)
          }
          else if(SINGLE_PROTOCOL.type==="S_END_RESPONSE")
          {
            if(SINGLE_PROTOCOL.RESPONSE_S)
            {
              res(true);
      //        INSERT_NODE.push(element);
            }
            else
            {
              res(false);
        //      LEFT_NODE.push(element);
            }
          }
          else if(SINGLE_PROTOCOL.RESPONSE_END==="WE_ARE_SORRY")
          {
            console.log("RESTART THE PROCESS");
          }
        })
        //left work on the single node protocol
      })
})
const SORT_DATA_R = async (data)=>
{
  let DATA_TO_SENT = [];
  for(let i = 0;i<data.length;i++)
  {
    const element = data[i];
    const check = await SF.checkNodeValidityR(element.node_ip,element.port)
    if(check)
    {
    }
    else
    {
      DATA_TO_SENT.push(element);
    }
  }
  return DATA_TO_SENT;
}
const R_CHECK = ()=>
new Promise((res,rej)=>
{
  node_r.countDocuments({},(err,count)=>
  {
    if(err)
    {
      console.log(err);
      rej(err);
    }
    else
    {
      res(count);
    }
  })
})
const R_DATA = ()=>
new Promise((res,rej)=>
{
  node_r.find().toArray((err,response)=>
  {
    if(err)
    {
      throw err;
    }
    else
    {
      res(response);
    }
  })
})
const GET_COMPLETE_DATA = (port)=>
new Promise(async (res,rej)=>
{
  let gip = await publicIp.v4();

  node.find({$and:[{node_ip:"127.0.0.1"},{port:port}]}).toArray((err,response)=>
  {
    if(err)
    {
      throw err;
    }
    else
    {
      res(response[response.length-1]);
    }
  })
})

exports.R_FIRE = async function R_FIRE()
{
  const data = await R_FIRE_HELPER();
  return data;
}
const R_FIRE_HELPER = async ()=>
{
  const count = await R_CHECK();
  if(count>0)
  {
    const DATA_TO_SEND = await R_DATA();
    const HOST_DETAILS = await GET_COMPLETE_DATA(port);
    //{hash:hash,node_ip:ip,publicKey:publicKey,status:"UP"}
    const guid = HOST_DETAILS.hash;
    const publicKey = HOST_DETAILS.publicKey
    let gip = "127.0.0.1";
    const port = HOST_DETAILS.port

    const PROTOCOL_RESPONSE = await SF.SINGLE_NODE_PROTOCOL(DATA_TO_SEND,"127.0.0.1",guid,publicKey,port);
    if(PROTOCOL_RESPONSE)
    {
      const MATCH_RESPONSE = await MATCH();
      if(MATCH_RESPONSE)
      {
        res(true);
      }
      else
      {
        res(false);
      }

    }
    else
    {
      return false;
    }

  }
}
//module.exports = checkNodeValidity;
const MATCH =async ()=>{
    const R_DATA_RESPONSE = await R_DATA();
    let check = false;
  //  const C_DATA_RESPONSE = await FETCH_ALL_NODE(gip);
    if(R_DATA_RESPONSE.length>0)
    {
      for(let i = 0;i<R_DATA_RESPONSE.length;i++)
      {
        const element1 = R_DATA_RESPONSE[i];
        const xex = await search_send(element1.node_ip,element1.port);
        if(xex)
        {
          const XEX_RESPONSE = await AND_DELETE(element1.node_ip,element1.port);
          if(XEX_RESPONSE)
          {
            check = true;
          }
        }
      }
      return check;
    }
    else
    {
      return check;
    }
  }
  const AND_DELETE = (ip,port)=>
new Promise((res,rej)=>
{
  node_r.deleteOne({$and:[{node_ip:ip},{port:port}]},(err)=>
  {
    if(err)
    {
      throw err;
      console.log(err);
    }
    else
    {
      res(true);
    }
  })
})
const search_send = (ip,port)=>
new Promise((res,rej)=>
{
  node.find({$and:[{node_ip:ip},{port:port}]}).toArray((err,response)=>
  {
    if(err)
    {
      throw err;
    }
    else
    {
      if(response.length>0)
      {
        res(true);
      }
      else
      {
        res(false);
      }

    }
  })
})

exports.getHostDetails = async function getHostDetails(ip,port)
{
  const data = await getHostDetailsHelper(ip,port);
  return data;
}
const getHostDetailsHelper = (ip,port)=>
new Promise((res,rej)=>
{
  node.find({$and:[{ip:ip},{port:port}]}).toArray((err,response)=>
  {
    if(err)
    {
      rej(err);
    }
    else
    {
      res(response[response.length-1]);
    }
  })
})
/*
checkNodeValidity();
singleNodeDialer();
insertNode()
SORT_DATA()
SINGLE_NODE_PROTOCOL()
insertMultiple()
insertMultipleR()
FETCH_ALL_NODE()
*/
/*
module.exports = checkNodeValidityR;
module.exports = checkNodeValidity;
module.exports = singleNodeDialer;
module.exports = insertNode;
module.exports = SORT_DATA;
module.exports = SINGLE_NODE_PROTOCOL;
module.exports = insertNodeMultiple;
module.exports = insertNodeMultipleR;
module.exports = FETCH_ALL_NODE;
module.exports = R_FIRE;
//helper_functions
/*
SORT_DATA_R()
R_CHECK()
R_DATA()
GET_COMPLETE_DATA()
R_FIRE()
MATCH()
AND_DELETE()
search_send()
*/