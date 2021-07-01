const router = require('express').Router();
const User = require ('../../model/User');
const bcrypt = require('bcryptjs');
const AppError = require('../../AppError');

const {registerValidation}= require ('../../validation');


// -=:: REGISTER ::=-

router.post ('/register', async (req, res,next) => {

  // VALIDATE THE REGISTRATION

  const {error} = registerValidation(req.body); 
  if (error){
    return res.status(400).send({body: error.details[0].message});
  
  }
  // CHECK IF THE USER ALREADY REGISTERED 
  
  const emailExist = await User.findOne({email: req.body.email});
  if (emailExist){
    return next(new AppError(' Email already used', 404));
  }
  // HASH THE PASSWORD

  const salt = await bcrypt.genSalt(3);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
      
  // CREATE NEW USER
  let data =
        {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          role: ['user']
        };  
  try{ 
    // SAVE USER TO DATABASE
    const savedUser = await User.create(data);
    console.log('user saved succesfully');  
    
    return res.status(200).send({body: {user: savedUser.id}});    
  }
  catch(err){
        
    console.log('failed to save user', err); 
    return next(new AppError('Registration failed', 404));
  }     

});

module.exports = router;