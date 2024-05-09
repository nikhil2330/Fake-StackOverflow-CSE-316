import React, {useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { answerErrors } from '../../helpers';

import axios from 'axios';


export default function AnswerQuestionPage({fetchQuestionDetails}) {
    const[ans_text, setAnsText] = useState("");
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false); 
    const location = useLocation();
    const { questionId } = location.state;
    useEffect(() => {
        if (id) {
            setIsEditing(true);
            const fetchAnswer = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/answers/${id}`);
                    setAnsText(response.data.text);
                } catch (error) {
                    console.error('Failed to fetch answer:', error);
                }
            };
            fetchAnswer();
        }
    }, [id]);

    const AnswerSubmit = async (event) => {
        event.preventDefault();
        document.getElementById("ans_text_error").textContent = "";
        let flag = 0;
        flag = answerErrors();
        const validHyperlink = /\[([^[\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
        const noLinkText = /\[\s*\]\(.*\)/; 
        const noURL = /\[[^[\]]+\]\(\s*\)/; 
        const nonHttpOrHttps = /\[[^[\]]+\]\(((?!https?:\/\/).*)\)/;
        
      
        if (noLinkText.test(ans_text) || noURL.test(ans_text) || nonHttpOrHttps.test(ans_text)) {
            document.getElementById("ans_text_error").textContent = "Hyperlinks must be in the format [name](http(s)://link).";
            flag = 1;
        }

        if(flag !== 1) {
            const newText = ans_text.replace(validHyperlink, (match, name, link) => `<a href="${link}" target="_blank">${name}</a>`);
            const payload = { text: newText, questionID: questionId};
            if (isEditing) {
                await axios.put(`http://localhost:8000/answers/${id}`, payload);
            } else {
                await axios.post('http://localhost:8000/answers', payload);
            }
            fetchQuestionDetails(questionId, false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this answer? This cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:8000/answers/${id}`);
                fetchQuestionDetails(questionId, false);
            } catch (error) {
                console.error('Failed to delete answer:', error);
            }
        }
    };

    return (
        <>
            <br/>
            <div className='new_ans_title'>{isEditing ? 'Edit Answer' : 'New Answer'}</div>
            <div className="answer_title">Answer Text</div>
            <textarea type="text" id="answer_input"  value={ans_text} className="answer_input" placeholder="Enter your answer" onChange={e => setAnsText(e.target.value)}></textarea>
            <div className="error_message" id="ans_text_error"></div>
            <br/>
            <div className="container">
                <button className="post_quest_button" id="post_quest_button" onClick={AnswerSubmit}>{isEditing ? 'Save Changes' : 'Post Answer'}</button>
                {isEditing && (<button type="button" onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>Delete Answer</button>
            )}
                <div className="mandatory">* indicates mandatory fields</div>  
            </div>   
        </>
    );
}