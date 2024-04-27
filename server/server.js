// Application server
// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); 
const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');
const tagRoutes = require('./routes/tagRoutes'); 
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB successfully");
});

app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);
app.use('/tags', tagRoutes);
app.use('/users', userRoutes);

app.listen(8000, () => console.log(`Example app listening on port!`));

process.on('SIGINT', async () => {
    await db.close();
    console.log('Server closed. Database instance disconnected');
    process.exit(0);
});
















// app.get("/models/questions", async (req, res) => {
//     try{
//         let { searchText = "" } = req.query;
//         searchText = searchText.trim();
//         const tagMatches = (searchText.match(/\[(.*?)\]/g) || []).map(match => match.slice(1, -1));
//         const textMatches = searchText.replace(/\s*\[(.*?)\]\s*/g, " ").trim();
//         const searchWords = textMatches.split(/\s+/).filter(word => word);
//         let conditions = [];

//         if (tagMatches.length > 0) {
//             const tags = await Tag.find({ name: { $in: tagMatches } });
//             const tagIds = tags.map(tag => tag._id);
//             if (tagIds.length > 0) {
//                 conditions.push({ tags: { $in: tagIds } });
//             }
//         }

//         if (searchWords.length > 0) {
//             conditions.push({
//                 $or: [
//                     { title: { $regex: `\\b(${searchWords.join("|")})\\b`, $options: 'i' } },
//                     { text: { $regex: `\\b(${searchWords.join("|")})\\b`, $options: 'i' } }
//                 ]
//             });
//         }

//         let query = {};
//         if (conditions.length > 0) {
//             query = conditions.length > 1 ? { $or: conditions } : conditions[0];
//         }
        
//         const questions = await Question.find(query).populate('tags').populate('answers');
//         res.json(questions);

//     } catch (error) {
//         console.error('Couldnt fetch questions:', error);
//     }
// });


// app.post("/models/answers", async (req, res) => {
//     const { text, ans_by, questionID } = req.body; 

//     const newAnswer = new Answer({
//         text,
//         ans_by,
//         question: questionID,
//         ans_date_time: new Date() 
//     });

//     await newAnswer.save();
//     const question = await Question.findById(questionID);
//     question.answers.push(newAnswer);
//     await question.save();
//     await question.populate('answers');
//     res.json(newAnswer);

// });


// app.post("/models/questions", async (req, res) => {
//     try{
    
//     const { title, text, tags, asked_by } = req.body;

//     const tagsarr = tags.split(/\s+/).filter((value, index, self) => value && self.indexOf(value) === index);
//     const T_exist = await Tag.find({ name: { $in: tagsarr } });
//     const T_ex_name = T_exist.map(tag => tag.name);

//     const newTags = [];
//     for (const tagName of tagsarr) {
//         if (!T_ex_name.includes(tagName)) {
//             const newTag = new Tag({ name: tagName });
//             await newTag.save();
//             newTags.push(newTag);
//         }
//     }

//     const allTags = [...T_exist, ...newTags];
//     const newQuestion = new Question({
//         title,
//         text,
//         tags: allTags.map(tag => tag._id),
//         asked_by,
//         ask_date_time: new Date(),
//         views: 0,
//         answers: []
//     });
//     await newQuestion.save();
//     await newQuestion.populate('tags');
//     res.json(newQuestion);
//     }catch(error){
//         console.error('Couldnt put questions:', error);
//     }
// });

// app.post('/models/questions/increment-view/:id', async (req, res) => {
   
//     const question = await Question.findById(req.params.id);
//     if (question) {
//         question.views += 1;
//         await question.save();
//         res.send('Views incremented');
//     }
  
// });

// app.get('/models/questions/:id', async (req, res) => {
//     const question = await Question.findById(req.params.id).populate('tags')
//     .populate('answers');
//     res.json(question);

// });


// app.get('/models/tags', async (req, res) => {
//     const tags = await Tag.find(); 
//     let totalTagCount = 0;
//     const tagsWithCounts = await Promise.all(tags.map(async (tag) => {
//         const count = await Question.countDocuments({ tags: tag._id });
//         totalTagCount += count;
//         return {
//             ...tag._doc, 
//             questionCount: count
//         };
//     }));

//     res.json(tagsWithCounts);
// });

// app.get('/models/questions/tag/:tid', async (req, res) => {
//     const questions = await Question.find({ tags: req.params.tid }).populate('tags').populate('answers'); 
//     res.json(questions);

// });
