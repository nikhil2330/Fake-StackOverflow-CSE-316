// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user'); 

const mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB successfully");
});


let Question = require('./models/questions');
let Answer = require('./models/answers');
let Tag = require('./models/tags');
let Comment = require('./models/comments');


async function createAdmin(email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new User({
            username: "Admin",
            email,
            password: hashedPassword,
            isAdmin: true,
            reputation: 1000
        });
        await admin.save();

        console.log('Admin user created successfully:', admin);
        console.log('done');
    } catch (error) {
        console.error('Failed to create admin user:', error);
    } 
}
const email = process.argv[2];
const password = process.argv[3];
if (!email || !password) {
    console.log('Set as node server/init.js <email> <password>');
    process.exit(1);
}
async function createTag(name, set_by) {
    const tag = new Tag({ name, set_by });
    console.log('done');
    return tag.save();
    
}

async function createUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        email,
        password: hashedPassword
    });
    console.log('done');
    return user.save();
    
}

async function createQuestion(title, text, summary, tags, asked_by, views ) {
    const question = new Question({
        title,
        text,
        summary,
        tags,
        asked_by,
        views,
        ask_date_time: new Date(),
        votes: 0
    });
    console.log('done');
    return question.save();
    
}

async function createAnswer(text, ans_by, question) {
    const answer = new Answer({
        text,
        ans_by,
        question,
        ans_date_time: new Date()
    });
    console.log('done');
    return answer.save();
    
}

async function createComment(text, commented_by, question, answer = null) {
    const comment = new Comment({
        text,
        commented_by,
        question,
        answer,
        created_at: new Date()
    });
    console.log('done');
    return comment.save();
    
}

async function populateData(email, password) {
    const admin = await createAdmin(email, password);
    const user1 = await createUser('Coolboy23', 'coolboy23@gmail.com', 'password1');
    const user2 = await createUser('TheRoCK', 'therock@gmail.com', 'password2');

    const tag1 = await createTag('JavaScript', user2);
    const tag2 = await createTag('TypeScript', user1);

    const question1 = await createQuestion('How to use react with typescript?', 'How do I convert Js to typescript to use react? I`m having problems running my react project after converting it to typescript. ', 'JS to typescript in react', [tag1, tag2], user1, 10);
    const answer1 = await createAnswer('You have to change the json file to incorporate typescript as well', user2, question1);
    
    question1.answers.push(answer1);
    await question1.save();
    console.log("done")
    const comment1 = await createComment('This is a very useful answer!', user1, null, answer1);
    answer1.comments.push(comment1);
    await answer1.save();
    user1.questions.push(question1);
    user2.answers.push(answer1.question);
    console.log("abc")
    user2.tags.push(tag1);
    console.log("abcd")
    user1.tags.push(tag2);
    await user1.save();
    await user2.save();

    console.log("done")

    console.log('Database has been populated.');
    if(db) db.close();
}

populateData(email, password)
.catch((err) => {
  console.log('ERROR: ' + err);
  if(db) db.close();
});

