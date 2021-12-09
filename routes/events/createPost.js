const router = require ('express').Router();
const verify = require ('../verifyToken');
const Event  = require ('../../model/Event');
const Post = require('../../model/Post');
const AppError = require('../../AppError');


router.patch('/post', verify(['admin','user']), async (req,res,next)=>{

  let userInEvent = await Event.find({ _id : req.body.eventId,participants:req.user.userId});

  if(!userInEvent.length){
    return next(new AppError('You cant post into this event', 403));
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

    // CHECK FOR DUPLICATION

    const post = await Post.findOne(data);

    const thisEvent = await Event.findOne({_id:req.body.eventId});

    if(thisEvent.posts.includes(post._id)){
      return next(new AppError('post already created', 409));
    }

    // PUSH POST INTO THE EVENT MODEL

    await Event.findOneAndUpdate(
      { _id: req.body.eventId }, 
      { $push: { posts: post._id }}
    );

    return res.status(200).send({body: d, message: 'Post Created!'});   
  }

  catch(err){
      
    return next(new AppError(`Failed to post... error message: ${err.message}`, 400));
  }
});
  
module.exports = router;