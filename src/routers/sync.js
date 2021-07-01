const replica = require('./mhelper').connection().collection("replica");
const sync = require('./sync');
exports.serverSync = async function serverSync(data,node)
{
    const RECEIVED_DATA = await serverSyncHelper(data);
    if(RECEIVED_DATA)
    {
        const RECEIVED_DATA_CLIENT = await sync.clientSync(data,node);
        if(RECEIVED_DATA_CLIENT)
        {
            return true;
        }
        else
        {
          return false;
        }
       return true;
    }
    else
    {
        return false;
    }

}
const serverSyncHelper = async (data)=>
{
    const data1 = await serverSyncExceptionHandler(data);
    if(data1.length>0)
    {
        const DATA_TO_SEND = await init(data1);
        return DATA_TO_SEND;
    }
    else
    {
        return true;
    }
}
const init = (data)=>
new Promise((res,rej)=>
{
    replica.insertMany(data,(err)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            res(true);
        }
    })
})
const serverSyncExceptionHandler = async (data)=>
new Promise(async (res,rej)=>
{
    const DATA_TO_SEND = [];
    for(let i = 0;i<data.length;i++)
    {
        const element = data[i];
        const check = await syncDataChecker(element.uid);
        if(check)
        {

        }
        else
        {
            DATA_TO_SEND.push(element);
        }
    }
    res(DATA_TO_SEND);
})

const syncDataChecker = (uid)=>
new Promise((res,rej)=>
{
    replica.find({uid:uid}).toArray((err,response)=>
    {
        if(err)
        {
            rej(err);
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




exports.clientSync = async function clientSync(data,node)
{
    let check = false;
    for(let i = 0;i<data.length;i++)
    {
        const element = data[i];
        let sync = await getClientSync(element.uid);
        console.log(sync,"sync")
        sync.push(node);
        let response = await clientSyncHelper(element.uid,sync);
        if(response)
        {
            check = true;
        }
    }
    return check;
}

const clientSyncHelper = (uid,sync)=>
new Promise((res,rej)=>
{
    replica.updateOne({uid:uid},{$set:{sync:sync}},(err)=>
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


const getClientSync = (uid)=>
    new Promise((res,rej)=>
    {
        replica.find({uid:uid}).toArray((err,response)=>
        {
            if(err)
            {
                throw err;
            }
            else
            {
                res(response[response.length-1].sync);
            }
        })
    })