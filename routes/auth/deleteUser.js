const router = require ('express').Router();
const verify = require ('../verifyToken');
const User = require('../../model/User');
const AppError = require('../../AppError');



router.delete('/', verify(['admin']), async (req,res,next)=>{

  // DEFINE VICTIM

  const victim = await User.find({_id: req.body.victimId});

  if(!victim.length){

    return next(new AppError('Cant find ID on this server', 404));
  }

  try{ 

    // DELETE USER FROM DATABASE

    await User.remove({ _id: victim[0]._id });
          
    return res.status(200).send({body: `user : ${victim[0].name} deleted!`});
      
  }
  catch(err){
      
    console.log('failed to delete user', err);
    return next(new AppError('failed to delete user', 404));
  }
});
  
module.exports = router;