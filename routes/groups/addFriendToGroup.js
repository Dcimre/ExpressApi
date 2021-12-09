const router = require ('express').Router();
const verify = require ('../../routes/verifyToken');
const Group  = require ('../../model/Group');
const GroupRequest = require ('../../model/groupRequest');
const User = require('../../model/User');
const mongoose = require('mongoose');
const AppError = require('../../AppError');

router.post('/invite', verify(['admin','user']), async (req,res,next)=>{

  
  // CHECK EVENT EXISTS

  const groupId = req.body.groupId;

  const idIsValid = await mongoose.Types.ObjectId.isValid(groupId);

  if(!idIsValid){
    return next(new AppError('Event not found',404));
  }

  // CHECK USER IN THE GROUP (CANT INVITE FROM OUTSIDE)


  const checkUserInGroup = await Group.find({_id: groupId, members: req.user.userId } );
  

  console.log(checkUserInGroup);
  console.log('------------------');

  if (!checkUserInGroup.length){

    return next(new AppError('Cant invite someone from outside',402));
  }
 
  // DEFINE RECEIVER 

  const receiver = await User.find({email: req.body.email});

  // CHECK RECEIVER EXISTS

  if (!receiver.length){

    return next(new AppError('invalid user, cant invite',4032));
  }

  // CHECK SELF INVITATION


  if( receiver[0]._id == req.user.userId){

    return next(new AppError('cant invite yourself',400));
  }

  // CHECK ALREADY INVITED

  const checkExisting = await GroupRequest.findOne({receiver:receiver[0]._id}).where('groupId').equals(groupId);

  if (checkExisting){

    return next(new AppError('request already exists',400));
  }

  // CHECK ALREADY IN GROUP

  const alreadyInGroup = await Group.find({_id: groupId, members: receiver[0]._id});

  if (alreadyInGroup.length){

    return next(new AppError('this person already In the group!',400));
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
    return next(new AppError(`failed to save/send the Invitation. error message: ${err.message}`,400));
  }
});

  
module.exports = router;