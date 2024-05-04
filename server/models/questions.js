// Question Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50
  },
  text: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: "nothing",
    required: true,
    maxlength: 140
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  asked_by: {
    type: String,
    required: true,
    default: 'Anonymous'
  },
  ask_date_time: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  views: {
    type: Number,
    default: 0

  },
  upvotes: {
    type: Number,
    required: false,
    default: 0
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],

});

module.exports = mongoose.model('Question', questionSchema);