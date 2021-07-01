const router = require ('express').Router();
const verify = require ('../../routes/verifyToken');
const FriendRequest  = require ('../../model/friendRequest');
const User = require('../../model/User');


router.post('/add', verify(['admin','user']), async (req,res)=>{
    
  if(req.body.email == '' || req.body.email == undefined){
    return res.status(400).send({body: 'add missing!'});
  }

  // DEFINE SENDER AND RECEIVER

  const receiver = await User.findOne({email:req.body.email});
  const sender = await User.findOne({_id: req.user.userId});


  // CHECK SELF-INVITATION

  if(receiver.email == sender.email){
    return res.status(400).send( {body: 'you cant invite yourself!'});
  }

  // checkalready:

  const checkExisting = await FriendRequest.findOne({sender:sender._id}).where('receiver').equals(receiver._id);

  if (checkExisting){

    return res.status(400).send({body: 'request already exists'});

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
    return res.status(400).send({body: err.message});
  }
});

  
module.exports = router;