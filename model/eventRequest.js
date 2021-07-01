const mongoose = require('mongoose');

const eventRequestSchema = new mongoose.Schema({

  eventId: {
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

module.exports = mongoose.model('EventRequest', eventRequestSchema);