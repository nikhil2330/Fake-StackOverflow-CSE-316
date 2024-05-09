import React, {useState } from 'react';
import { useParams } from 'react-router-dom';
import { answerErrors } from '../../helpers';
import axios from 'axios';


export default function AnswerQuestionPage({fetchQuestionDetails}) {
    const[ans_text, setAnsText] = useState("");
    const { id } = useParams();

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
                await axios.post('http://localhost:8000/answers', {
                  text: newText,
                  questionID: id
                });
                fetchQuestionDetails(id);
        }
    };
    
    return (
        <>
            <br/>
            <div className='new_ans_title'>New Answer</div>
            <div className="answer_title">Answer Text</div>
            <textarea type="text" id="answer_input" className="answer_input" placeholder="Enter your answer" onChange={e => setAnsText(e.target.value)}></textarea>
            <div className="error_message" id="ans_text_error"></div>
            <br/>
            <div className="container">
                <button className="post_quest_button" id="post_quest_button" onClick={AnswerSubmit}>Post Question</button>
                <div className="mandatory">* indicates mandatory fields</div>  
            </div>   
        </>
    );
}