const router = require ('express').Router();
const verify = require ('../verifyToken');
const Event  = require ('../../model/Event');
const AppError = require('../../AppError');

router.get('/check',verify(['admin','user']), async (req,res,next)=> {

  try{

    let checkedEvent = await Event.findById(req.query.id);

    console.log('checkedevent:' , checkedEvent);

    //CHECK USER IN EVENT
    if(!checkedEvent.participants.includes(req.user.userId)){
      return next(new AppError('User not found in event', 404));
    }
    if(checkedEvent.posts.length){

      let populated = await Event
        .findById(req.query.id)
        .populate('posts')
        .populate('participants')
        .exec();

      return res.status(200).send({body: populated, message: 'request succesfull!', });
    }
  }   
  catch(err){
    return next(new AppError(`Cannot find event... ${err.message}`, 404));
  }
    
});

module.exports = router;