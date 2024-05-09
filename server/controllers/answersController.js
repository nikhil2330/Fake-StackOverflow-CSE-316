const Answer = require('../models/answers');
const Question = require('../models/questions');
const User = require('../models/user')

module.exports.createAnswer = async (req, res) => {
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


module.exports.upvoteAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        const user = await User.findById(req.user.userId);
        const targetUser = await User.findById(answer.ans_by);
        if (!answer) {
            return res.json({ message: 'Answer not found' });
        }
        if (user.reputation < 50) {
            return res.status(403).json({ error: "Users with reputation below 50 cannot vote" });
        }
        const alreadyUpvoted = user.A_upVotes.includes(answer.id);
        const alreadyDownvoted = user.A_downVotes.includes(answer.id)
        if(alreadyUpvoted){ //reputation only icnreases if not same user as as the post
            
            user.A_upVotes.pull(answer._id);
            answer.votes -= 1;
            
            if(!(targetUser._id.equals(user._id))){
                targetUser.reputation -= 5; 
            }
            
        }
        if(alreadyDownvoted){
            user.A_downVotes.pull(answer._id);
            answer.votes += 1;
            
            if(!(targetUser._id.equals(user._id))){
                targetUser.reputation += 10;
            }
            
        }
        if(!alreadyDownvoted && !alreadyUpvoted){
            user.A_upVotes.push(answer._id);
            answer.votes += 1;
            
            if(!(targetUser._id.equals(user._id))){
                targetUser.reputation += 5;
            }
            
        }
        await answer.save();
        await user.save(); 
        await targetUser.save();
        res.json({ message: 'votes incremented'});
    }catch(error){
        console.error('Error voting', error);
    }
}

module.exports.downvoteAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        const user = await User.findById(req.user.userId);
        const targetUser = await User.findById(answer.ans_by);
        if (!answer) {
            return res.json({ message: 'Answer not found' });
        }
        if (user.reputation < 50) {
            return res.status(403).json({ error: "Users with reputation below 50 cannot vote" });
        }
        const alreadyUpvoted = user.A_upVotes.includes(answer.id);
        const alreadyDownvoted = user.A_downVotes.includes(answer.id);
        if(alreadyDownvoted){
            user.A_downVotes.pull(answer._id);
            answer.votes += 1;
            if(!(targetUser._id.equals(user._id))){
                targetUser.reputation += 10;
            }
            
        }

        if(alreadyUpvoted){
            user.A_upVotes.pull(answer._id);
            answer.votes -= 1;
            
            if(!(targetUser._id.equals(user._id))){
                targetUser.reputation -= 5;
            }
        }

        if(!alreadyDownvoted && !alreadyUpvoted){
            user.A_downVotes.push(answer._id);
            answer.votes -= 1;
            
            if(!(targetUser._id.equals(user._id))){
                targetUser.reputation -= 10;
            }
            
        }

        await answer.save();
        await user.save(); 
        await targetUser.save(); 
        res.json({ message: 'votes decremented'});
    }catch(error){
        console.error('Error voting', error);
    }
}


module.exports.updateAnswer= async (req,res) => {
    const { id } = req.params;
    const { text} = req.body;
    try{
        const answer = await Answer.findById(id);
        const user = await User.findById(req.user.userId);
        answer.text = text || answer.text;
        await user.save();
        await answer.save();
        res.json({ message: "answer updated successfully", answer });
    }catch(error){
        console.error('Error updating answer:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.deleteAnswer= async (req, res)=> {
    const { id } = req.params;
    try {
        const answer = await Answer.findById(id);

        const otherAnswers = await Answer.find({
            question: answer.question,
            ans_by: answer.ans_by,
            _id: { $ne: id }  // Exclude the current answer
        });

        await Question.findByIdAndUpdate(answer.question, {
            $pull: { answers: id }
        });
        if (otherAnswers.length === 0) {
            await User.findByIdAndUpdate(answer.ans_by, {
                $pull: {
                    answers: answer.question,
                    A_upVotes: id,
                    A_downVotes: id
                }
            });
        } else{
            await User.findByIdAndUpdate(answer.ans_by, {
                $pull: {
                    A_upVotes: id,
                    A_downVotes: id
                }
            });
        }

        //await Comment.deleteMany({ question: id });
       
        await Answer.findByIdAndDelete(id);
        // const user = await User.findById(req.user.userId);
        // console.log(user);
        res.json({ message: "Answer and associated data deleted successfully" });
    } catch (error) {
        console.error('Failed to delete Answer:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.getAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id)
            .populate('ans_by', 'username')
            .populate('question');

        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        res.json(answer);
    } catch (error) {
        console.error('Failed to fetch answer:', error);
        res.status(500).json({ message: 'Error fetching answer' });
    }
};


