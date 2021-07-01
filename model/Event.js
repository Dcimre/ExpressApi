const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,   
  },
  location: {
    type: String,
    required: true,    
  },
  description: {
    type: String,
    max: 300,     
  },
  organizer: {
    type: String
  },
  participants:[

    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
  ],
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

eventSchema.index({name: 'text', location: 'text', description: 'text'});

module.exports = mongoose.model('Event', eventSchema);