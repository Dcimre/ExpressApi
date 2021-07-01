const router = require ('express').Router();
const verify = require ('../../routes/verifyToken');
const GroupRequest  = require ('../../model/groupRequest');
const User = require('../../model/User');
const Group  = require ('../../model/Group');


router.patch('/confirm', verify(['admin','user']), async (req,res)=>{

  const sender = await User.findOne({email:req.body.email});
  const receiver = await User.findOne({_id:req.user.userId});

  // CHECK SELF CONFIRMATION

  console.log(sender.email);
  console.log(receiver.email);

  if (sender.email == receiver.email){

    return res.status(400).send({body: 'cant confirm your own Invitation!'});
  }

  // CHECK SENDER / RECEIVER EXISTENCE

  if(!sender || !receiver){
    return res.status(400).send({body: 'sender or receiver not found'});
  }

  // CHECK INVITATION

  const gRequest = await GroupRequest.find({receiver:receiver._id, groupId: req.body.groupId});


  if(!gRequest.length){
    return res.status(400).send({body:'Invitation not found'});
  }

  try{ 

    // PUSH GROUP INTO USER MODEL

    await User.findOneAndUpdate(
      { _id: receiver._id }, 
      { $push: { groups: req.body.groupId }}
    );

    // PUSH RECEIVER INTO THE PARTICIPANTS
    
    await Group.findOneAndUpdate(
      { _id: req.body.groupId }, 
      { $push: { members: receiver._id}}
    );


    // DELETE REQUEST FROM THE DB

    await GroupRequest.remove({ _id:gRequest[0]._id });

    console.log('Invitation confirmed succesfully');  
    return res.status(200).send({message: 'Confirmation sent!'});
          
  }
  catch(err){
          
    console.log('failed to confirm the Invitation', err);
    return res.status(400).send({body: err.message});
  }
});
    
      
module.exports = router;