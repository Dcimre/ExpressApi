const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },

  creator: {
    type: String,
    required: true,
        
  },
  description: {
    type: String,
    max: 300,
        
  },
    
  members:[{

    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'

  }],
  posts:[

    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Post'
    }
  ]
    
},
{
  timestamps: true
});

groupSchema.index({name: 'text', description: 'text', creator: 'text'});

module.exports = mongoose.model('Group', groupSchema);