const router = require ('express').Router();
const verify = require ('../../routes/verifyToken');
const FriendRequest  = require ('../../model/friendRequest');
const User = require('../../model/User');


router.patch('/', verify(['admin','user']), async (req,res)=>{


  const sender = await User.findOne({email:req.body.email});
  const receiver = await User.findOne({_id:req.user.userId});

  if (receiver._id.toString() == sender._id.toString()){

    return res.status(400).send({body: 'cant confirm your own request'});
  }

  if(!sender || !receiver){
    return res.status(400).send({body: 'sender or receiver not found'});
  }

  const fRequest = await FriendRequest.find({receiver:receiver._id, sender: sender._id});

  if(!fRequest.length){
    return res.status(400).send({body:'request not found'});
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
    return res.status(400).send({body: err.message});
  }
});
    
      
module.exports = router;