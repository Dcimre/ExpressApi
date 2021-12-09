const router = require ('express').Router();
const verify = require ('../../routes/verifyToken');
const Event  = require ('../../model/Event');
const EventRequest = require ('../../model/eventRequest');
const User = require('../../model/User');
const mongoose = require('mongoose');
const AppError = require('../../AppError');


router.post('/invite', verify(['admin','user']), async (req,res,next)=>{

  
  // CHECK EVENT EXISTS

  const eventid = req.body.eventId;

  const idIsValid = await mongoose.Types.ObjectId.isValid(eventid);

  if(!idIsValid){
    return next(new AppError('invalid eventId...',404));
  }

  // CHECK USER IN THE EVENT (CANT INVITE OUTSIDE FROM AN EVENT)


  const checkUserInEvent = await Event.find({_id: eventid, participants: req.user.userId } );
  

  console.log(checkUserInEvent);
  console.log('------------------');

  if (!checkUserInEvent.length){

    return next(new AppError('Cant invite someone from outside',403));
  }
 
  // DEFINE RECEIVER 

  const receiver = await User.find({email: req.body.email});

  // CHECK RECEIVER EXISTS

  if (!receiver.length){

    return next(new AppError('Cant found receiver',404));
  }

  // CHECK SELF INVITATION


  if( receiver[0]._id == req.user.userId){

    return next(new AppError('cant invite yourself',409));
  }

  // CHECK ALREADY INVITED

  const checkExisting = await EventRequest.findOne({receiver:receiver[0]._id}).where('eventId').equals(eventid);

  if (checkExisting){

    return next(new AppError('request already exists',400));
  }

  // CHECK ALREADY IN EVENT

  const alreadyInEvent = await Event.find({_id: eventid, participants: receiver[0]._id});

  if (alreadyInEvent.length){

    return next(new AppError('this person already confirmed this event!',400));
  }

  // CREATE RESPONSE DATA

  const data =
          {
            eventId: req.body.eventId,
            sender: req.user.userId,
            receiver: receiver[0]._id,
            status: 'pending'
          }; 

  try{ 

    // SAVE INVITATION TO DATABASE
      
    const d = await EventRequest.create(data);
    console.log('Invitation saved succesfully');  
    return res.status(200).send({body: d, message: `Invitation sent to ${receiver._id}!`});
  }
  catch(err){
      
    console.log('failed to save the Invitation', err);
    return next(new AppError(`failed to save the event. error message: ${err.message}`,400));
  }
});

  
module.exports = router;