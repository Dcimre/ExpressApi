const router = require ('express').Router();
const verify = require ('../../routes/verifyToken');
const Event  = require ('../../model/Event');
const EventRequest = require ('../../model/eventRequest');
const User = require('../../model/User');
const mongoose = require('mongoose');


router.post('/invite', verify(['admin','user']), async (req,res)=>{

  
  // CHECK EVENT EXISTS

  const eventid = req.body.eventId;

  const idIsValid = await mongoose.Types.ObjectId.isValid(eventid);

  if(!idIsValid){
    return res.status(400).send({body: 'not valid eventId'});
  }

  // CHECK USER IN THE EVENT (CANT INVITE OUTSIDE FROM AN EVENT)


  const checkUserInEvent = await Event.find({_id: eventid, participants: req.user.userId } );
  

  console.log(checkUserInEvent);
  console.log('------------------');

  if (!checkUserInEvent.length){

    return res.status(400).send({body: 'Cant invite someone from outside'});
  }
 
  // DEFINE RECEIVER 

  const receiver = await User.find({email: req.body.email});

  // CHECK RECEIVER EXISTS

  if (!receiver.length){

    return res.status(400).send({body: 'invalid user, cant invite'});
  }

  // CHECK SELF INVITATION


  if( receiver[0]._id == req.user.userId){

    return res.status(400).send({body: 'cant invite yourself'});
  }

  // CHECK ALREADY INVITED

  const checkExisting = await EventRequest.findOne({receiver:receiver[0]._id}).where('eventId').equals(eventid);

  if (checkExisting){

    return res.status(400).send({body: 'request already exists'});
  }

  // CHECK ALREADY IN EVENT

  const alreadyInEvent = await Event.find({_id: eventid, participants: receiver[0]._id});

  if (alreadyInEvent.length){

    console.log('this person already confirmed this event');
    return res.status(400).send({body: 'this person already confirmed this event!'});
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
    return res.status(200).send({body: d, message: 'Invitation sent!'});
  }
  catch(err){
      
    console.log('failed to save the Invitation', err);
    return res.status(400).send({body: err.message});
  }
});

  
module.exports = router;