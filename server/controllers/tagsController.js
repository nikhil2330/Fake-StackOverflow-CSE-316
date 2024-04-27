const Tag = require('../models/tags');
const Question = require('../models/questions');

exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find();
        const tagsWithCounts = await Promise.all(tags.map(async (tag) => {
            const count = await Question.countDocuments({ tags: tag._id });
            return {
                _id: tag._id,
                name: tag.name,
                questionCount: count
            };
        }));

        res.json(tagsWithCounts);
    } catch (error) {
        console.error('Error retrieving all tags:', error);
    }
};

// exports.getAllTags = async (req, res) => {
//     try {
//         const tags = await Tag.find(); 
//         let totalTagCount = 0;
//         const tagsWithCounts = await Promise.all(tags.map(async (tag) => {
//             const count = await Question.countDocuments({ tags: tag._id });
//             return {
//                 ...tag._doc, 
//                 questionCount: count
//             };
//         }));

//          res.json(tagsWithCounts);
//     } catch (error) {
//         console.error('Error retrieving all tags:', error);
//     }
// };