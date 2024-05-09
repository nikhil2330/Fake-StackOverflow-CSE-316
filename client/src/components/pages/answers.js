import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getTimeStamp } from '../../helpers';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

export default function Answers({AskQuestion, handleAnswerQuestion, AddComment}) {
    const { id } = useParams(); 
    const [question, setQuestion] = useState(null);
    const { currentUser } = useAuth();
    const [upvoted, setUpvoted] = useState(false);
    const [downvoted, setDownvoted] = useState(false);
    const [a_upvoted, setA_upvoted] = useState(false);
    const [a_downvoted, setA_downvoted] = useState(false);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const highlight = location.state?.highlight || false;
    console.log(highlight);

    const fetchQuestion = async () => {
        const response = await axios.get(`http://localhost:8000/questions/${id}`);
        if (highlight) {
            console.log("abc");
            const userAnswers = response.data.answers.filter(a => a.ans_by._id === currentUser._id);
            console.log(userAnswers);
            const otherAnswers = response.data.answers.filter(a => a.ans_by._id !== currentUser._id);
            userAnswers.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
            otherAnswers.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
            setQuestion({
                ...response.data,
                answers: [...userAnswers, ...otherAnswers]
            });
        }else{
            console.log("qwz");
            setQuestion({...response.data, answers: response.data.answers.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time))});
        }
        
    };
    const fetchVotes = async () => {
        const response = await axios.get(`http://localhost:8000/users/${currentUser._id}/votes`);
        setUpvoted(response.data.upVotes.includes(id));
        setDownvoted(response.data.downVotes.includes(id));
        setA_upvoted(response.data.A_upVotes.includes(id));
        setA_downvoted(response.data.A_downVotes.includes(id));
    }
    useEffect(() => {
        fetchQuestion();
        if(currentUser){
            fetchVotes();
        }
    }, [id, currentUser, highlight]);
    const handleVote = async (id, type, isQuestion) => {
        const endpoint = isQuestion ? (type === 'up' ? `questions/upvote/${id}`:`questions/downvote/${id}`) : (type === 'up' ? `answers/upvote/${id}`:`answers/downvote/${id}`);
        try {
            await axios.post(`http://localhost:8000/${endpoint}`);
            fetchQuestion();
            if(currentUser){
                fetchVotes();
            }
        } catch (error) {
            if (error.response) {
                console.log("abc");
                if(currentUser){
                    alert(error.response.data.error);
                }
            }
        }
    }
    if (!question) {    
        return <div></div>;
    }
    const voted = (isActive) => isActive ? "voted" : "vote";
    const answer_s = question.answers.length === 1 ? 'answer' : 'answers';
    const view_s = question.views === 1 ? 'view' : 'views';
    const votes_s = question.votes === 1 ? 'vote' : 'votes';

    return (
        <>
            <div id = "ansSec-A">
                <div className ="ans_count" id="ans_count">{question.answers.length}</div> 
                &nbsp;
                <div className ="answer-s-" id="answer-s-">{answer_s}</div>
                <div className ="Ques_title" id="Ques_title">{question.title}</div>
                {currentUser && (<button className  = "button1" id="button1" onClick={AskQuestion}>Ask Question</button>)}
                {currentUser && currentUser._id === question.asked_by._id && (<button onClick={() => navigate(`/home/ask/${question._id}`)}>Edit Question</button>)}
            </div>
            <div id = "ansSec-B">
                <div id = "Adata">
                    <div className ="viewC" id="viewC">{question.views}</div> 
                    &nbsp;
                    <div className ="view-s-" id="view-s-">{view_s}</div>
                    &nbsp;
                    <div className='votebox'>
                        {currentUser && <svg width="36" height="36" className= {voted(upvoted)} onClick={() => handleVote(id,'up', true)}>
                            <path d="M2 26h32L18 10 2 26z" ></path>
                        </svg>}
                        <span className='votesC'>{question.votes} {votes_s}</span>
                        {currentUser && <svg width="36" height="36" className= {voted(downvoted)} onClick={() => handleVote(id,'down', true)}>
                            <path d="M2 10h32L18 26 2 10z" ></path>
                        </svg>}
                    </div>
                </div>
                <div className ="ques_text" id="ques_text" dangerouslySetInnerHTML={{ __html: question.text}}></div>
                <div  id = 'Qans_metadata'>
                    <span id = 'Qans_name' >{question.asked_by.username}</span>
                    <span id = 'Qans_time' > asked {getTimeStamp(question.ask_date_time)}</span>
                </div>
            </div>
            {question.answers.map(answer => (
                <div key={answer._id}>
                    <div id = 'sectionAns' >
                        <div className='votebox'>
                            {currentUser && <svg width="36" height="36" className= {voted(a_upvoted)} onClick={() => handleVote(answer._id,'up', false)}>
                                <path d="M2 26h32L18 10 2 26z" ></path>
                            </svg>}
                            <span className='votesC'>{answer.votes} {answer.votes === 1 ? 'vote' : 'votes'}</span>
                            {currentUser && <svg width="36" height="36" className= {voted(a_downvoted)} onClick={() => handleVote(answer._id,'down', false)}>
                                <path d="M2 10h32L18 26 2 10z" ></path>
                            </svg>}
                        </div>
                        <div id = 'answertext' dangerouslySetInnerHTML={{ __html: answer.text}}></div>
                        <div id = 'Ans_metadata'>
                            <div id = 'Ans_name' >{answer.ans_by.username}</div>
                            <span id = 'Ans_time' > answered {getTimeStamp(answer.ans_date_time)}</span>
                        </div>
                    </div>
                    {currentUser && currentUser._id === answer.ans_by._id && (<button onClick={() => navigate(`/home/answer/edit/${answer._id}`, { state: { questionId: id } })}>Edit Answer</button>)}
                </div>

            ))}
            {currentUser && (<button className = "button1" id="button2" key = {question._id} onClick={() => navigate(`/home/answer/new`, { state: { questionId: id } })}>Answer Question</button>)}

            <div id = "ans-comments">
                {currentUser && (<button className  = "comments-button" id="comments-button" onClick={AddComment}>Add Comment</button>)}
                {/* <div className='comm-views' id="comm-views">{comment_views}</div> */}
                &nbsp;
                <div className ="comment_text" id="comment_text" dangerouslySetInnerHTML={{ __html: comments.text}}></div>

            </div>
      </>
  );
}