import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { answerErrors } from '../../helpers';


export default function AnswerQuestionPage({postAnswer}) {
    const[ans_text, setAnsText] = useState("");
    const[user, setUser] = useState("");
    const { id } = useParams();

    const AnswerSubmit = async (event) => {
        event.preventDefault();
        document.getElementById("ans_text_error").textContent = "";
        document.getElementById("ans_username_error").textContent = "";

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
            postAnswer(id, user, newText);
        }
    };

    return (
        <>
            <div className="answer_username">Username*</div>
            <input type="text" id="user_in" className="user_in" placeholder="Enter your username" onChange={e => setUser(e.target.value)}/>
            <div className="error_message" id="ans_username_error"></div>

            <br/>
            <div className="answer_title">Answer Text*</div>
            <textarea type="text" id="answer_input" className="answer_input" placeholder="Enter your answer" onChange={e => setAnsText(e.target.value)}></textarea>
            <div className="error_message" id="ans_text_error"></div>
            <br/>

            <button className="post_ans_button" id="post_ans_button" onClick={AnswerSubmit}>Post Answer</button>
            <div className="mand">* indicates mandatory fields</div>      
        </>
    );
}