const connection = require('./mhelper').connection();
const user = connection.collection("users");
const model = connection.collection("model");
const likes = connection.collection("likes");
const hashtag = connection.collection("hashtag");
const hashtagf = connection.collection("hashtagf");
const mention = connection.collection("mention");
const notification = connection.collection("notification");
const extra = connection.collection("extra");
const replica = connection.collection("replica");
const crypto = require('crypto')
//const e = require('express');
const functions = require('./function');

exports.firstBorn = async function firstBorn()
{
    const userData = await userBorn();
    const modelData = await modelBorn();
    const likesData = await likesBorn();
    const hashtagData = await hashtagBorn();
    const hashtag_fData = await hashtag_fBorn();
    const mentionData = await mentionBorn();
    const notificationData = await notificationBorn();
    const extraData = await extraBorn();
    const replicaData = await replicaBorn();
    return {user:userData,model:modelData,likes:likesData,hashtag:hashtagData,hashtag_f:hashtag_fData,mention:mentionData,notification:notificationData,extra:extraData,replica:replicaData}
}

const userBorn = ()=>
new Promise((res,rej)=>
{
    user.find().toArray((err,response)=>
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
const modelBorn = ()=>
new Promise((res,rej)=>
{
    model.find().toArray((err,response)=>
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


const likesBorn = ()=>
new Promise((res,rej)=>
{
    likes.find().toArray((err,response)=>
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

const hashtagBorn = ()=>
new Promise((res,rej)=>
{
    hashtag.find().toArray((err,response)=>
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

const hashtag_fBorn = ()=>
new Promise((res,rej)=>
{
    hashtagf.find().toArray((err,response)=>
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

const mentionBorn = ()=>
new Promise((res,rej)=>
{
    mention.find().toArray((err,response)=>
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


const notificationBorn = ()=>
new Promise((res,rej)=>
{
    notification.find().toArray((err,response)=>
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



const extraBorn = ()=>
new Promise((res,rej)=>
{
    extra.find().toArray((err,response)=>
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


const replicaBorn = ()=>
new Promise((res,rej)=>
{
    replica.find().toArray((err,response)=>
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




exports.SENDData = async function SENDData(dataRECEIVED,privateKey,hostPublicKey)
{
  //  console.log(dataRECEIVED.signature,"recieved the dat")
    let signature = dataRECEIVED.signature
    const isVerified = crypto.verify("SHA256",Buffer.from(JSON.stringify(dataRECEIVED.data)),hostPublicKey,Buffer.from(signature));
if(isVerified)
{
    let USER_UPDATE = [];
    let USER_INSERT = [];
    let MODEL_INSERT = [];
    let MODEL_UPDATE = [];
    let MODEL_DELETE = [];
    let LIKES_INSERT = [];
    let LIKES_DELETE = [];
    let HASHTAG_F_INSERT = [];
    let HASHTAG_F_UPDATE = [];
    let HASHTAG_INSERT = [];
    let HASHTAG_DELETE = [];
    let MENTION_INSERT = [];
    let MENTION_DELETE = [];
    let NOTIFICATION_INSERT = [];
    let NOTIFICATION_DELETE = [];
    let EXTRA_INSERT = [];
    let EXTRA_DELETE = [];
    let EXTRA_UPDATE = [];
    for(let i = 0;i<dataRECEIVED.data.length;i++)
    {
        const element = dataRECEIVED.data[i];
        switch (element.collection) {
            case "users":
                if(element.type==="insert")
                {
                    USER_INSERT.push(element);
                }
                else if(element.type==="update")
                {
                    USER_UPDATE.push(element);
                }
                break;
            case "model":
                if(element.type==="insert")
                {
                    MODEL_INSERT.push(element);
                }
                else if(element.type==="update")
                {
                    MODEL_UPDATE.push(element);
                }
                else if(element.type==="delete")
                {
                    MODEL_DELETE.push(element);
                }
                break;
            case "likes":
                if(element.type==="insert")
                {
                    LIKES_INSERT.push(element);
                }
                else if(element.type==="delete")
                {
                    LIKES_DELETE.push(element);
                }
                break;
            case "hashtag":
                if(element.type==="insert")
                {
                    HASHTAG_INSERT.push(element);
                }
                else if(element.type==="delete")
                {
                    HASHTAG_DELETE.push(element);
                }
                break;
            case "hashtagf":
                if(element.type==="insert")
                {
                    HASHTAG_F_INSERT.push(element);
                }
                else if(element.type==="update")
                {
                    HASHTAG_F_UPDATE.push(element);
                }
                break;
            case "mention":
                if(element.type==="insert")
                {
                    MENTION_INSERT.push(element);
                }
                else if(element.type==="delete")
                {
                    MENTION_DELETE.push(element);
                }
                break;
            case "extra":
                if(element.type==="insert")
                {
                    EXTRA_INSERT.push(element);
                }
                else if(element.type==="update")
                {
                    EXTRA_UPDATE.push(element);
                }
                else if(element.type==="delete")
                {
                    EXTRA_DELETE.push(element);
                }
                break;
            case "notification":
                if(element.type==="insert")
                {
                    NOTIFICATION_INSERT.push(element);
                }
                else if(element.type==="update")
                {
                    NOTIFICATION_UPDATE.push(element);
                }
                break;
            default:
                new Error("Data Is Not Valid");
                break;
        }
    }
let MODEL_DATA = await modelInsert(MODEL_INSERT);
let USER_DATA = await userInsert(USER_INSERT);
let MENTION_DATA = await mentionInsert(MENTION_INSERT);
let NOTIFICATION_DATA = await notificationInsert(NOTIFICATION_INSERT);
let HASHTAG_DATA = await hashtagInsert(HASHTAG_INSERT);
let LIKE_DATA = await likeInsert(LIKES_INSERT);
let HASHTAG_F_DATA = await hashtag_fInsert(HASHTAG_F_INSERT);
let EXTRA_DATA = await ExtraInsert(EXTRA_INSERT);
const DATA_TO_BE_SEND = {model:MODEL_DATA,modelUpdate:MODEL_UPDATE,modelDelete:MODEL_DELETE,user:USER_DATA,userUpdate:USER_UPDATE,mention:MENTION_DATA,mentionDelete:MENTION_DELETE,notification:NOTIFICATION_DATA,notificationDelete:NOTIFICATION_DELETE,hashtag:HASHTAG_DATA,hashtagDelete:HASHTAG_DELETE,like:LIKE_DATA,likeDelete:LIKES_DELETE,hashtagf:HASHTAG_F_DATA,hashtagfUpdate:HASHTAG_F_UPDATE,extra:EXTRA_DATA,extraUpdate:EXTRA_UPDATE,extraDelete:EXTRA_DELETE}
const signature = functions.signTransaction(privateKey,DATA_TO_BE_SEND);
//console.log(DATA_TO_BE_SEND);
return {signature:signature,data:DATA_TO_BE_SEND,response:true,type:"receive"}
}
else
{
    return {response:false,reason:"Signature Not Verified"}
}
}
const modelInsert =async (MODEL_INSERT)=>
{
    let MODEL_INSERT_DATA = [];
    let temp;
    for(let i = 0;i<MODEL_INSERT.length;i++)
    {
        let check = false;
        const element = MODEL_INSERT[i];
        //console.log(element)
        //console.log(`${element.field.rid}===${element.uuid}`)
        if(element.field.rid===element.uuid||element.field.rid!=undefined)
        {
            console.log("true");
            check=true;
        }
        else
        {
            check = false;
        }
        temp = await getModelData(element.field.tid,check,element.field.rid);
        //console.log(temp,"model");
        MODEL_INSERT_DATA.push(temp);
    }
    return MODEL_INSERT_DATA;
}
//model data designing
const getModelData = (tid,check,rid)=>
new Promise((res,rej)=>
    {
        try
        {
        if(check)
        {
        model.find({tid:tid,rid:rid}).toArray((err,response)=>
        {
            if(err)
            {
                rej(err);
            }
            else
            {
                console.log("response called");
                res(response[response.length-1])
            }
        })
       }
    else
    {
        model.find({tid:tid}).toArray((err,response)=>
        {
            if(err)
            {
                rej(err);
            }
            else
            {
                console.log("model called");
                res(response[response.length-1])
            }
        })
    }
}
catch(err)
{
    console.log(err);
}
    })


//users insert data
const userInsert =async (USER_INSERT)=>
{
    let USER_INSERT_DATA = [];
    let temp;
    for(let i = 0;i<USER_INSERT.length;i++)
    {
        const element = USER_INSERT[i];
        temp = await getUserData(element.uuid);
        USER_INSERT_DATA.push(temp);
    }
    return USER_INSERT_DATA;
}
const getUserData = (uid)=>
    new Promise((res,rej)=>
    {
        user.find({uid:uid}).toArray((err,response)=>
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

//mention insert

const mentionInsert =async (MENTION_INSERT)=>
{
    let MENTION_INSERT_DATA = [];
    let temp;
    for(let i = 0;i<MENTION_INSERT.length;i++)
    {
        const element = MENTION_INSERT[i];
        temp = await getMentionData(element.field.mid);
        MENTION_INSERT_DATA.push(temp);
    }
    return MENTION_INSERT_DATA;
}

const getMentionData = (mid)=>
    new Promise((res,rej)=>
    {
        mention.find({uid:mid}).toArray((err,response)=>
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


const notificationInsert =async (NOTIFICATION_INSERT)=>
{
    let NOTIFICATION_INSERT_DATA = [];
    let temp;
    for(let i = 0;i<NOTIFICATION_INSERT.length;i++)
    {
        const element = NOTIFICATION_INSERT[i];
        temp = await getNotificationData(element.field.mid);
        NOTIFICATION_INSERT_DATA.push(temp);
    }
    return NOTIFICATION_INSERT_DATA;
}

const getNotificationData = (mid)=>
    new Promise((res,rej)=>
    {
        notification.find({uid:mid}).toArray((err,response)=>
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

const hashtagInsert =async (HASHTAG_INSERT)=>
{
    let HASHTAG_INSERT_DATA = [];
    let temp;
    for(let i = 0;i<HASHTAG_INSERT.length;i++)
    {
        const element = HASHTAG_INSERT[i];
        temp = await getHashtagData(element.field.hid);
        HASHTAG_INSERT_DATA.push(temp);
    }
    return HASHTAG_INSERT_DATA;
}

const getHashtagData = (hid)=>
    new Promise((res,rej)=>
    {
        hashtag.find({hid:hid}).toArray((err,response)=>
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




const likeInsert =async (LIKE_INSERT)=>
{
    let LIKE_INSERT_DATA = [];
    let temp;
    for(let i = 0;i<LIKE_INSERT.length;i++)
    {
        const element = LIKE_INSERT[i];
        temp = await getLikeData(element.field.lid);
        LIKE_INSERT_DATA.push(temp);
    }
    return LIKE_INSERT_DATA;
}
const getLikeData = (lid)=>
    new Promise((res,rej)=>
    {
        likes.find({lid:lid}).toArray((err,response)=>
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


const hashtag_fInsert =async (HASHTAG_F_INSERT)=>
{
    let HASHTAG_F_INSERT_DATA = [];
    let temp;
    for(let i = 0;i<HASHTAG_F_INSERT.length;i++)
    {
        const element = HASHTAG_F_INSERT[i];
        temp = await getHashtagFData(element.field.hid);
        HASHTAG_F_INSERT_DATA.push(temp);
    }
    return HASHTAG_F_INSERT_DATA;
}

const getHashtagFData = (hid)=>
    new Promise((res,rej)=>
    {
        hashtagf.find({hid:hid}).toArray((err,response)=>
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


const ExtraInsert =async (EXTRA_INSERT)=>
{
    let EXTRA_INSERT_DATA = [];
    let temp;
    for(let i = 0;i<EXTRA_INSERT.length;i++)
    {
        const element = EXTRA_INSERT[i];
        temp = await getExtraData(element.field.tid);
        EXTRA_INSERT_DATA.push(temp);
    }
    return EXTRA_INSERT_DATA;
}
const getExtraData = (tid)=>
    new Promise((res,rej)=>
    {
        try{
        extra.find({tid:tid}).toArray((err,response)=>
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
    }catch(err)
    {
        console.log(err);
    }
    })
