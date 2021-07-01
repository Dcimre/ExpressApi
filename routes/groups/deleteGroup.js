const router = require ('express').Router();
const verify = require ('../verifyToken');
const Group = require('../../model/Group');
const User = require ('../../model/User');
const u = require('../../utils');

router.delete('/', verify(['user','admin']), async (req,res)=>{

  const role = req.user.role;

  // DEFINE GROUP

  const group = await Group.find( {_id: req.body.groupId} );

  if(!group.length){

    return res.status(400).send( {body: 'invalid group Id'} );
  }

  console.log('selected group: ', group[0]._id);

  //USER IS ADMIN OR CREATOR

  let creator = await Group.find({ _id: group[0]._id, creator:req.user.userId});

  console.log(creator[0]._id);


  if( !creator.length || !role.includes ('admin') ){

    return res.status(400).send({body: 'You are not allowed to delete this group'});
  }

  try{ 

    // REMOVE GROUP FROM MEMBERS PROFILE

    u.AsyncForEach(group.members, async (x) => {
      await User.updateOne({_id: x},{ $pull: { groups: { $in: group._id} } });
    });

    // DELETE EVENT 

    await Group.remove({ _id: group[0]._id });
          
    return res.status(200).send({body: `Group : ${group[0].name} removed.`});
      
  }
  catch(err){
      
    console.log('failed to remove group', err);
    return res.status(400).send({body: err.message});
  }
});
  
module.exports = router;