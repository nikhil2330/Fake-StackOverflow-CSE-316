import React from 'react';
import { useState, useEffect } from 'react';
import { questionErrors} from '../../helpers'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
//axios.defaults.withCredentials = true;

export default function AskQuestionPage({postquestion}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const[title, setTitle] = useState("");
    const[tags, setTags] = useState("");
    const[text, setText] = useState("");
    const[summary, setSummary] = useState("");
    const [existingTags, setExistingTags] = useState([]);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false); 

    const fetchQuestionDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/questions/${id}`);
            const { title, text, tags, summary } = response.data;
            setTitle(title);
            setText(text);
            setTags(tags.map(tag => tag.name).join(' ')); 
            setSummary(summary);
            setIsEditing(true);
        } catch (error) {
            console.error('Failed to fetch question details:', error);
        }
    };

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
      if (id) fetchQuestionDetails();
    }, [id]); 

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
      if(flag !== 1){
        const newText = text.replace(validHyperlink, (match, name, link) => `<a href="${link}" target="_blank">${name}</a>`);
        const data = {
          title,
          text: newText, 
          tags: tags,
          summary
        };
        try {
          if (isEditing) {
            await axios.put(`http://localhost:8000/questions/${id}`, data);
          } else {
            await axios.post('http://localhost:8000/questions', data);
          }
          postquestion(); 
        }catch(error){
          if (error.response && error.response.status === 403) {
            setError(error.response.data.error);
          } 
        }
      }
    };
    const deleteQuestion = async () => {
      try {
          await axios.delete(`http://localhost:8000/questions/${id}`);
          postquestion(); 
      } catch (error) {
          console.error('Error deleting question:', error);
          alert('Failed to delete question');
      }
    };
    function confirm(){
      if (window.confirm("Are you sure want to delete this question? This action cannot be undone.")) {
        deleteQuestion();
      } 
    }
    return (
        <>
            <div className='new_question_title'>{isEditing ? 'Edit Question' : 'New Question'}</div>
            <div className="new_title">Question Title</div>
            <div className="title_limit">Limit title to 50 characters or less</div>

            <input type="text" id="title_input" value={title} className="title_input" placeholder="Enter your question title" onChange={e => setTitle(e.target.value)}/>
            <div id="title_error" className="error_message"></div>
            <br/>

            <div className="summary">Summary</div>
            <div className="summary_details">Limit summary to 140 characters or less</div>
            <textarea type="text" id="summary_input" value={summary} className="summary_input" placeholder="Enter Summary" onChange={e => setSummary(e.target.value)} />
            <div id="summary_error" className="error_message"></div>

            <div className="quest_text">Question Text</div>
            <div className="text_details">Add details</div>

            <textarea type="text" id="quest_input" value={text} className="quest_input" placeholder="Enter your question text" onChange={e => setText(e.target.value)}></textarea>
            <div id="text_error" className="error_message"></div>
            
            <div className="tags_title">Tags</div>
            <div className="tags_details">
                <ul>
                    <li>Add maximum 5 keywords separated by whitespace.</li>
                    <li>Hyphenated words count as one word.</li>
                    <li>(You can only add new tags if your reputation is greater than 50!)</li>
                </ul>
            </div>

            <input type="text" id="tags_input" value={tags} className="tags_input" placeholder="Add keywords" onChange={e => setTags(e.target.value)} />
            <div className="existing_tags">Current existing tags: {existingTags.map(tag => `${tag.name}, `)}</div>
            <div id="tags_error" className="error_message">{error}</div>

            <br/>
            <div className="container">
                <button className="save_quest_button" id="save_quest_button" onClick={QuestionSubmit}>{isEditing ? 'Save Changes' : 'Post Question'}</button>
                {isEditing ? (<button onClick={confirm} className="delete-question-button">Delete Question</button> ) : (<></>) }
                <div className="mandatory">* indicates mandatory fields</div>  
            </div>
    
        </>
    );
  };