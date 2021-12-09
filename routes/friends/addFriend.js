const router = require ('express').Router();
const verify = require ('../../routes/verifyToken');
const FriendRequest  = require ('../../model/friendRequest');
const User = require('../../model/User');
const AppError = require('../../AppError');


router.post('/add', verify(['admin','user']), async (req,res,next)=>{
    
  if(req.body.email == '' || req.body.email == undefined){
    return next(new AppError('add missing!',400));
  }

  // DEFINE SENDER AND RECEIVER

  const receiver = await User.findOne({email:req.body.email});
  const sender = await User.findOne({_id: req.user.userId});


  // CHECK SELF-INVITATION

  if(receiver.email == sender.email){
    return next(new AppError('you cant invite yourself!',409));
  }

  // checkalready:

  const checkExisting = await FriendRequest.findOne({sender:sender._id}).where('receiver').equals(receiver._id);

  if (checkExisting){

    return next(new AppError('request already exists',400));

  }

  // Already friends

  if(receiver.friendList.includes(sender._id)){
    return next(new AppError('Already friends!', 400));
  }

  const data =
          {
            sender: sender._id,
            receiver: receiver._id,
            status: 'pending'
          }; 

  try{ 

    // SAVE FRIEND REQUEST TO DATABASE
      
    const d = await FriendRequest.create(data);
    console.log('Request saved succesfully');  
    return res.status(200).send({body: d, message: 'Request sent!'});
      
  }
  catch(err){
      
    console.log('failed to save the request', err);
    return next(new AppError(`failed to save the request ${err.message}`,400));
  }
});

  
module.exports = router;