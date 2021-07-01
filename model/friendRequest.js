const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },

  receiver: {
    type: String,
    required: true,
        
  },
  status: {
    type: String,
    max: 300,
        
  },
    
},
{
  timestamps: true
});

module.exports = mongoose.model('friendRequest', friendRequestSchema);