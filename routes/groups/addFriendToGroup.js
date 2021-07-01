const router = require ('express').Router();
const verify = require ('../../routes/verifyToken');
const Group  = require ('../../model/Group');
const GroupRequest = require ('../../model/groupRequest');
const User = require('../../model/User');
const mongoose = require('mongoose');


router.post('/invite', verify(['admin','user']), async (req,res)=>{

  
  // CHECK EVENT EXISTS

  const groupId = req.body.groupId;

  const idIsValid = await mongoose.Types.ObjectId.isValid(groupId);

  if(!idIsValid){
    return res.status(400).send({body: 'not valid eventId'});
  }

  // CHECK USER IN THE GROUP (CANT INVITE FROM OUTSIDE)


  const checkUserInGroup = await Group.find({_id: groupId, members: req.user.userId } );
  

  console.log(checkUserInGroup);
  console.log('------------------');

  if (!checkUserInGroup.length){

    return res.status(400).send({body: 'Cant invite someone from outside'});
  }
 
  // DEFINE RECEIVER 

  const receiver = await User.find({email: req.body.email});

  // CHECK RECEIVER EXISTS

  if (!receiver.length){

    return res.status(400).send({body: 'invalid user, cant invite'});
  }

  // CHECK SELF INVITATION


  if( receiver[0]._id == req.user.userId){

    return res.status(400).send({body: 'cant invite yourself'});
  }

  // CHECK ALREADY INVITED

  const checkExisting = await GroupRequest.findOne({receiver:receiver[0]._id}).where('groupId').equals(groupId);

  if (checkExisting){

    return res.status(400).send({body: 'request already exists'});
  }

  // CHECK ALREADY IN GROUP

  const alreadyInGroup = await Group.find({_id: groupId, members: receiver[0]._id});

  if (alreadyInGroup.length){

    console.log('this person already confirmed this group');
    return res.status(400).send({body: 'this person already In the group!'});
  }

  // CREATE RESPONSE DATA

  const data =
          {
            groupId: req.body.groupId,
            sender: req.user.userId,
            receiver: receiver[0]._id,
            status: 'pending'
          }; 

  try{ 

    // SAVE INVITATION TO DATABASE
      
    const d = await GroupRequest.create(data);
    console.log('Invitation saved succesfully');  
    return res.status(200).send({body: d, message: 'Invitation sent!'});
  }
  catch(err){
      
    console.log('failed to save the Invitation', err);
    return res.status(400).send({body: err.message});
  }
});

  
module.exports = router;