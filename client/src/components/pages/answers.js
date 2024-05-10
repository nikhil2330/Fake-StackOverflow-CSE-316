import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getTimeStamp } from '../../helpers';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import Comment from '../comment';

export default function Answers({answers, AskQuestion, handleAnswerQuestion, AddComment}) {
    const { id } = useParams(); 
    const [question, setQuestion] = useState(null);
    const { currentUser } = useAuth();
    const [upvoted, setUpvoted] = useState(false);
    const [downvoted, setDownvoted] = useState(false);
    const [a_upvoted, setA_upvoted] = useState(false);
    const [a_downvoted, setA_downvoted] = useState(false);
    const [comments, setComments] = useState([]);
    const [A_comments, setA_Comments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [commentError, setCommentError] = useState('');

    const [currentCommentPage, setCurrentCommentPage] = useState(0);
    const commentsPerPage = 3;  // This sets the limit to 3 comments per page


    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Number of answers per page
    const [startIndex, setStartIndex] = useState(0);

    const totalPages = question ? Math.max(1, Math.ceil(question.answers.length / pageSize)) : 1;
    const displayedAnswers = question ? question.answers.slice(startIndex, startIndex + pageSize) : [];
    const maxCommentPage = Math.floor((comments.length - 1) / commentsPerPage);
    
    const displayedComments = comments.slice(
        currentCommentPage * commentsPerPage,
        (currentCommentPage + 1) * commentsPerPage
    );


    const navigate = useNavigate();
    const location = useLocation();
    const highlight = location.state?.highlight || false;
    console.log(highlight);
    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
        if (event.target.value.length > 140) {
            setCommentError('Comment must not exceed 140 characters.');
        } else {
            setCommentError('');
        }
    };
    const submitComment = async () => {
        if (commentText.length > 140) {
            setCommentError('Comment must not exceed 140 characters.');
            return;
        }
        if (currentUser && currentUser.reputation < 50) {
            setCommentError('You require a minimum reputation of 50 to add comments.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/comments', {
                text: commentText,
                targetId: id, 
                type: 'question' 
            });
            console.log(response)

            setComments([...comments, response.data]);
            fetchComments();
            setCommentText('');
            setCommentError('');
        } catch (error) {
            console.error('Error adding comment:', error);
            setCommentError('Failed to post comment.');
        }
    };
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
        console.log(id);
       
        console.log(comments);

    };
    const fetchComments = async () => {
        const commentResponse = await axios.get(`http://localhost:8000/comments?targetId=${id}&type=question`);
        setComments(commentResponse.data);

    }
    const fetchVotes = async () => {
        const response = await axios.get(`http://localhost:8000/users/${currentUser._id}/votes`);
        setUpvoted(response.data.upVotes.includes(id));
        setDownvoted(response.data.downVotes.includes(id));
        setA_upvoted(response.data.A_upVotes.includes(id));
        setA_downvoted(response.data.A_downVotes.includes(id));
    }


    const handleNext = () => {
        const nextPage = currentPage === totalPages ? 1 : currentPage + 1;
        setCurrentPage(nextPage);
        setStartIndex((nextPage - 1) * pageSize);
    };
    
    
    const handlePrev = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            setStartIndex((prevPage - 1) * pageSize);
        }
    };

    const handleNextCommentPage = () => {
        setCurrentCommentPage(prevPage => (prevPage === maxCommentPage ? 0 : prevPage + 1));
    };
    
    const handlePrevCommentPage = () => {
        setCurrentCommentPage(prevPage => (prevPage > 0 ? prevPage - 1 : 0));
    };
    
    
    
    
    

    useEffect(() => {
        fetchQuestion();
        fetchComments();
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
    const commentUpvote = async (commentId) => {
        try {
            await axios.post(`http://localhost:8000/comments/upvote/${commentId}`);
            // Refresh comments to show new vote count
            fetchComments();
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
    comments.map(comment =>{console.log(comment._id)});
    

    return (
        <>
            
            <div id = "ansSec-A">
                <div className ="ans_count" id="ans_count">{question.answers.length}</div> 
                &nbsp;
                <div className ="answer-s-" id="answer-s-">{answer_s}</div>
                <div className ="Ques_title" id="Ques_title">{question.title}</div>
                <div className="button-container">
                    {currentUser && (
                        <button className="button1" id="button1" onClick={AskQuestion}>Ask Question</button>
                    )}
                    {currentUser && currentUser._id === question.asked_by._id && (
                        <button className="edit-q-button" onClick={() => navigate(`/home/ask/${question._id}`)}>Edit Question</button>
                    )}
                </div>


            </div>
            <div  id="ans-page-tags" className='tag_cont'>
                {question.tags.map(tag => (
                    <div key={`${tag.id}`} id='tag_cont'>{tag.name}</div>
                ))}
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

                <div className="comments-section">
                    <h3 style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                    </h3>

                    {currentUser && (
                        <div className="comment-input">
                            <textarea value={commentText} onChange={handleCommentChange} />
                            {commentError && <p className="error">{commentError}</p>}
                            <button onClick={submitComment}>Comment</button>
                        </div>
                    )}

                    {displayedComments.map(comment => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            canUpvote={currentUser}
                            onUpvote={() => commentUpvote(comment._id)}
                        />
                    ))}

                    <div className="comment-pn-buttons">
                        <button onClick={handlePrevCommentPage} disabled={currentCommentPage === 0}>Prev</button>
                        <span className="cm-page-info">{currentCommentPage + 1} / {maxCommentPage + 1}</span>
                        <button onClick={handleNextCommentPage}>Next</button>
                    </div>



                </div>


                
                
            </div>

            {displayedAnswers.map(answer => (
                <div key={answer._id}>
                    <div id='sectionAns'>
                        <div className='votebox'>
                            {currentUser && <svg width="36" height="36" className={voted(a_upvoted)} onClick={() => handleVote(answer._id, 'up', false)}>
                                <path d="M2 26h32L18 10 2 26z"></path>
                            </svg>}
                            <span className='votesC'>{answer.votes} {answer.votes === 1 ? 'vote' : 'votes'}</span>
                            {currentUser && <svg width="36" height="36" className={voted(a_downvoted)} onClick={() => handleVote(answer._id, 'down', false)}>
                                <path d="M2 10h32L18 26 2 10z"></path>
                            </svg>}
                        </div>
                        <div id='answertext' dangerouslySetInnerHTML={{ __html: answer.text }}></div>
                        <div id='Ans_metadata'>
                            <div id='Ans_name'>{answer.ans_by.username}</div>
                            <span id='Ans_time'> answered {getTimeStamp(answer.ans_date_time)}</span>
                        </div>
                        {currentUser && currentUser._id === answer.ans_by._id && (<button className='edit-button' onClick={() => navigate(`/home/answer/edit/${answer._id}`, { state: { questionId: id } })}>Edit Answer</button>)}

                    </div>
                </div>
            ))}

            {currentUser && (<button className = "button1" id="button2" key = {question._id} onClick={() => navigate(`/home/answer/new`, { state: { questionId: id } })}>Answer Question</button>)}

            <div className="pn-buttons">
                <button disabled={currentPage === 1} onClick={handlePrev}>Prev</button>
                <span className="page-info">{currentPage} / {totalPages}</span>
                <button onClick={handleNext}>Next</button>
            </div>

      </>
  );
}