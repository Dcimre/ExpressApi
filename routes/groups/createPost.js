const router = require ('express').Router();
const verify = require ('../verifyToken');
const Group  = require ('../../model/Group');
const Post = require('../../model/Post');


router.patch('/post', verify(['admin','user']), async (req,res)=>{

  let userInGroup = await Group.find({ _id : req.body.groupId,members:req.user.userId});

  console.log(userInGroup);

  if(!userInGroup.length){

    return res.status(400).send({body: 'You are not allowed to post into this group'});
  }

  // CREATE EVENT DATA

  const data =
          {
            title: req.body.title,
            author: req.user.userId,
            article: req.body.article,
            
          }; 
  try{ 

    // SAVE POST TO DATABASE
      
    const d = await Post.create(data);
    console.log('post created succesfully');  

    // CHECK FOR DUPLICATION

    const post = await Post.findOne(data);

    const thisGroup = await Group.findOne({_id:req.body.groupId});

    if(thisGroup.posts.includes(post._id)){
      return res.status(400).send({body: 'Post already Created!'});

    }

    // PUSH POST INTO THE EVENT MODEL

    await Group.findOneAndUpdate(
      { _id: req.body.groupId }, 
      { $push: { posts: post._id }}
    );

    return res.status(200).send({body: d, message: 'Post Created!'});
      
  }
  catch(err){
      
    console.log('failed to post', err);
    return res.status(400).send({body: err.message});
  }
});
  
module.exports = router;