// Answer Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  ans_by: {
    type: String,
    required: true,
  },
  ans_date_time: {
    type: Date,
    default: Date.now,
    required: true
  },  
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: false
  }
});

module.exports = mongoose.model('Answer', answerSchema);