import React, { useEffect, useState } from 'react';
import { getTimeStamp } from '../helpers';


function QuestionList({ questions, displayAnswers, currentPage, setCurrentPage, profileId }) {
    const pageSize = 5;
    const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);
    const totalPages = Math.ceil(questions.length / pageSize);
    const startIndex = (localCurrentPage - 1) * pageSize;
    const displayedQuestions = questions.slice(startIndex, startIndex + pageSize);

    useEffect(() => {
        setLocalCurrentPage(1); 
    }, [questions]);

    useEffect(() => {
        setCurrentPage(localCurrentPage); 
    }, [localCurrentPage, setCurrentPage]);

    const handleNext = () => {
        const nextPage = localCurrentPage < totalPages ? localCurrentPage + 1 : 1;
        setLocalCurrentPage(nextPage);
    };

    const handlePrev = () => {
        const prevPage = localCurrentPage > 1 ? localCurrentPage - 1 : totalPages;
        setLocalCurrentPage(prevPage);
    };

    if(questions.length === 0){
        return(<h2 id='no_quest'>No Questions Found</h2>);
    } else {
        const displayedQuestions = questions.slice(startIndex, startIndex + 5);
        const currentPage = Math.floor(startIndex / 5) + 1;
        const totalPages = Math.ceil(questions.length / 5);

        return( 
            <>
                {displayedQuestions.map(question => (    
                    <div key={question._id}>
                        <div id="section">
                            <div id="data">
                                <div id="answers">{question.answers.length} {question.answers.length === 1 ? 'answer' : 'answers'}</div>
                                <div id="views">{question.views} {question.views === 1 ? 'view' : 'views'}</div>
                                <div id="votes">{question.votes} {question.votes === 1 ? 'vote' : 'votes'}</div>
                            </div>
                            <div className="content">
                                <h3 className="title" onClick={() => displayAnswers(question._id, false, profileId)}>{question.title}</h3>
                                <p className="summary_line">{question.summary}</p>
                                <div  className='tag_cont'>
                                    {question.tags.map(tag => (
                                        <div key={`${tag._id}`} id='tag_cont'>{tag.name}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="metadata">
                                <span className='name'>{question.asked_by.username}</span> asked {getTimeStamp(question.ask_date_time)}
                            </div>
                        </div>
                    </div>
                ))}
               <div className="pn-buttons">
                    <button disabled={currentPage === 1} onClick={handlePrev}>Prev</button>

                    <span className="page-info">{currentPage} / {totalPages}</span>
                    <button onClick={handleNext}>Next</button>



                </div>
            </>
        );
    }
}

export default QuestionList;
