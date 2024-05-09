const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
      type: String,
      required: true,
      maxlength: 140
    },
    commented_by: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    votes: {
        type: Number,
        required: false,
        default: 0
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
    answer: {
        type: Schema.Types.ObjectId,
        ref: 'Answer'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
  
module.exports = mongoose.model('Comment', commentSchema);