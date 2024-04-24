import React from 'react';
import { useState } from 'react';
import { questionErrors} from '../../helpers'
import axios from 'axios'

export default function AskQuestionPage({postquestion}) {
    const[title, setTitle] = useState("");
    const[tags, setTags] = useState("");
    const[text, setText] = useState("");
    const[username, setUsername] = useState("");

    const QuestionSubmit = async (event) => {
      event.preventDefault();
      document.getElementById("title_error").textContent = "";
      document.getElementById("text_error").textContent = "";
      document.getElementById("tags_error").textContent = "";
      document.getElementById("username_error").textContent = "";
      let flag = 0;
      flag = questionErrors();
      const validHyperlink = /\[([^[\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
      const noLinkText = /\[\s*\]\(.*\)/; 
      const noURL = /\[[^[\]]+\]\(\s*\)/; 
      const nonHttpOrHttps = /\[[^[\]]+\]\(((?!https?:\/\/).*)\)/;
      
      if (noLinkText.test(text) || noURL.test(text) || nonHttpOrHttps.test(text)) {
        document.getElementById("text_error").textContent = "Hyperlinks must be in the format [name](http(s)://link).";
        flag = 1;
      }
      console.log("a");
      if(flag !== 1){
        const newText = text.replace(validHyperlink, (match, name, link) => `<a href="${link}" target="_blank">${name}</a>`);
        await axios.post('http://localhost:8000/models/questions', {
            title: title,
            text: newText, 
            tags: tags,
            asked_by: username
        });
        postquestion(); //response.data
      }
    };

    return (
        <>
            <div className="new_title">Question Title*</div>
            <div className="title_limit">Limit title to 100 characters or less</div>

            <input type="text" id="title_input" className="title_input" placeholder="Enter your question title" onChange={e => setTitle(e.target.value)}/>
            <div id="title_error" className="error_message"></div>
            <br/>
            <div className="quest_text">Question Text*</div>
            <div className="text_details">Add details</div>

            <textarea type="text" id="quest_input" className="quest_input" placeholder="Enter your question text" onChange={e => setText(e.target.value)}></textarea>
            <div id="text_error" className="error_message"></div>
            
            <div className="tags_title">Tags*</div>
            <div className="tags_details">Add maximum 5 keywords separated by whitespace. Hyphenated words count as one word.</div>
            <input type="text" id="tags_input" className="tags_input" placeholder="Add keywords" onChange={e => setTags(e.target.value)} />
            <div id="tags_error" className="error_message"></div>

            <div className="username">Username*</div>
            <div className="username_details">Username cannot be empty</div>
            <input type="text" id="username_input" className="username_input" placeholder="Enter username here" onChange={e => setUsername(e.target.value)} />
            <div id="username_error" className="error_message"></div>

            <br/>
            <button className="post_quest_button" id="post_quest_button" onClick={QuestionSubmit}>Post Question</button>
            <div className="mandatory">* indicates mandatory fields</div>      
        </>
    );
  }