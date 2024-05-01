const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
      type: String,
      required: true
    },
    asked_by: {
      type: String,
      required: true,
      default: 'Anonymous'
    },
    upvotes: {
        type: Number,
        required: false,
        default: 0
    }
});
  
module.exports = mongoose.model('Comment', commentSchema);