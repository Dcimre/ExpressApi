const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 8
  },
  role: [{
    type: String,
    required: true,
  }],

  friendList:[{
    
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  ],

  groups:[{

    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'   
  }],
  events:[{

    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'  
  }]
    
},
{
  timestamps: true
});


userSchema.index({name: 'text'});

// userSchema.pre(/^find/ , function(next){

//   this.populate({
//     path:'friendList'
//   });
//   next();

// });

module.exports = mongoose.model('User', userSchema);