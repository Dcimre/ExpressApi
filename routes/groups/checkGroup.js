const router = require ('express').Router();
const verify = require ('../verifyToken');
const Group  = require ('../../model/Group');
const AppError = require ('../../AppError');
//const catchAsync = require('../../utils');

router.get('/check',verify(['admin','user']), (async (req,res,next)=> {

  if (req.query.id =='' || req.query.id == undefined){

    next(new AppError('Missing ID', 404));

  }

  try {

    let checkedGroup = await Group.findById(req.query.id);
    console.log(checkedGroup);
  
    if(checkedGroup.posts.length){
  
      let populated = await Group.findById(req.query.id).populate('posts', '-_id -__v');
  
      console.log(populated);
  
      return res.status(200).send({body: populated, message: 'request succesfull!', });
    }
  
    // GET EVENTS
  
    return res.status(200).send({body: checkedGroup, message: 'request succesfull!', });
    
  }
  catch (error) {
    next(new AppError(`Can't find Group with ID: ${req.query.id}`, 404)); 
  }
 
}));

module.exports = router;