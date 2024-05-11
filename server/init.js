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
let tags = [];
let answers = [];

function tagCreate(name) {
    let tag = new Tag({ name: name });
    return tag.save();
  }

async function createAdmin(email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const adminUser = new User({
            username: "Admin",
            email,
            password: hashedPassword,
            isAdmin: true,
            reputation: 1000  // Set high reputation for admin
        });
        await adminUser.save();

        console.log('Admin user created successfully:', adminUser);
        if(db) db.close();
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



createAdmin(email, password)
.catch((err) => {
  console.log('ERROR: ' + err);
  if(db) db.close();
});

