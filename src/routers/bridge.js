//const e = require('express');
const { Promise } = require('mongoose');
//const e = require('express');
const connection = require('./mhelper').connection();



//const isPortReachable = require('')


async function checkExtraDelete(data)
{
    const data1 = initExtra(data)
    return data1
}
    const initExtra = (data)=>
    {
    const replica = connection.collection("replica");
    new Promise((res,rej)=>
    {
        try{
            replica.find({$and:[{type:"delete"},{collection:"extra"}]}).toArray((err,response)=>
            {
                let data1 =[];
                if(err)
                {
                    rej(err);
                }
                else
                {
                    let check = false;
                    for(let j = 0;j<data.length;j++)
                    {
                        check = false;
                    for(let i=0;i<response.length;i++)
                    {
                        let element = response[i];
                        if(element.field.tid===data.tid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        data1.push(data[j]);
                    }
                }
                res(data1);
                }
            })

        }
        catch(e)
        {
            console.log(e);
        }
    })
}












async function checkHashtagDelete(data)
{
    const data1 = await initHashtag(data);
    return data1;
}
    const initHashtag = (data)=>
    {
    const replica = connection.collection("replica");
    new Promise((res,rej)=>
    {
        try{
            replica.find({$and:[{type:"delete"},{collection:"hashtag"}]}).toArray((err,response)=>
            {
                let data1 =[];
                if(err)
                {
                    rej(err);
                }
                else
                {
                    let check = false;
                    for(let j = 0;j<data.length;j++)
                    {
                        check = false;
                    for(let i=0;i<response.length;i++)
                    {
                        let element = response[i];
                        if(element.field.hid===data.hid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        data1.push(data[j]);
                    }
                }
                res(data1);
                }
            })

        }
        catch(e)
        {
            console.log(e);
        }
    })
    }








async function checkLikeDelete(data)
{
    const data1 = await initLike(data);
    return data1;
}
    const initLike = (data)=>
    {
    const replica = connection.collection("replica");
    new Promise((res,rej)=>
    {
        try{
            replica.find({$and:[{type:"delete"},{collection:"likes"}]}).toArray((err,response)=>
            {
                let data1 =[];
                if(err)
                {
                    rej(err);
                }
                else
                {
                    let check = false;
                    for(let j = 0;j<data.length;j++)
                    {
                        check = false;
                    for(let i=0;i<response.length;i++)
                    {
                        let element = response[i];
                        if(element.field.lid===data.lid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        data1.push(data[j]);
                    }
                }
                res(data1);
                }
            })

        }
        catch(e)
        {
            console.log(e);
        }
    })
    }



async function checkUsersDelete(data)
{
    const data1 = initUsers(data);
    return data1;
}
    const initUsers = (data)=>
    {
    const replica = connection.collection("replica");
    new Promise((res,rej)=>
    {
        try{
            replica.find({$and:[{type:"delete"},{collection:"users"}]}).toArray((err,response)=>
            {
                let data1 =[];
                if(err)
                {
                    rej(err);
                }
                else
                {
                    let check = false;
                    for(let j = 0;j<data.length;j++)
                    {
                        check = false;
                    for(let i=0;i<response.length;i++)
                    {
                        let element = response[i];
                        if(element.uuid===data.uid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        data1.push(data[j]);
                    }
                }
                res(data1);
                }
            })

        }
        catch(e)
        {
            console.log(e);
        }
    })
    }


async function checkMentionDelete(data)
{
    const data1 = await initMention(data);
    return data1;
}
    const initMention = (data)=>
    {
    const replica = connection.collection("replica");
    new Promise((res,rej)=>
    {
        try{
            replica.find({$and:[{type:"delete"},{collection:"mention"}]}).toArray((err,response)=>
            {
                let data1 =[];
                if(err)
                {
                    rej(err);
                }
                else
                {
                    for(let j = 0;j<data.length;j++)
                    {
                    for(let i=0;i<response.length;i++)
                    {
                        let element = response[i];
                        if(element.field.mid===data.uid)
                        {
                        }
                        else
                        {
                            let check = false;
                            for(let j = 0;j<data.length;j++)
                            {
                                check = false;
                            for(let i=0;i<response.length;i++)
                            {
                                let element = response[i];
                                if(element.field.mid===data.uid)
                                {
                                    check = true;
                                }
                            }
                            if(!check)
                            {
                                data1.push(data[j]);
                            }
                            }
                   //         data1.push(data[j]);
                        }
                    }
                }
                res(data1);
                }
            })

        }
        catch(e)
        {
            console.log(e);
        }
    })
    }



async function checkNotificationDelete(data)
{
    const data1 = await initNotification(data);
    return data1;
}
    const initNotification = (data1)=>
    {
    const replica = connection.collection("replica");
    new Promise((res,rej)=>
    {
        try{
            replica.find({$and:[{type:"delete"},{collection:"notification"}]}).toArray((err,response)=>
            {
                let data1 =[];
                if(err)
                {
                    rej(err);
                }
                else
                {
                    let check = false;
                    for(let j = 0;j<data.length;j++)
                    {
                        check = false;
                    for(let i=0;i<response.length;i++)
                    {
                        let element = response[i];
                        if(element.field.mid===data.uid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        data1.push(data[j]);
                    }
                }
                res(data1);
                }
            })

        }
        catch(e)
        {
            console.log(e);
        }
    })
    }





async function checkModelDelete(data)
{
    const data1 = await initModel(data);
    return data1;

}
    const initModel = (data)=>
    {
    const replica = connection.collection("replica");
    new Promise((res,rej)=>
    {
        try{
            replica.find({$and:[{type:"delete"},{collection:"model"}]}).toArray((err,response)=>
            {
                let data1 =[];
                if(err)
                {
                    rej(err);
                }
                else
                {
                    let check = false;
                    for(let j = 0;j<data.length;j++)
                    {
                        check = false;
                    for(let i=0;i<response.length;i++)
                    {
                        let element = response[i];
                        if(element.field.tid===tid)
                        {
                            check = true
                        }
                        else
                        {
                            //data1.push(data[j]);
                        }
                    }
                    if(!check)
                    {
                        data1.push(data[j]);
                    }
                }
                res(data1);
                }
            })

        }
        catch(e)
        {
            console.log(e);
        }
    })
    }



exports.bridgeInsertReplicaToModel = function bridgeInsertReplicaToModel(callback)
{
    const model = connection.collection("model");
    const replica = connection.collection("replica");
    replica.find({$and:[{type:"insert"},{collection:"model"}]}).toArray((err,replica)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            let Data = [];
            model.find().toArray((err,response)=>
            {
                if(err)
                {
                    throw err;
                }
                else
                {
                for(let i = 0;i<replica.length;i++)
                {
                    let check = false;
                    let replicaElement = replica[i];
                    let tid = "";
                    if(replicaElement.field.tid)
                    {
                        tid = element.field.tid;
                    }
                    for(let j = 0;j<response.length;j++)
                    {
                        let modelElement = response[j];
                        if(modelElement.tid===tid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        Data.push({tid:tid,uid:replicaElement.uid});
                    }
                }
            }
            return callback(Data);
            })
        }
    })

}


exports.bridgeInsertModelTOReplica = function bridgeInsertModelToReplica(callback)
{
    const model = connection.collection("model");
    const replica = connection.collection("replica");
    model.find().toArray((err,model)=>
    {
        const data = [];
        if(err)
        {
            throw err;
        }
        else
        {
        replica.find({$and:[{type:"insert"},{collection:"replica"}]}).toArray((err1,replica)=>
        {
            if(err1)
            {
                throw err1;
            }
            else
            {
                for(let i = 0;i<model.length;i++)
                {
                    const  modelElement = model[i];
                    const check = false;
                    for(let j = 0;j<replica.length;j++)
                    {
                        const replicaElement = replica[j];
                        if(replicaElement.field.tid===modelElement.tid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        data.push({tid:modelElement.tid});
                    }
                }
            }
            return callback(data);

        })
    }
    })
}

exports.bridgeInsertReplicaToLikes = function bridgeInsertReplicaToLikes(callback)
{
    const likes = connection.collection("likes");
    const replica = connection.collection("replica");
    replica.find({$and:[{type:"insert"},{collection:"likes"}]}).toArray((err,replica)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            likes.find().toArray((err1,likes)=>
            {
                if(err1)
                {
                    throw err1;
                }
                else
                {
                    for(let i = 0;i<replica.length;i++)
                    {
                        let lid = "";
                        let check = false;
                        const elementReplica = replica[i];
                        for(let j=0;j<likes.length;j++)
                        {
                            const elementLikes = likes[j];
                            if(elementReplica.field.lid===elementLikes.lid)
                            {
                                check = true;
                                //lid = elementLikes.lid;
                            }
                        }
                        if(!check)
                        {
                            data.push({uid:elementReplica.uid,lid:elementReplica.field.lid});
                        }
                    }
                }
                return callback(data);
            })
        }
    })
}



exports.bridgeInsertLikesTOReplica = function bridgeInsertLikesToReplica(callback)
{
    const likes = connection.collection("likes");
    const replica = connection.collection("replica");
    likes.find().toArray((err,likes)=>
    {
        const data = [];
        if(err)
        {
            throw err;
        }
        else
        {
        replica.find({$and:[{type:"insert"},{collection:"likes"}]}).toArray((err1,replica)=>
        {
            if(err1)
            {
                throw err1;
            }
            else
            {
                for(let i = 0;i<likes.length;i++)
                {
                    const  likesElement = model[i];
                    const check = false;
                    for(let j = 0;j<replica.length;j++)
                    {
                        const replicaElement = replica[j];
                        if(replicaElement.field.lid===likesElement.lid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        data.push({lid:likesElement.lid});
                    }
                }
                return callback(data);
            }
            ///return callback(data);
        })
    }
    })
}


exports.bridgeInsertUsersTOReplica = function bridgeInsertUsersToReplica(callback)
{
    const users = connection.collection("users");
    const replica = connection.collection("replica");
    users.find().toArray((err,users)=>
    {
        const data = [];
        if(err)
        {
            throw err;
        }
        else
        {
        replica.find({$and:[{type:"insert"},{collection:"users"}]}).toArray((err1,replica)=>
        {
            if(err1)
            {
                throw err1;
            }
            else
            {
                for(let i = 0;i<users.length;i++)
                {
                    const  usersElement = users[i];
                    const check = false;
                    for(let j = 0;j<replica.length;j++)
                    {
                        const replicaElement = replica[j];
                        if(replicaElement.uuid===usersElement.uid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        data.push({uid:usersElement.uid});
                    }
                }
                return callback(data);
            }
            ///return callback(data);
        })
    }
    })
}




exports.bridgeInsertReplicaToUsers = function bridgeInsertReplicaToUsers(callback)
{
    const users = connection.collection("users");
    const replica = connection.collection("replica");
    replica.find({$and:[{type:"insert"},{collection:"users"}]}).toArray((err,replica)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            users.find().toArray((err1,users)=>
            {
                if(err1)
                {
                    throw err1;
                }
                else
                {
                    for(let i = 0;i<replica.length;i++)
                    {
                  //      let lid = "";
                        let check = false;
                        const elementReplica = replica[i];
                        for(let j=0;j<users.length;j++)
                        {
                            const elementUsers = users[j];
                            if(elementReplica.uuid===elementUsers.uuid)
                            {
                                check = true;
                                //lid = elementLikes.lid;
                            }
                        }
                        if(!check)
                        {
                            data.push({uid:elementUsers.uid});
                        }
                    }
                }
                return callback(data);
            })
        }
    })
}

exports.bridgeInsertReplicaToMentions = function bridgeInsertReplicaToMentions(callback)
{
    const mentions = connection.collection("mention");
    const replica = connection.collection("replica");
    replica.find({$and:[{type:"insert"},{collection:"mention"}]}).toArray((err,replica)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            mentions.find().toArray((err1,mentions)=>
            {
                if(err1)
                {
                    throw err1;
                }
                else
                {
                    for(let i = 0;i<replica.length;i++)
                    {
                  //      let lid = "";
                        let check = false;
                        const elementReplica = replica[i];
                        for(let j=0;j<mentions.length;j++)
                        {
                            const elementMentions = mentions[j];
                            if(elementReplica.field.mid===elementMentions.uid)
                            {
                                check = true;
                                //lid = elementLikes.lid;
                            }
                        }
                        if(!check)
                        {
                            data.push({uid:elementReplica.field.mid});
                        }
                    }
                }
                return callback(data);
            })
        }
    })
}




exports.bridgeInsertMentionsToReplica = function bridgeInsertMentionsToReplica(callback)
{
    const mentions = connection.collection("mention");
    const replica = connection.collection("replica");
    mentions.find().toArray((err,mentions)=>
    {
        const data = [];
        if(err)
        {
            throw err;
        }
        else
        {
        replica.find({$and:[{type:"insert"},{collection:"users"}]}).toArray((err1,replica)=>
        {
            if(err1)
            {
                throw err1;
            }
            else
            {
                for(let i = 0;i<mentions.length;i++)
                {
                    const  mentionsElement = mentions[i];
                    const check = false;
                    for(let j = 0;j<replica.length;j++)
                    {
                        const replicaElement = replica[j];
                        if(replicaElement.field.uid===mentionsElement.uid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        data.push({uid:mentionsElement.uid});
                    }
                }
                return callback(data);
            }
            ///return callback(data);
        })
    }
    })
}
exports.bridgeInsertReplicaToUsers = function bridgeInsertReplicaToUsers(callback)
{
    const users = connection.collection("users");
    const replica = connection.collection("replica");
    replica.find({$and:[{type:"insert"},{collection:"users"}]}).toArray((err,replica)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            users.find().toArray((err1,users)=>
            {
                if(err1)
                {
                    throw err1;
                }
                else
                {
                    for(let i = 0;i<replica.length;i++)
                    {
                  //      let lid = "";
                        let check = false;
                        const elementReplica = replica[i];
                        for(let j=0;j<users.length;j++)
                        {
                            const elementUsers = users[j];
                            if(elementReplica.uuid===elementUsers.uuid)
                            {
                                check = true;
                                //lid = elementLikes.lid;
                            }
                        }
                        if(!check)
                        {
                            data.push({uid:elementUsers.uid});
                        }
                    }
                }
                return callback(data);
            })
        }
    })
}

exports.bridgeInsertReplicaToNotification = function bridgeInsertReplicaToNotification(callback)
{
    const notification = connection.collection("notification");
    const replica = connection.collection("replica");
    replica.find({$and:[{type:"insert"},{collection:"notification"}]}).toArray((err,replica)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            notification.find().toArray((err1,notification)=>
            {
                if(err1)
                {
                    throw err1;
                }
                else
                {
                    for(let i = 0;i<replica.length;i++)
                    {
                  //      let lid = "";
                        let check = false;
                        const elementReplica = replica[i];
                        for(let j=0;j<notification.length;j++)
                        {
                            const elementNotification = mentions[j];
                            if(elementReplica.field.mid===elementNotification.uid)
                            {
                                check = true;
                                //lid = elementLikes.lid;
                            }
                        }
                        if(!check)
                        {
                            data.push({uid:elementReplica.field.mid});
                        }
                    }
                }
                return callback(data);
            })
        }
    })
}
exports.bridgeInsertNotificationToReplica = function bridgeInsertNotificationToReplica(callback)
{
    const notification = connection.collection("notification");
    const replica = connection.collection("replica");
    notification.find().toArray((err,notification)=>
    {
        const data = [];
        if(err)
        {
            throw err;
        }
        else
        {
        replica.find({$and:[{type:"insert"},{collection:"notification"}]}).toArray((err1,replica)=>
        {
            if(err1)
            {
                throw err1;
            }
            else
            {
                for(let i = 0;i<notification.length;i++)
                {
                    const  notificationElement = notification[i];
                    const check = false;
                    for(let j = 0;j<replica.length;j++)
                    {
                        const replicaElement = replica[j];
                        if(replicaElement.field.uid===notificationElement.uid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        data.push({uid:notificationElement.uid});
                    }
                }
                return callback(data);
            }
            ///return callback(data);
        })
    }
    })
}
exports.bridgeInsertExtraToReplica = function bridgeInsertExtraToReplica(callback)
{
    const extra = connection.collection("extra");
    const replica = connection.collection("replica");
    extra.find().toArray((err,extra)=>
    {
        const data = [];
        if(err)
        {
            throw err;
        }
        else
        {
        replica.find({$and:[{type:"insert"},{collection:"extra"}]}).toArray((err1,replica)=>
        {
            if(err1)
            {
                throw err1;
            }
            else
            {
                for(let i = 0;i<extra.length;i++)
                {
                    const  extraElement = extra[i];
                    const check = false;
                    for(let j = 0;j<replica.length;j++)
                    {
                        const replicaElement = replica[j];
                        if(replicaElement.field.tid===extraElement.tid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        data.push({tid:extraElement.tid});
                    }
                }
                return callback(data);
            }
            ///return callback(data);
        })
    }
    })
}



exports.bridgeInsertReplicaToExtra = function bridgeInsertReplicaToExtra(callback)
{
    const extra = connection.collection("extra");
    const replica = connection.collection("replica");
    replica.find({$and:[{type:"insert"},{collection:"extra"}]}).toArray((err,replica)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            extra.find().toArray((err1,extra)=>
            {
                if(err1)
                {
                    throw err1;
                }
                else
                {
                    for(let i = 0;i<replica.length;i++)
                    {
                  //      let lid = "";
                        let check = false;
                        const elementReplica = replica[i];
                        for(let j=0;j<extra.length;j++)
                        {
                            const elementExtra = extra[j];
                            if(elementReplica.field.tid===elementExtra.tid)
                            {
                                check = true;
                                //lid = elementLikes.lid;
                            }
                        }
                        if(!check)
                        {
                            data.push({tid:elementReplica.field.tid});
                        }
                    }
                }
                return callback(data);
            })
        }
    })
}




exports.bridgeInsertReplicaToHashtag = function bridgeInsertReplicaToHashtag(callback)
{
    const hashtag = connection.collection("hashtag");
    const replica = connection.collection("replica");
    replica.find({$and:[{type:"insert"},{collection:"hashtag"}]}).toArray((err,replica)=>
    {
        if(err)
        {
            throw err;
        }
        else
        {
            hashtag.find().toArray((err1,hashtag)=>
            {
                if(err1)
                {
                    throw err1;
                }
                else
                {
                    for(let i = 0;i<replica.length;i++)
                    {
                  //      let lid = "";
                        let check = false;
                        const elementReplica = replica[i];
                        for(let j=0;j<hashtag.length;j++)
                        {
                            const elementHashtag = hashtag[j];
                            if(elementReplica.field.hid===elementHashtag.hid)
                            {
                                check = true;
                                //lid = elementLikes.lid;
                            }
                        }
                        if(!check)
                        {
                            data.push({hid:elementReplica.field.hid});
                        }
                    }
                }
                return callback(data);
            })
        }
    })
}



exports.bridgeInsertHashtagToReplica = function bridgeInsertHashtagToReplica(callback)
{
    const hashtag = connection.collection("hashtag");
    const replica = connection.collection("replica");
    hashtag.find().toArray((err,hashtag)=>
    {
        const data = [];
        if(err)
        {
            throw err;
        }
        else
        {
        replica.find({$and:[{type:"insert"},{collection:"hashtag"}]}).toArray((err1,replica)=>
        {
            if(err1)
            {
                throw err1;
            }
            else
            {
                for(let i = 0;i<hashtag.length;i++)
                {
                    const  hashtagElement = hashtag[i];
                    const check = false;
                    for(let j = 0;j<replica.length;j++)
                    {
                        const replicaElement = replica[j];
                        if(replicaElement.field.hid===hashtagElement.hid)
                        {
                            check = true;
                        }
                    }
                    if(!check)
                    {
                        data.push({hid:hashtagElement.hid});
                    }
                }
                return callback(data);
            }
            ///return callback(data);
        })
    }
    })
}

