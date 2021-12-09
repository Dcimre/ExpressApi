const router = require ('express').Router();
const verify = require ('../verifyToken');
const Group = require('../../model/Group');
const User = require('../../model/User');
const AppError = require('../../AppError');

console.log('nyenye');


router.post('/', verify(['admin','user']), async (req,res,next)=>{


  console.log('user:', req.user.userId);

  // CHECK FOR DUPLICATION
  
  const groupExist = await Group.findOne({name: req.body.name});
  if (groupExist){
    return next(new AppError('name occupied by another Group',400));
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
    console.log('Group saved succesfully');  

    // PUSH GROUP INTO THE CREATORS MODEL

    const group = await Group.findOne(data);

    await User.findOneAndUpdate(
      { _id: req.user.userId }, 
      { $push: { groups: group._id }}
    );

    return res.status(200).send({body: d, message: 'Group Created!'});
      
  }
  catch(err){
      
    console.log('failed to save event', err);
    return next(new AppError(`failed to save Group. Error message: ${err.message}`,400));
  }
});

module.exports = router;
  