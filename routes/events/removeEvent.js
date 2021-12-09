const router = require ('express').Router();
const verify = require ('../verifyToken');
const User = require('../../model/User');
const Event = require('../../model/Event');
const AppError = require('../../AppError');

router.patch('/', verify(['admin','user']), async (req,res,next)=>{

  // DEFINE EVENT

  const event = await Event.find({_id: req.body.eventId});

  if(!event.length){

    return next(new AppError('invalid Event Id', 400));
  }

  console.log('selected event: ', event[0].name);

  //USER IN EVENT

  let userInEvent = await Event.find({ _id: req.body.eventId, participants:req.user.userId});

  console.log(userInEvent);

  if(!userInEvent.length){

    return next(new AppError('You are not part of this event', 400));
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
    return next(new AppError(`failed to remove event. error message: ${err.message}`, 400));
  }
});
  
module.exports = router;