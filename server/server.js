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
//const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json());
//app.use(cookieParser());

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

