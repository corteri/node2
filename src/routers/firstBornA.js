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
exports.ACCEPT_THE_FIRST_BORN =async function ACCEPT_THE_FIRST_BORN(data)
{
    const userData = data.user;
    const modelData = data.model;
    const likesData = data.likes;
    const hashtagData = data.hashtag;
    const hashtag_fData = data.hashtag_f;
    const mentionData = data.mention;
    const notificationData = data.notification;
    const extraData = data.extra;
    const replicaData = data.replica;
    let USER_RESPONSE=false;
    let MODEL_RESPONSE = false;
    let LIKES_RESPONSE = false;
    let HASHTAG_RESPONSE = false;
    let HASHTAG_F_RESPONSE = false;
    let MENTION_RESPONSE = false;
    let NOTIFICATION_RESPONSE = false;
    let EXTRA_RESPONSE = false;
    let REPLICA_RESPONSE = false;
    if(data.user.length>0)
    {
     USER_RESPONSE = await insertUser(userData)
    }
    if(data.model.length>0)
    {
     MODEL_RESPONSE = await insertModel(modelData)
    }
    if(data.likes.length>0)
    {
     LIKES_RESPONSE = await insertLikes(likesData)
    }
    if(data.hashtag.length>0)
    {
     HASHTAG_RESPONSE = await insertHashtag(hashtagData)
    }
    if(data.hashtag_f.length>0)
    {
     HASHTAG_F_RESPONSE = await insertHashtag_F(hashtag_fData)
    }
    if(data.mention.length>0)
    {
     MENTION_RESPONSE = await insertMention(mentionData)
    }
    if(data.notification.length>0)
    {
     NOTIFICATION_RESPONSE = await insertNotification(notificationData)
    }
    if(data.extra.length>0)
    {
     EXTRA_RESPONSE = await insertExtra(extraData);
    }
    if(data.replica.length>0)
    {
     REPLICA_RESPONSE = await insertReplica(replicaData);
    }

    let obj = {};
    if(USER_RESPONSE)
    {
        obj.user=true;
    }
    if(MODEL_RESPONSE)
    {
        obj.model=true;
    }
    if(LIKES_RESPONSE)
    {
        obj.likes=true;
    }
    if(HASHTAG_F_RESPONSE)
    {
        obj.hashtag_f=true;
    }
    if(HASHTAG_RESPONSE)
    {
        obj.hashtag=true;
    }
    if(MENTION_RESPONSE)
    {
        obj.response=true;
    }
    if(NOTIFICATION_RESPONSE)
    {
        obj.notification=true;
    }
    if(EXTRA_RESPONSE)
    {
        obj.extra=true;
    }
    if(REPLICA_RESPONSE)
    {
        obj.replica=true;
    }
}
const insertUser = (userData)=>
new Promise((res,rej)=>
{
    user.insertMany(userData,(err)=>
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
const insertModel = (modelData)=>
new Promise((res,rej)=>
{
    model.insertMany(modelData,(err)=>
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
const insertLikes = (likesData)=>
new Promise((res,rej)=>
{
    likes.insertMany(likesData,(err)=>
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

const insertHashtag = (hashtagData)=>
new Promise((res,rej)=>
{
    hashtag.insertMany(userData,(err)=>
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

const insertHashtag_F = (hashtag_fData)=>
new Promise((res,rej)=>
{
    hashtagf.insertMany(hashtag_fData,(err)=>
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

const insertMention = (mentionData)=>
new Promise((res,rej)=>
{
    mention.insertMany(userData,(err)=>
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
const insertNotification = (notificationData)=>
new Promise((res,rej)=>
{
    notification.insertMany(notificationData,(err)=>
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
const insertExtra = (extraData)=>
new Promise((res,rej)=>
{
    extra.insertMany(extraData,(err)=>
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

const insertReplica = (replicaData)=>
new Promise((res,rej)=>
{
    replica.insertMany(replicaData,(err)=>
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
