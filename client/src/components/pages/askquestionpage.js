import React from 'react';
import { useState, useEffect } from 'react';
import { questionErrors} from '../../helpers'
import axios from 'axios'
//axios.defaults.withCredentials = true;

export default function AskQuestionPage({postquestion}) {
    const[title, setTitle] = useState("");
    const[tags, setTags] = useState("");
    const[text, setText] = useState("");
    const[summary, setSummary] = useState("");
    const [existingTags, setExistingTags] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchTags = async () => {
          try {
              const response = await axios.get('http://localhost:8000/tags'); 
              setExistingTags(response.data);
          } catch (error) {
              console.error('Failed to fetch tags:', error);
          }
      };
      fetchTags();
    }, []);

    const QuestionSubmit = async (event) => {
      event.preventDefault();
      document.getElementById("title_error").textContent = "";
      document.getElementById("text_error").textContent = "";
      document.getElementById("tags_error").textContent = "";
      document.getElementById("summary_error").textContent = "";
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
        try {
          await axios.post('http://localhost:8000/questions', {
              title: title,
              text: newText, 
              tags: tags,
              summary: summary
          });
          postquestion(); 
        }catch(error){
          if (error.response && error.response.status === 403) {
            setError(error.response.data.error);
          } 
        }
      }
    };

    return (
        <>
            <div className="new_title">Question Title*</div>
            <div className="title_limit">Limit title to 50 characters or less</div>

            <input type="text" id="title_input" className="title_input" placeholder="Enter your question title" onChange={e => setTitle(e.target.value)}/>
            <div id="title_error" className="error_message"></div>
            <br/>

            <div className="summary">Summary*</div>
            <div className="summary_details">Limit summary to 140 characters or less</div>
            <textarea type="text" id="summary_input" className="summary_input" placeholder="Enter Summary" onChange={e => setSummary(e.target.value)} />
            <div id="summary_error" className="error_message"></div>

            <div className="quest_text">Question Text*</div>
            <div className="text_details">Add details</div>

            <textarea type="text" id="quest_input" className="quest_input" placeholder="Enter your question text" onChange={e => setText(e.target.value)}></textarea>
            <div id="text_error" className="error_message"></div>
            
            <div className="tags_title">Tags*</div>
            <div className="tags_details">Add maximum 5 keywords separated by whitespace. Hyphenated words count as one word. Only add new tags if your reputation is greater than 50. </div>
            <input type="text" id="tags_input" className="tags_input" placeholder="Add keywords" onChange={e => setTags(e.target.value)} />
            <div className="existing_tags">Existing Tags to add: {existingTags.map(tag => `${tag.name}, `)}</div>
            <div id="tags_error" className="error_message">{error}</div>

            <br/>
            <button className="post_quest_button" id="post_quest_button" onClick={QuestionSubmit}>Post Question</button>
            <div className="mandatory">* indicates mandatory fields</div>      
        </>
    );
  }