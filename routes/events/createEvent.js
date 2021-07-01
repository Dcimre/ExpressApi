const router = require ('express').Router();
const verify = require ('../verifyToken');
const Event  = require ('../../model/Event');
const User = require ('../../model/User');
const AppError = require('../../AppError');


router.post('/', verify(['admin','user']), async (req,res,next)=>{
  console.log('user:', req.user.userId);

  // CHECK FOR DUPLICATION
  
  const eventExist = await Event.findOne({name: req.body.name});
  if (eventExist){
    return next(new AppError('Event already created', 404));
  }

  // CREATE EVENT DATA

  const data =
          {
            name: req.body.name,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            location: req.body.location,
            description: req.body.description,
            organizer: req.user.userId,
            participants: [req.user.userId]
          }; 
  try{ 

    // SAVE EVENT TO DATABASE
      
    const d = await Event.create(data);
    console.log('event saved succesfully');  

    // PUSH EVENT INTO THE CREATORS MODEL

    const event = await Event.findOne(data);

    await User.findOneAndUpdate(
      { _id: req.user.userId }, 
      { $push: { events: event._id }}
    );

    return res.status(200).send({body: d, message: 'Event Created!'});
      
  }
  catch(err){
      
    console.log('failed to save event', err);
    return next(new AppError('Failed to create event', 404));
  }
});
  
module.exports = router;