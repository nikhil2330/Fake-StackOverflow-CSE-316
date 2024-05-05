const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
      type: String,
      required: true
    },
    commented_by: { 
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    votes: {
        type: Number,
        required: false,
        default: 0
    }
});
  
module.exports = mongoose.model('Comment', commentSchema);