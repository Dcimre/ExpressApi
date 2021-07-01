const router = require ('express').Router();
const verify = require ('../verifyToken');
const User = require('../../model/User');
const Event = require('../../model/Event');

router.patch('/', verify(['admin','user']), async (req,res)=>{


  // DEFINE EVENT

  const event = await Event.find({_id: req.body.eventId});

  if(!event.length){

    return res.status(400).send({body: 'invalid Event Id'});
  }

  console.log('selected event: ', event[0].name);

  //USER IN EVENT

  let userInEvent = await Event.find({ _id: req.body.eventId, participants:req.user.userId});

  console.log(userInEvent);

  if(!userInEvent.length){

    return res.status(400).send({body: 'You are not part of this event'});
  }


  try{ 

    // DELETE EVENT AND PARTICIPANT

    await User.updateOne(
      { _id: req.user.userId},
      { $pull: { events: { $in: req.body.eventId} } },
      { multi: true }
    );
    await Event.updateOne(
      { _id: req.body.eventId},
      { $pull: { participants: { $in: req.user.userId} } },
      { multi: true }
    );
          
    return res.status(200).send({body: `Event : ${event[0].name} removed.`});
      
  }
  catch(err){
      
    console.log('failed to remove event', err);
    return res.status(400).send({body: err.message});
  }
});
  
module.exports = router;