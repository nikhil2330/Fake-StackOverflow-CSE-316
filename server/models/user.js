const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    reputation: {type: Number, default: 50},
    join_date_time:{type: Date, default: Date.now, required: true},
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    upVotes: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    downVotes: [{ type: Schema.Types.ObjectId, ref: 'Question' }]

});

module.exports = mongoose.model('User', userSchema);