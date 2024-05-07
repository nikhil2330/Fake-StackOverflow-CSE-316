import React, { useState } from 'react';
import { getTimeStamp } from '../helpers';

function QuestionList ({questions, displayAnswers}){
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const [startIndex, setStartIndex] = useState(0);
    const totalPages = Math.ceil(questions.length / pageSize);


    const handleNext = () => {
        const nextPage = currentPage === totalPages ? 1 : currentPage + 1;
        setCurrentPage(nextPage);
        setStartIndex((nextPage - 1) * pageSize);
    };
    

    const handlePrev = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        setStartIndex((prevPage - 1) * pageSize);
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
                            <h3 id="title" onClick={() => displayAnswers(question._id)}>{question.title}</h3>
                            <div className="metadata">
                                <span className='name'>{question.asked_by.username}</span> asked {getTimeStamp(question.ask_date_time)}
                            </div>
                            <p id="summary_line">{question.summary}</p> {/* Add summary here */}
                            
                            <div id='tag_cont' className='tag_cont'>
                                {question.tags.map(tag => ( 
                                    <div key={`${tag._id}`} id='tagsec'> {/* try just tag-id*/}
                                        {tag.name}
                                    </div>
                                ))}
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
