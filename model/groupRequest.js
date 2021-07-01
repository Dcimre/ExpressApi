const mongoose = require('mongoose');

const groupRequestSchema = new mongoose.Schema({

  groupId: {
    type: String,
    required: true,
  },

  sender: {
    type: String,
    required: true,
  },

  receiver: {
    type: String,
    required: true,
        
  },
  status: {
    type: String,
        
  },
    
},
{
  timestamps: true
});

module.exports = mongoose.model('GroupRequest', groupRequestSchema);