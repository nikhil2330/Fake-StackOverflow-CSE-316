import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTimeStamp } from '../../helpers';

export default function Profile({getTagQuestion}) {
    const [user, setUser] = useState(null);
    const [content, setContent] = useState('questions');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [tags, setTags] = useState([]);
    const fetchUserDetails = async () => {
        const { data } = await axios.get('http://localhost:8000/users/details');
        setUser(data);
    };
    const fetchContent = async () => {
        const questions = await axios.get('http://localhost:8000/users/questions');
        setQuestions(questions.data);
        const answers = await axios.get('http://localhost:8000/users/answers');
        setAnswers(answers.data);
        const tags = await axios.get('http://localhost:8000/users/tags');
        setTags(tags.data);
    };
    useEffect(() => {
        fetchUserDetails();
        fetchContent();
        
    }, []);
    return(
        <div className="user-profile">
            <div className="user-details">
                <h1 className='Prof-title'>Profile</h1>
                {user && (
                    <>
                    <div className = 'deet-box'>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <p>Member Since: {getTimeStamp(user.join_date_time)}</p>
                        <p>Reputation: {user.reputation}</p>
                    </div>
                    <div className = 'deet-box'>
                        <p>Questions {user.questions.length}</p>
                        <p>Tags {user.tags.length}</p>
                        <p>Answers {user.answers.length}</p>
                    </div>
                    </>
                )}
            </div>
            <div className="profile-menu">
                <button onClick={() => setContent('questions')}>Questions</button>
                <button onClick={() => setContent('answers')}>Answers</button>
                <button onClick={() => setContent('tags')}>Tags</button>
            </div>
            <div className="profile-box">
                {content === 'questions' && questions.map(question => (
                    <div key={question.id}>
                        <span>{question.title}</span>
                    </div>
                ))}
                {content === 'answers' && answers.map(answer => (
                    <div key={answer.id}>
                        <span>{answer.title}</span>
                    </div>
                ))}
                
                {content === 'tags' && (<div className="tagsbox" id="tagsbox">
                        <div className="tags-container" id="tags-container">
                            {tags.map(tag => (
                                <div className="tag" key={tag._id}>
                                    <div className="tag-name" onClick={() => getTagQuestion(tag._id)} >{tag.name}</div>
                                    <div className="tag-question-count">{tag.questionCount  + " " + ((tag.questionCount  > 1 || tag.questionCount  < 1) ? 'Questions' : 'Question')}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )};
            </div>
        </div>
    );
};

        