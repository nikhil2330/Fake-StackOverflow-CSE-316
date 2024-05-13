const Tag = require('../models/tags');
const Question = require('../models/questions');
const User = require('../models/user')

module.exports.getAllTags = async (req, res) => {
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

module.exports.deleteTag = async (req, res) => {
    try {
        const count = await Question.countDocuments({ tags: req.params.id });
        if (count > 1) {
            return res.status(403).json({ message: "Tag is shared by multiple questions and cannot be edited." });
        }
        await Question.updateOne({}, { $pull: { tags: req.params.id } });
        await User.updateOne({}, { $pull: { tags: req.params.id } });
        await Tag.findByIdAndDelete(req.params.id);
        res.send({ message: "Tag deleted successfully" });

    } catch (error) {
        console.error('Error deleting tags', error);
    }
};
module.exports.editTag = async (req, res) => {
    try {
        const { name } = req.body;
        const count = await Question.countDocuments({ tags: req.params.id });
        if (count > 1) {
            return res.status(403).json({ message: "Tag is shared by multiple questions and cannot be edited." });
        }
        const existingTag = await Tag.findOne({ name, _id: { $ne: req.params.id } });
        
        if (existingTag) {
            return res.status(409).json({ message: "Tag name already exists." });
        }
        const updatedTag = await Tag.findByIdAndUpdate(req.params.id, { name }, { new: true });
        res.json({ message: "Tag updated successfully", tag: updatedTag });
    } catch (error) {
        console.error('Error retrieving all tags:', error);
    }
};