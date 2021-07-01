const router = require ('express').Router();
const verify = require ('../verifyToken');
const User = require('../../model/User');
const Group = require('../../model/Group');

router.patch('/', verify(['admin','user']), async (req,res)=>{


  // DEFINE GROUP

  const group = await Group.find({_id: req.body.groupId});
  const victim = await User.find({email: req.body.email});

  

  if(!group.length){

    return res.status(400).send({body: 'invalid Group Id'});
  }

  console.log('selected event: ', group[0].name);

  //USER IN GROUP

  console.log(group);

  let userInEvent = await Group.find({ _id: req.body.groupId, members:victim._id});

  console.log(userInEvent);

  if(!userInEvent.length){

    return res.status(400).send({body: 'Victim not part of this event'});
  }


  // CHECK ONLY CREATOR CAN REMOVE 

  if(group.creator !== req.user.userId){

    return res.status(400).send('Only the creator can remove a user from the event');
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
    return res.status(400).send({body: err.message});
  }
});
  
module.exports = router;