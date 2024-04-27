const Question = require('../models/questions');
const Tag = require('../models/tags');

module.exports.createQuestion = async (req, res) => {
    try{
    
        const { title, text, tags, asked_by } = req.body;
    
        const tagsarr = tags.split(/\s+/).filter((value, index, self) => value && self.indexOf(value) === index);
        const T_exist = await Tag.find({ name: { $in: tagsarr } });
        const T_ex_name = T_exist.map(tag => tag.name);
    
        const newTags = [];
        for (const tagName of tagsarr) {
            if (!T_ex_name.includes(tagName)) {
                const newTag = new Tag({ name: tagName });
                await newTag.save();
                newTags.push(newTag);
            }
        }
    
        const allTags = [...T_exist, ...newTags];
        const newQuestion = new Question({
            title,
            text,
            tags: allTags.map(tag => tag._id),
            asked_by,
            ask_date_time: new Date(),
            views: 0,
            answers: []
        });
        await newQuestion.save();
        await newQuestion.populate('tags');
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

module.exports.getQuestionById = async (req, res) => {
    const question = await Question.findById(req.params.id).populate('tags').populate('answers');
    res.json(question);
};


module.exports.getAllQuestionsWithSearch = async (req, res) => {
    try{
        let { searchText = "" } = req.query;
        searchText = searchText.trim();
        const tagMatches = (searchText.match(/\[(.*?)\]/g) || []).map(match => match.slice(1, -1));
        const textMatches = searchText.replace(/\s*\[(.*?)\]\s*/g, " ").trim();
        const searchWords = textMatches.split(/\s+/).filter(word => word);
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
        
        const questions = await Question.find(query).populate('tags').populate('answers');
        res.json(questions);

    } catch (error) {
        console.error('Couldnt fetch questions:', error);
    }

};

module.exports.getQuestionsByTag = async (req, res) => {
        const questions = await Question.find({ tags: req.params.tid }).populate('tags').populate('answers'); 
        res.json(questions);
}