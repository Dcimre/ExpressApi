const router = require ('express').Router();
const verify = require ('../verifyToken');
const Group = require('../../model/Group');
const User = require('../../model/User');

console.log('nyenye');


router.post('/', verify(['admin','user']), async (req,res)=>{


  console.log('user:', req.user.userId);

  // CHECK FOR DUPLICATION
  
  const groupExist = await Group.findOne({name: req.body.name});
  if (groupExist){
    return res.status(400).send({body: { message:'name occupied by another group'}});
  }

  // CREATE GROUP DATA

  const data =
          {
            name: req.body.name,
            description: req.body.description,
            creator: req.user.userId,
            members: [req.user.userId]
          }; 
  try{ 

    // SAVE GROUP TO DATABASE
      
    const d = await Group.create(data);
    console.log('group saved succesfully');  

    // PUSH GROUP INTO THE CREATORS MODEL

    const group = await Group.findOne(data);

    await User.findOneAndUpdate(
      { _id: req.user.userId }, 
      { $push: { groups: group._id }}
    );

    return res.status(200).send({body: d, message: 'Event Created!'});
      
  }
  catch(err){
      
    console.log('failed to save event', err);
    return res.status(400).send({body: err.message});
  }
});

module.exports = router;
  