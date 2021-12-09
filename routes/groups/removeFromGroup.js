const router = require ('express').Router();
const verify = require ('../verifyToken');
const User = require('../../model/User');
const Group = require('../../model/Group');
const AppError = require('../../AppError');

router.patch('/', verify(['admin','user']), async (req,res,next)=>{


  // DEFINE GROUP

  const group = await Group.find({_id: req.body.groupId});
  const victim = await User.find({email: req.body.email});

  

  if(!group.length){

    return next(new AppError('Group not found',404));
  }

  console.log('selected event: ', group[0].name);

  //USER IN GROUP

  console.log(group);

  let userInEvent = await Group.find({ _id: req.body.groupId, members:victim._id});

  console.log(userInEvent);

  if(!userInEvent.length){

    return next(new AppError('Victim not part of this event',404));
  }


  // CHECK ONLY CREATOR CAN REMOVE 

  if(group.creator !== req.user.userId){

    return next(new AppError('Only the creator can remove a user from the event',403));
  }


  try{ 

    // REMOVE USER AND GROUP VICA VERSA

    await User.updateOne(
      { _id: req.body.victimId},
      { $pull: { groups: { $in: req.body.groupId} } },
      { multi: true }
    );
    await Group.updateOne(
      { _id: req.body.groupId},
      { $pull: { members: { $in: victim[0]._id} } },
      { multi: true }
    );
          
    return res.status(200).send({body: `Group : ${group[0].name} removed.`});
      
  }
  catch(err){
      
    console.log('failed to remove event', err);
    return next(new AppError(`failed to remove event. error message: ${err.message}`),400);
  }
});
  
module.exports = router;