const router = require ('express').Router();
const verify = require ('../verifyToken');
const User = require('../../model/User');
const AppError = require('../../AppError');

router.delete('/', verify(['admin','user']), async (req,res,next)=>{


  // DEFINE VICTIM

  const victim = await User.find({email: req.body.email});

  if(!victim.length){

    return next(new AppError('try valid user',404));
  }

  console.log('victim: ' , victim[0].name);

  //VICTIM IN FRIENDLIST

  const initiator = User.findOne({_id: req.user.userId});

  if(!initiator.friendList.includes(victim[0]._id)){
 
    return next(new AppError('user is not yor friend',403));
  }
 
  try{ 

    // DELETE FRIEND FROM FRIENDLIST VICA VERSA

    await User.updateOne({ _id: req.user.userId},{ $pull: { friendList: { $in: victim[0]._id} } });
    await User.updateOne({ _id: victim[0]._id},{ $pull: { friendList: { $in: req.user.userId} } });
          
    return res.status(200).send({body: `friend : ${victim[0].name} deleted from friendlist!`});
      
  }
  catch(err){
      
    console.log('failed to delete friend', err);
    return next(new AppError(`failed to delete friend. error message:${err.message}`,400));
  }
});
  
module.exports = router;