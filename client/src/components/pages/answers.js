import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getTimeStamp } from '../../helpers';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

export default function Answers({AskQuestion, handleAnswerQuestion}) {
    const { id } = useParams(); 
    const [question, setQuestion] = useState(null);
    const { currentUser } = useAuth();
    const fetchQuestion = async () => {
        const response = await axios.get(`http://localhost:8000/questions/${id}`);
        if (response.status === 200) {
            setQuestion(response.data);
        }
    };
    useEffect(() => {
        fetchQuestion();
    }, [id]);
    const handleVote = async (type) => {
        const endpoint = type === 'up' ? `/upvote/${id}` : `/downvote/${id}`;
        try {
            await axios.get(`http://localhost:8000/questions${endpoint}`);
            fetchQuestion(); 
        } catch (error) {
            if (error.response) {
                alert(error.response.data.error);
            }
        }
    }

    console.log();
    if (!question) {
        return <div></div>;
    }

    const answer_s = question.answers.length === 1 ? 'answer' : 'answers';
    const view_s = question.views === 1 ? 'view' : 'views';
    return (
        <>
            <div id = "ansSec-A">
                <div className ="ans_count" id="ans_count">{question.answers.length}</div> 
                &nbsp;
                <div className ="answer-s-" id="answer-s-">{answer_s}</div>
                <div className ="Ques_title" id="Ques_title">{question.title}</div>
                {currentUser && (<button className  = "button1" id="button1" onClick={AskQuestion}>Ask Question</button>)}
            </div>
            <div id = "ansSec-B">
                <div id = "Adata">
                    <div className ="viewC" id="viewC">{question.views}</div> 
                    &nbsp;
                    <div className ="view-s-" id="view-s-">{view_s}</div>
                    &nbsp;
                    <div className='votebox'>
                        <svg width="36" height="36" className="vote" onClick={() => handleVote('up')}>
                            <path d="M2 26h32L18 10 2 26z" ></path>
                        </svg>
                        <span className='votes'>{question.votes}</span>
                        <svg width="36" height="36" className="vote" onClick={() => handleVote('down')}>
                            <path d="M2 10h32L18 26 2 10z" ></path>
                        </svg>
                    </div>
                </div>
                <div className ="ques_text" id="ques_text" dangerouslySetInnerHTML={{ __html: question.text}}></div>
                <div  id = 'Qans_metadata'>
                    <span id = 'Qans_name' >{question.asked_by.username}</span>
                    <span id = 'Qans_time' > asked {getTimeStamp(question.ask_date_time)}</span>
                </div>
            </div>
            {question.answers.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time)).map(answer => (
                <div key={answer._id}>
                    <div id = 'sectionAns' >
                        <div id = 'answertext' dangerouslySetInnerHTML={{ __html: answer.text}}></div>
                        <div id = 'Ans_metadata'>
                            <div id = 'Ans_name' >{answer.ans_by.username}</div>
                            <span id = 'Ans_time' > answered {getTimeStamp(answer.ans_date_time)}</span>
                        </div>
                    </div>
                </div>
            ))}
            {currentUser && (<button className = "button1" id="button2" key = {question._id} onClick={() => handleAnswerQuestion(question._id)}>Answer Question</button>)}
      </>
  );
}