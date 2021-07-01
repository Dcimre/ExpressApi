const router = require ('express').Router();
const verify = require ('../verifyToken');
const Event  = require ('../../model/Event');
const AppError = require('../../AppError');

router.get('/check',verify(['admin','user']), async (req,res,next)=> {

 

  try{

    let checkedEvent = await Event.findById(req.query.id);

    console.log(checkedEvent);


    if(checkedEvent.posts.length){

      let populated = await Event.findById(req.query.id).populate('posts', '-_id -__v');

      console.log(populated);

      return res.status(200).send({body: populated, message: 'request succesfull!', });

    }

    console.log(checkedEvent);


    // GET EVENTS

    return res.status(200).send({body: checkedEvent, message: 'request succesfull!', });
  }
    
  catch(err){
    return next(new AppError('Cannot find event', 404));
  }
    
});

module.exports = router;