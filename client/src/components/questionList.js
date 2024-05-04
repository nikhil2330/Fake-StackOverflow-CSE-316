import React from 'react';
import { getTimeStamp } from '../helpers';

function QuestionList ({questions, displayAnswers}){
    if(questions.length === 0){
        return(<h2 id = 'no_quest'>No Questions Found</h2>);
    }else{
        return( 
            <>
                {questions.map(question => (    
                    <div key = {question._id}>
                        <div id ="section">
                            <div id="data">
                                <div id = "answers">{question.answers.length} {question.answers.length === 1 ? 'answer' : 'answers'}</div>
                                <div id = "views">{question.views} {question.views === 1 ? 'view' : 'views'}</div>
                            </div>
                            <h3 id ="title" onClick={() => displayAnswers(question._id)}>{question.title}</h3>
                            <div className="metadata">
                            <span className = 'name'>{question.asked_by}</span> asked {getTimeStamp(question.ask_date_time)}
                            </div>
                            <div id = 'tag_cont' className = 'tag_cont'>
                                {question.tags.map(tag => ( 
                                <div key={`${question._id}-${tag._id}`} id='tagsec'> {/* try just tag-id*/}
                                    {tag.name}
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </>
        );
    }
}
export default QuestionList;