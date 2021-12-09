const router = require ('express').Router();
const verify = require ('../../routes/verifyToken');
const EventRequest  = require ('../../model/eventRequest');
const User = require('../../model/User');
const Event  = require ('../../model/Event');
const AppError = require('../../AppError');



router.patch('/confirm', verify(['admin','user']), async (req,res,next)=>{

  const sender = await User.findOne({email:req.body.email});
  const receiver = await User.findOne({_id:req.user.userId});

  // CHECK SELF CONFIRMATION
  
  if (receiver.email == sender.email){

    return next(new AppError('Cannot confirm your own invitation', 406));
  }

  // CHECK SENDER / RECEIVER EXISTENCE

  if(!sender || !receiver){
    return next(new AppError('Cannot find sender or receiver', 404));
  }

  // CHECK INVITATION

  const eRequest = await EventRequest.find({receiver:receiver._id, sender: sender._id});

  if(!eRequest.length){
    return next(new AppError('Cannot find Invitation', 404));
  }

  // CHECK EVENT EXISISTS
  const existing = await Event.find({_id:req.body.eventId});

  if(!existing){
    return next(new AppError('Event does not exists',404));
  }

  try{ 

    // PUSH EVENT INTO USER MODEL

    await User.findOneAndUpdate(
      { _id: receiver._id }, 
      { $push: { events: req.body.eventId }}
    );

    // PUSH RECEIVER INTO THE PARTICIPANTS
    
    await Event.findOneAndUpdate(
      { _id: req.body.eventId }, 
      { $push: { participants: receiver._id}}
    );


    // DELETE REQUEST FROM THE DB

    await EventRequest.remove({ _id:eRequest[0]._id });

    console.log('Invitation confirmed succesfully');  
    return res.status(200).send({message: `Confirmation sent to ${sender.name} !`});
          
  }
  catch(err){
          
    console.log('failed to confirm the Invitation', err);
    return next(new AppError(`confirmation failed... ${err.message}`, 400));
  }
});
    
      
module.exports = router;