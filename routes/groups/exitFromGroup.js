const router = require ('express').Router();
const verify = require ('../verifyToken');
const User = require('../../model/User');
const Group = require('../../model/Group');

router.patch('/', verify(['admin','user']), async (req,res)=>{

  // DEFINE GROUP

  const group = await Group.find({_id: req.body.groupId});

  if(!group.length){

    return res.status(400).send({body: 'invalid Event Id'});
  }

  console.log('selected group: ', group[0].name);

  //USER IN GROUP

  let userInGroup = await Group.find({ _id: req.body.groupId, members:req.user.userId});

  console.log(userInGroup);

  if(!userInGroup.length){

    return res.status(400).send({body: 'You are not part of this event'});
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
    return res.status(400).send({body: err.message});
  }
});
  
module.exports = router;