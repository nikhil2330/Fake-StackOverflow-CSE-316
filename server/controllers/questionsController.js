const Question = require('../models/questions');
const Tag = require('../models/tags');
const User = require('../models/user');

module.exports.createQuestion = async (req, res) => {
    try{
        const { title, text, tags, summary} = req.body;
        const user = await User.findById(req.user.userId);
        const tagsarr = tags.split(/\s+/).filter((value, index, self) => value && self.indexOf(value) === index);
        const T_exist = await Tag.find({ name: { $in: tagsarr } });
        const T_ex_name = T_exist.map(tag => tag.name);
        console.log(user.reputation);
        const newTags = [];
        for (const tagName of tagsarr) {
            if (!T_ex_name.includes(tagName)) {
                if (user.reputation < 50) {
                    return res.status(403).json({ error: "Users with reputation below 50 cannot add new tags." });
                }
                const newTag = new Tag({ name: tagName, set_by: user.userId });
                await newTag.save();
                newTags.push(newTag);
            }
        }
    
        const allTags = [...T_exist, ...newTags];
        user.tags.push(allTags.map(tag => tag._id));
        console.log(user.username);
        const newQuestion = new Question({
            title,
            text,
            tags: allTags.map(tag => tag._id),
            asked_by: user._id,
            ask_date_time: new Date(),
            views: 0,
            votes: 0,
            answers: [],
            summary
        });
        user.questions.push(newQuestion._id);
        await user.save();
        await newQuestion.save();
        (await newQuestion.populate('tags')).populate('asked_by', 'username');
        res.json(newQuestion);
    }catch(error){
        console.error('Couldnt put questions:', error);
     }

};

module.exports.incrementQuestionViews = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.json({ message: 'Question not found' });
        }
        question.views += 1;
        await question.save();
        res.json({ message: 'Views incremented'});
    } catch (error) {
        console.error('Error incrementing question views:', error);
    }
};

module.exports.upvoteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        const user = await User.findById(req.user.userId);
        const targetUser = await User.findById(question.asked_by);
        if (!question) {
            return res.json({ message: 'Question not found' });
        }
        if (user.reputation < 50) {
            return res.status(403).json({ error: "Users with reputation below 50 cannot vote" });
        }
        const alreadyUpvoted = user.upVotes.includes(question._id);
        const alreadyDownvoted = user.downVotes.includes(question._id)
        if(alreadyUpvoted){ //reputation only icnreases if not same user as as the post
            
            user.upVotes.pull(question._id);
            question.votes -= 1;
            
            if(!(targetUser._id.equals(user._id))){
                targetUser.reputation -= 5; 
            }
            
        }
        if(alreadyDownvoted){
            user.downVotes.pull(question._id);
            question.votes += 1;
            
            if(!(targetUser._id.equals(user._id))){
                targetUser.reputation += 10;
            }
            
        }
        if(!alreadyDownvoted && !alreadyUpvoted){
            user.upVotes.push(question._id);
            question.votes += 1;
            
            if(!(targetUser._id.equals(user._id))){
                targetUser.reputation += 5;
            }
            
        }
        await question.save();
        await user.save(); 
        await targetUser.save();
        res.json({ message: 'votes incremented'});
    }catch(error){
        console.error('Error voting', error);
    }
}

module.exports.downvoteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        const user = await User.findById(req.user.userId);
        const targetUser = await User.findById(question.asked_by);
        if (!question) {
            return res.json({ message: 'Question not found' });
        }
        if (user.reputation < 50) {
            return res.status(403).json({ error: "Users with reputation below 50 cannot vote" });
        }
        const alreadyUpvoted = user.upVotes.includes(question._id);
        const alreadyDownvoted = user.downVotes.includes(question._id);
        if(alreadyDownvoted){
            user.downVotes.pull(question._id);
            question.votes += 1;
            if(!(targetUser._id.equals(user._id))){
                targetUser.reputation += 10;
            }
            
        }

        if(alreadyUpvoted){
            user.upVotes.pull(question._id);
            question.votes -= 1;
            
            if(!(targetUser._id.equals(user._id))){
                targetUser.reputation -= 5;
            }
        }

        if(!alreadyDownvoted && !alreadyUpvoted){
            user.downVotes.push(question._id);
            question.votes -= 1;
            
            if(!(targetUser._id.equals(user._id))){
                targetUser.reputation -= 10;
            }
            
        }

        await question.save();
        await user.save(); 
        await targetUser.save(); 
        res.json({ message: 'votes decremented'});
    }catch(error){
        console.error('Error voting', error);
    }
}

module.exports.getQuestionById = async (req, res) => {
    const question = await Question.findById(req.params.id).populate('tags').populate({
        path: 'answers',
        populate: {
            path: 'ans_by',
            select: 'username'
        }
    }).populate('asked_by', 'username');
    res.json(question);
};


module.exports.getAllQuestionsWithSearch = async (req, res) => {
    try{
        let { searchText = "" } = req.query;
        searchText = searchText.trim();
        const tagMatches = (searchText.match(/\[(.*?)\]/g) || []).map(match => match.slice(1, -1));
        const textMatches = searchText.replace(/\s*\[(.*?)\]\s*/g, " ").trim();
        const searchWords = textMatches.split(/\s+/).filter(word => word).map(escapeRegex);
        let conditions = [];

        if (tagMatches.length > 0) {
            const tags = await Tag.find({ name: { $in: tagMatches } });
            const tagIds = tags.map(tag => tag._id);
            if (tagIds.length > 0) {
                conditions.push({ tags: { $in: tagIds } });
            }
        }

        if (searchWords.length > 0) {
            conditions.push({
                $or: [
                    { title: { $regex: `\\b(${searchWords.join("|")})\\b`, $options: 'i' } },
                    { text: { $regex: `\\b(${searchWords.join("|")})\\b`, $options: 'i' } }
                ]
            });
        }

        let query = {};
        if (conditions.length > 0) {
            query = conditions.length > 1 ? { $or: conditions } : conditions[0];
        }
        
        const questions = await Question.find(query).populate('tags').populate('answers').populate('asked_by', 'username');
        res.json(questions);

    } catch (error) {
        console.error('Couldnt fetch questions:', error);
    }

};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports.getQuestionsByTag = async (req, res) => {
        const questions = await Question.find({ tags: req.params.tid }).populate('tags').populate('answers').populate('asked_by', 'username'); 
        res.json(questions);
}

