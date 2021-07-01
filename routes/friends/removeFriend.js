const router = require ('express').Router();
const verify = require ('../verifyToken');
const User = require('../../model/User');


router.delete('/', verify(['admin','user']), async (req,res)=>{


  // DEFINE VICTIM

  const victim = await User.find({email: req.body.email});

  if(!victim.length){

    return res.status(400).send({body: 'invalid email'});
  }

  console.log('victim: ' , victim[0].name);

  //VICTIM IN FRIENDLIST

  const initiator = User.findOne({_id: req.user.userId});

  if(!initiator.friendList.includes(victim[0]._id)){
 
    return res.status(400).send({body: `${victim[0].name} is not yor friend`});
  }
 
  try{ 

    // DELETE FRIEND FROM FRIENDLIST VICA VERSA

    await User.updateOne({ _id: req.user.userId},{ $pull: { friendList: { $in: victim[0]._id} } });
    await User.updateOne({ _id: victim[0]._id},{ $pull: { friendList: { $in: req.user.userId} } });
          
    return res.status(200).send({body: `friend : ${victim[0].name} deleted from friendlist!`});
      
  }
  catch(err){
      
    console.log('failed to delete friend', err);
    return res.status(400).send({body: err.message});
  }
});
  
module.exports = router;