const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 30
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
        
  },
  article: {
    type: String,
    max: 300,
    required:true
        
  }
    
},
{
  timestamps: true
});

postSchema.index({title: 'text', article: 'text', author: 'text'});

module.exports = mongoose.model('Post', postSchema);