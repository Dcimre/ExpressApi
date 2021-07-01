const Joi = require('@hapi/joi');

// REGISTER VALIDATION

const registerValidation = (data)=>{
  const userSchema = Joi.object ({
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .required()
  });

  return userSchema.validate(data); 
};

// LOGIN VALIDATION

const loginValidation = (data)=>{
  const loginSchema = Joi.object ({
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .required()
  });
        
  return loginSchema.validate(data); 

};

const eventValidation = (data)=>{
  const eventSchema = Joi.object ({
    name: Joi.string()
      .min(3)
      .required(),
    startDate: Joi.date()
      .required(),
    endDate: Joi.date()
      .required(),
    location: Joi.string()
      .min(3)
      .required()
  });
            
  return eventSchema.validate(data); 
    
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation    = loginValidation;
module.exports.eventValidation    = eventValidation;
