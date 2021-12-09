const router = require ('express').Router();
const verify = require ('../verifyToken');
const User = require('../../model/User');
const Group = require('../../model/Group');
const AppError = require('../../AppError');

router.patch('/', verify(['admin','user']), async (req,res,next)=>{

  // DEFINE GROUP

  const group = await Group.find({_id: req.body.groupId});

  if(!group.length){

    return next(new AppError('invalid Event Id',400));
  }

  console.log('selected group: ', group[0].name);

  //USER IN GROUP

  let userInGroup = await Group.find({ _id: req.body.groupId, members:req.user.userId});

  console.log(userInGroup);

  if(!userInGroup.length){

    return next(new AppError('You are not part of this event',400));
  }

  try{ 

    // REMOVE USER AND GROUP VICA VERSA

    await User.updateOne(
      { _id: req.user.userId},
      { $pull: { groups: { $in: req.body.groupId} } },
      { multi: true }
    );
    await Group.updateOne(
      { _id: req.body.groupId},
      { $pull: { members: { $in: req.user.userId} } },
      { multi: true }
    );
          
    return res.status(200).send({body: `Group : ${group[0].name} removed.`});
      
  }
  catch(err){
      
    console.log('failed to remove event', err);
    return next(new AppError(`failed to exit from group. error message: ${err.message}`,400));
  }
});
  
module.exports = router;