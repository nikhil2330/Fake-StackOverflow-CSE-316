const Answer = require('../models/answers');
const Question = require('../models/questions');
const User = require('../models/user')

exports.createAnswer = async (req, res) => {
    const { text, questionID } = req.body;
    const user = await User.findById(req.user.userId);
    try {
        const newAnswer = new Answer({
            text,
            ans_by: user._id,
            question: questionID,
            ans_date_time: new Date()
        });

        await newAnswer.save();
        const question = await Question.findById(questionID);
        user.answers.push(question._id);
        await user.save();
        question.answers.push(newAnswer);
        await question.save();
        (await question.populate({
            path: 'answers',
            populate: {
                path: 'ans_by',
                select: 'username'
            }
        })).populate('tags');
        

        res.json(newAnswer);
    } catch (error) {
        console.error('Error creating answer:', error);
    }
};