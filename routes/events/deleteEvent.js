const router = require ('express').Router();
const verify = require ('../verifyToken');
const Event = require('../../model/Event');
const u = require('../../utils');
const User = require('../../model/User');

router.delete('/', verify(['user']), async (req,res)=>{

  // DELETE EVENT

  let role = req.user.role;

  // DEFINE EVENT

  let event = await Event.find({_id: req.body.eventId});


  if(!event.length){

    return res.status(400).send({body: 'invalid Event Id'});
  }

  //USER IS ADMIN OR ORGANIZER

  let organizer = await User.find({ _id: req.body.eventId, creator:req.user.userId});


  if(!organizer.length || !role.includes('admin')){

    return res.status(400).send({body: 'You are not allowed to delete this event'});
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
    return res.status(400).send({body: err.message});
  }
});
  
module.exports = router;