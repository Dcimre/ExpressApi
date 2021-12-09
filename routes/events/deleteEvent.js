const router = require ('express').Router();
const verify = require ('../verifyToken');
const Event = require('../../model/Event');
const u = require('../../utils');
const User = require('../../model/User');
const AppError = require('../../AppError');


router.delete('/', verify(['user']), async (req,res, next)=>{

  // DELETE EVENT

  let role = req.user.role;

  // DEFINE EVENT

  let event = await Event.find({_id: req.body.eventId});


  if(!event.length){

    return next(new AppError('Event not found', 404));
  }

  //USER IS ADMIN OR ORGANIZER

  let organizer = await User.find({ _id: req.body.eventId, creator:req.user.userId});


  if(!organizer.length || !role.includes('admin')){

    return next(new AppError('You are not allowed to delete this event', 403));
  }


  try{ 

    // REMOVE EVENT FROM PARTICIPANTS PROFILE

    u.AsyncForEach(event.participants, async (x) => {
      await User.updateOne({_id: x},{ $pull: { events: { $in: event._id} } });
    });

    // DELETE EVENT 

    await Event.remove({ _id: event[0]._id });
          
    return res.status(200).send({body: `Event : ${event[0].name} removed.`});
      
  }
  catch(err){
      
    console.log('failed to remove event', err);
    return next(new AppError(`some error happened... error mesage: ${err.message}`, 400));
  }
});
  
module.exports = router;