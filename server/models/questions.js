// Question Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  text: {
    type: String,
    required: true
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
  }});

  module.exports = mongoose.model('Question', questionSchema);