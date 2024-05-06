// Tag Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true 
    },
    set_by: { 
      type: Schema.Types.ObjectId,
      ref: 'User' 
    }
});

module.exports = mongoose.model('Tag', tagSchema);