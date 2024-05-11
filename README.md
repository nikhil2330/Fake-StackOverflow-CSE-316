[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/tRxoBzS5)
Add design docs in *images/*

## Instructions to setup and run project
1. When you pull the repository, First you need to install the dependencies that exist in the package.json file in both directories. Which include node_modules on both client and server, axios in client, then in server, express, cors, bcrypt, nodemon, dotenv, jsonwebtoken and cookieparser and mongoose. You also need to install dotenv on the main directory itself not within server or client. 
2. Once you have the dependencies, You need to create a .env file in the home directory containing a secret password for JWT_SECRET. An example file is given as .env.example.
3. Then you can run your database using mongod, then run node server/init.js with 2 arguments admin_email and admin_password. After this succesfully runs. You can run node server/server.js and then on client run npm start. This will launch up the page to the welcome page.
4. You can select any of the three options as you see fit to either sign up login or continue as guest. 
5. One major thing that has to be taken into consideration is that, you need to reload the page once after you login everytime you login. This is a flaw which hasn't been fixed yet.
6. Everything else should work as expected. Reputation only increases if you vote on another user and not your own question or answer. In the profile page for questions clicking on the title leads to the the question detail and answers page but clicking the edit button goes to the new question instead. This is done to give better UI.


## Team Member 1 Contribution
* Home page - UI of the home page, questions displayed, viewcount, all buttons
* Searching text & tags - any input taken in the search bar
* Sorting Algorithms - sorting questions newest to oldest, most recently answered, unanswered
* Question Page - UI of the page
* Post Question - error messages, displaying the question on homepage, storing new question into model
* Hyperlinks - included in post question, post answer, displaying answers
* Mongo schema - schema for questons, answers, tags, & server based functions
* Answer Page - UI of the page
* admmin and profile page
* Comments
* Question of a Tag - clicking a specific tag & displaying the questions linked to the tag, having the tags displayed on the question


## Team Member 2 Contribution
* Tags page - UI of tags page, displaying tag boxes, view count, three boxes in a row

* Post Answer - error messages, displaying the answer with the associated question, storing new answer into the model
* Post Question - fixing the errors displayed with tags and whitespaces
* CSS - css for the pages, fixing layout of home page, tags page, question and answer displays, fixing scroll, aligning buttons, fixing UIs view and borders
* Pagination