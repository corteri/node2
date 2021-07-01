const connections = require('./mhelper').connection();
const model = connections.collection("model")
//const model = connections.collection("model")
const users = connections.collection("users")
const mention = connections.collection("mention")
const notification = connections.collection("notification")
const likes = connections.collection("likes")
const hashtag = connections.collection("hashtag")
const hashtagF = connections.collection("hashtagf")
const extra = connections.collection("extra")
const crypto = require('crypto');
const { CHECK_TO_ORIGIN } = require('../ServerFunctions');
const functions = require('./function');
exports.RECEIVEData =  async function RECEIVEData(privateKey,hostPublicKey,data)
{
    const DATASignature = data.signature;
    const DATA = data.data;
    const RESPONSE = data.response;
    let obj = {};
    if(RESPONSE)
    {
        const isVerified = crypto.verify("SHA256",Buffer.from(JSON.stringify(DATA)),hostPublicKey,Buffer.from(DATASignature));
        if(isVerified)
        {
            //console.log(DATA);
            if(DATA.user.length>0)
            {
            const USER_CHECK = await insertUsers(DATA.user);
            if(USER_CHECK)
            {
                obj.userCheck = true;

            }
            }
            if(DATA.model.length>0)
            {
                const MODEL_CHECK = await insertModel(DATA.model);
                if(MODEL_CHECK)
                {
                    obj.modelCheck = true;

                }
            }
            if(DATA.extra.length>0)
            {
                const EXTRA_CHECK = await insertEXTRA(DATA.extra);
                if(EXTRA_CHECK)
                {
                    obj.extraCheck = true;


                }
            }
            if(DATA.like.length>0)
            {
                const LIKES_CHECK = await insertLIKE(DATA.like);
                if(LIKES_CHECK)
                {
                    obj.likesCheck = true;
                }
            }
            if(DATA.mention.length>0)
            {
                const MENTION_CHECK = await insertMention(DATA.mention);
                if(MENTION_CHECK)
                {
                    obj.mentionCheck = true;
                }
            }
            if(DATA.notification.length>0)
            {
                const NOTIFICATION_CHECK = await insertNotification(DATA.notification);
                if(NOTIFICATION_CHECK)
                {
                    obj.notificationCheck = true;


                }
            }
            if(DATA.hashtag.length>0)
            {
                const HASHTAG_CHECK = await insertHashtag(DATA.hashtag);
                if(HASHTAG_CHECK)
                {
                    obj.hashtagCheck = true;

                }
            }
            if(DATA.hashtagf.length>0)
            {
                const HASHTAG_F_CHECK = await insertHashtagF(DATA.hashtagF);
                if(HASHTAG_F_CHECK)
                {
                    obj.hashtagfCheck = true;


                }
            }
            if(DATA.modelUpdate.length>0)
            {
                const DataCheck = await updateModel(DATA.modelUpdate);
                if(DataCheck)
                {
                    obj.modelUpdateCheck = true;

                }

            }
            if(DATA.likeDelete.length>0)
            {
                const DataCheck = await deleteLikes(DATA.likeDelete);
                if(DataCheck)
                {
                    obj.likeDeleteCheck = true;
                }

            }
            if(DATA.modelDelete.length>0)
            {
                const modelDelete = await deleteModel(DATA.modelDelete);
                if(modelDelete)
                {
                    obj.modelDeleteCheck = true;
                }

            }
            if(DATA.hashtagfUpdate.length>0)
            {
                const DataCheck = await updateHashtagF(DATA.hashtagfUpdate);
                if(DataCheck)
                {
                    obj.hashtagfUpdateCheck = true;

                }

            }
            const SIGNATURE_TRANSFER = functions.signTransaction(privateKey,obj);
            return {response:true,data:obj,signature:SIGNATURE_TRANSFER};
        }
        else
        {
            return {response:false,reason:"SIGNATURE NOT VERIFIED"}
        }

    }
    else
    {
        return {response:false,reason:"SOMETHING WENT WRONG"}
    }

}

const insertModel =(MODEL)=>
    new Promise((res,rej)=>
    {
        model.insertMany(MODEL,(err,response)=>
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

const insertHashtag =(HASHTAG)=>
    new Promise((res,rej)=>
    {
        hashtag.insertMany(HASHTAG,(err,response)=>
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

const insertUsers =(USERS)=>
    new Promise((res,rej)=>
    {
        users.insertMany(USERS,(err,response)=>
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


const insertMention =(MENTION)=>
    new Promise((res,rej)=>
    {
        mention.insertMany(MENTION,(err,response)=>
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

const insertNotification = (NOTIFICATION)=>
    new Promise((res,rej)=>
    {
        notification.insertMany(NOTIFICATION,(err,response)=>
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


const insertLIKE =(LIKES)=>
    new Promise((res,rej)=>
    {
        likes.insertMany(LIKES,(err,response)=>
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

const insertEXTRA =(EXTRA)=>
    new Promise((res,rej)=>
    {
        extra.insertMany(EXTRA,(err,response)=>
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

const insertHashtagF =(HASHTAG_F)=>
    new Promise((res,rej)=>
    {
        hashtagF.insertMany(HASHTAG_F,(err,response)=>
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

const deleteModel = (MODEL)=>
    new Promise((res,rej)=>
    {
        let check = false;
       for(let i = 0;i<MODEL.length;i++)
       {
           check = false;
           const element = MODEL[i];
           const _id = element.field._id;
     //      const tid = element.field.tid;
           model.deleteOne({_id:_id},(err,response)=>
           {
               if(err)
               {
                   rej(err);
               }
               else
               {
                   check = true;
               }
           })
       }
       res(check);
    })

const deleteLikes = (LIKES)=>
    new Promise((res,rej)=>
    {
        let check = false;
       for(let i = 0;i<LIKES.length;i++)
       {
           check = false;
           const element = LIKES[i];
           const _id = element.field._id;
           //const tid = element.field.tid;
           likes.deleteOne({_id:_id},(err,response)=>
           {
               if(err)
               {
                   rej(err);
               }
               else
               {
                   check = true;
               }
           })
       }
       res(check);
    })
const updateHashtagF = async (HASHTAG_F)=>
    new Promise((res,rej)=>
    {
    for(let i = 0;i<HASHTAG_F.length;i++)
    {
        const element = HASHTAG_F[i];
        hashtagF.updateOne({tid:element.field.tid},{$set:{freq:element.field.freq}},(err,response)=>
        {
            if(err)
            {
                rej(err);
            }
            else
            {
                check = true;
            }
        })
    }
    res(check);
})
const updateModel = async (MODEL)=>
    new Promise((res,rej)=>
    {
    let checkRetweet = false;
    let checkReply = false;
    let checkLike = false;

    for(let i = 0;i<MODEL.length;i++)
    {
        const element = MODEL[i];
        if(element.field.ln)
        {
            model.updateOne({$and:[{tid:element.field.tid}]},{$set:{ln:element.field.ln}},(err,response)=>
            {
                if(err)
                {
                    rej(err);
                }
                else
                {
                    checkLike = true;
                }
            })

        }
        if(element.field.rp)
        {
            model.updateOne({$and:[{tid:element.field.tid}]},{$set:{rp:element.field.rp}},(err,response)=>
            {
                if(err)
                {
                    rej(err);
                }
                else
                {
                    checkReply = true;
                }
            })

        }
        if(element.field.rt)
        {
            model.updateOne({$and:[{tid:element.field.tid}]},{$set:{rt:element.field.rt}},(err,response)=>
            {
                if(err)
                {
                    rej(err);
                }
                else
                {
                    checkRetweet = true;
                }
            })

        }
    }
    res({retweet:checkRetweet,reply:checkReply,like:checkLike});
}
    )
