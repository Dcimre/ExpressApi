const router = require ('express').Router();
const verify = require ('../verifyToken');
const Group  = require ('../../model/Group');
const Post = require('../../model/Post');
const AppError = require('../../AppError');

router.patch('/post', verify(['admin','user']), async (req,res,next)=>{

  let userInGroup = await Group.find({ _id : req.body.groupId,members:req.user.userId});

  console.log(userInGroup);

  if(!userInGroup.length){

    return next(new AppError('You are not allowed to post into this group',403));
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
      return next(new AppError('Post already Created!',400));

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
    return next(new AppError(`failed to post into Group. error message: ${err.message}`,400));
  }
});
  
module.exports = router;