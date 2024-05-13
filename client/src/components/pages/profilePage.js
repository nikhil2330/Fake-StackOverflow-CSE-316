import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTimeStamp } from '../../helpers';
import { useNavigate } from 'react-router-dom';
import { newest } from '../../helpers';
import { useAuth } from '../../contexts/authContext'; 
import Admin from '../admin';
import { useParams } from 'react-router-dom';

export default function Profile({getTagQuestion, displayAnswers}) {
    const [user, setUser] = useState(null);
    const { userId } = useParams();
    const [content, setContent] = useState('questions');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [tags, setTags] = useState([]);
    const [newTid, setNewTid] = useState(null);
    const [newTag, setNewTag] = useState('');
    const [error, setError] = useState('');
    const [answerCount, setAnswerCount] = useState(0);
    const navigate  = useNavigate();
    const { currentUser, isAdmin } = useAuth();
    const fetchUserDetails = async () => {
        const { data } = await axios.get(`http://localhost:8000/users/details/${userId}`);
        setUser(data);
        const response = await axios.get(`http://localhost:8000/answers/count/${userId}`);
        setAnswerCount(response.data.count)
    };

    const fetchContent = async () => {
        const questions = await axios.get(`http://localhost:8000/users/questions/${userId}`);
        setQuestions(newest(questions.data));
        const answers = await axios.get(`http://localhost:8000/users/answers/${userId}`);
        console.log(userId);
        setAnswers(newest(answers.data));
        const tags = await axios.get(`http://localhost:8000/users/tags/${userId}`);
        setTags(tags.data);
    };
    console.log(userId);

    
    useEffect(() => {
            fetchUserDetails();
            fetchContent();
    }, [userId]);
    
    const deleteTag = async (tagId) => {
        
        try {
            const response = await axios.delete(`http://localhost:8000/tags/${tagId}`)
            setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
            setError('');
        } catch (error) {
            setError(error.response.data.message || 'Failed to delete tag');
        }
        fetchContent();
        fetchUserDetails();
    };
    const handleEdit = (tag) => {
        setNewTid(tag.id);  
        setNewTag(tag.name);
    };

    const handleEditChange = (e) => {
        setNewTag(e.target.value);
    };
    const cancelEdit = () => {
        setNewTid(null);
        setNewTag('');
    };
    const submitTagEdit = async () => {
        try {
            await axios.put(`http://localhost:8000/tags/${newTid}`, { name: newTag });
            const updatedTags = tags.map(tag => {
                if (tag.id === newTid) {
                    return { ...tag, name: newTag };
                }
                return tag;
            });
            setTags(updatedTags);
            setNewTid(null);
            setNewTag('');
            setError('');
            fetchUserDetails();
            fetchContent();
        } catch (error) {
            setError(error.response.data.message || 'Failed to update tag');

        }
    };
    return(
        <div className="user-profile">
            <div className="user-details">
                <h1 className='Prof-title'>Profile</h1>
                {user && (
                    <div className="deet-container">
                        <div className='deet-box'>
                            <p><span class="italic">Username: {user.username}</span></p>
                            <p><span class="italic">Email: {user.email}</span></p>
                            <p><span class="italic">Member Since: {getTimeStamp(user.join_date_time)}</span></p>
                            <p><span class="italic">Reputation: {user.reputation}</span></p>
                        </div>
                        <div className='deet-box-qta'>
                            <p><span class="italic">Questions: {user.questions.length}</span></p>
                            <p><span class="italic">Tags: {user.tags.length}</span></p>
                            <p><span class="italic">Answers: {answerCount}</span></p>
                        </div>
                    </div>
                )}
            </div>
            {isAdmin && <Admin />}
            {error && <div className="error">{error}</div>}
            <div className="profile-menu">
                <button 
                    className={`button ${content === 'questions' ? 'active' : ''}`} 
                    onClick={() => setContent('questions')}
                >
                    Questions
                </button>
                <button 
                    className={`button ${content === 'answers' ? 'active' : ''}`} 
                    onClick={() => setContent('answers')}
                >
                    Answers
                </button>
                <button 
                    className={`button ${content === 'tags' ? 'active' : ''}`} 
                    onClick={() => setContent('tags')}
                >
                    Tags
                </button>
            </div>

            <div className="profile-box">
                {questions.length === 0 && content === 'questions' ? (<div className='no_content no_quest'>No Questions</div>) : (
                    content === 'questions' && questions.map(question => (
                        <div className = "question_card" key={question.id}>
                            <span className = "title" onClick={() => displayAnswers(question.id, false, userId)}>{question.title}</span>
                            <button onClick={() => navigate(`/home/ask/${question.id}`)} className='edit'><img src="../../edit.png"  width="10" height="10" alt="Edit" className="edit_icon" />  Edit</button>
                        </div>
                    )))
                }
                {answers.length === 0 && content === 'answers' ? (<div className='no_content no_ans'>No Answers</div>) : (
                    content === 'answers' && answers.map(answer => (
                    <div className = "answer_card" key={answer.id}>
                        <span className = "title" onClick={() => displayAnswers(answer.id, true, userId)}>{answer.title}</span>
                    </div>
                )))
                }
                {
                    content === 'tags' && tags.length === 0 ? (
                        <div className='no_content no_tags'>No Tags</div>
                    ) : (
                        content === 'tags' && (
                        <div className="tagsbox" id="tagsbox">
                            <div className="tags-container" id="tags-container">
                            {tags.map((tag, index) => (
                               
                                <div className="tag" key={tag.id || index}>
                                    {newTid === tag.id ? (
                                        <>
                                            <input value={newTag} onChange={handleEditChange} />
                                            <button onClick={submitTagEdit}>Save</button>
                                            <button onClick={cancelEdit}>Cancel</button>
                                        </>
                                    ) : (
                                        <>

                                            <div className="tag-name" onClick={() => getTagQuestion(tag.id)}>{tag.name}</div>
                                            <div className="tag-question-count">
                                                {tag.questionCount} {tag.questionCount === 1 ? 'Question' : 'Questions'}
                                            </div>
                                            {tag.questionCount === 1 && (
                                                    <>
                                                        <button onClick={() => handleEdit(tag)}>Edit</button>
                                                        <button onClick={() => deleteTag(tag.id)}>Delete</button>
                                                    </>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                            </div>
                        </div>
                        )
                    )}
            </div>
        </div>
    );
}

        