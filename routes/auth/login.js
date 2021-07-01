const router = require('express').Router();
const User = require ('../../model/User');
const bcrypt = require('bcryptjs');
const {loginValidation} = require ('../../validation');
const jwt = require ('jwt-simple');
const AppError = require('../../AppError');

// -=:: LOGIN ::=-

router.post('/login', async (req, res, next)=>{

  // VALIDATE THE USER (JOI)
  
  const {error} = loginValidation(req.body);
  if (error){
    return res.status(400).send({body: error.details[0].message});
  
  }
  
  // CHECK USER EXISTS
  
  const user = await User.findOne({email: req.body.email});
  if (!user){
    return next(new AppError('wrong email', 404));
  }
  
  // PASSWORD COMPARE
  
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass){
    return next(new AppError('Invalid password', 404));

  }
  // SIGN TOKEN TO USER
  let jwtToken;
  
  try{
    const expires = new Date().getTime() + 86400000;
    jwtToken = jwt.encode({
      exp: expires,
      userId: user._id,
      role: user.role
    }, process.env.TOKEN_SECRET);
  
  } catch (error) {
    console.log(error);
  }
  
  return res.status(200).send({body: user, token: jwtToken, message:'LOGGED IN!'});
});
   
module.exports = router;