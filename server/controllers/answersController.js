const Answer = require('../models/answers');
const Question = require('../models/questions');

exports.createAnswer = async (req, res) => {
    const { text, ans_by, questionID } = req.body;

    try {
        const newAnswer = new Answer({
            text,
            ans_by,
            question: questionID,
            ans_date_time: new Date()
        });

        await newAnswer.save();
        const question = await Question.findById(questionID);
        question.answers.push(newAnswer);
        await question.save();
        await question.populate('answers');

        res.json(newAnswer);
    } catch (error) {
        console.error('Error creating answer:', error);
    }
};