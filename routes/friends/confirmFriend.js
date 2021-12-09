const router = require ('express').Router();
const verify = require ('../../routes/verifyToken');
const FriendRequest  = require ('../../model/friendRequest');
const User = require('../../model/User');
const AppError = require('../../AppError');

router.patch('/', verify(['admin','user']), async (req,res,next)=>{


  const sender = await User.findOne({email:req.body.email});
  const receiver = await User.findOne({_id:req.user.userId});

  if (receiver._id.toString() == sender._id.toString()){

    return next(new AppError('cant confirm your own request', 400));
  }

  if(!sender || !receiver){
    return next(new AppError('sender or receiver not found', 403));
  }

  const fRequest = await FriendRequest.find({receiver:receiver._id, sender: sender._id});

  if(!fRequest.length){
    return next(new AppError('request not found',400));
  }

  try{ 

    // PUSH RECEIVER INTO THE SENDERS FRIENDLIST
    await User.findOneAndUpdate(
      { _id: sender._id }, 
      { $push: { friendList: receiver._id }}
    );

    await User.findOneAndUpdate(
      { _id: receiver._id }, 
      { $push: { friendList: sender._id }}
    );

    // DELETE REQUEST FROM THE DB

    await FriendRequest.remove({ _id:fRequest[0]._id });

    console.log('Request confirmed succesfully');  
    return res.status(200).send({message: 'Request confirmed!'});
          
  }
  catch(err){
          
    console.log('failed to confirm the request', err);
    return next(new AppError(`failed to confirm the request. error message: ${err.message}`,400));
  }
});
    
      
module.exports = router;