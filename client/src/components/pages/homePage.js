import React, { useState } from 'react';
import Top from '../top'
import QuestionList from '../questionList';

const HomePage = ({ handleSortNewest, title, handleSortActive, handleSortUnanswered, questions, AskQuestion, displayAnswers, QuestionC, filter, profileId}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const resetPage = () => {
        setCurrentPage(1); 
    };

    return (
        <div className="home-page">
            <Top
                Newest={() => { handleSortNewest(); resetPage(); }}
                Active={() => { handleSortActive(); resetPage(); }}
                QuestionC={QuestionC}
                Unanswered={() => { handleSortUnanswered(); resetPage(); }}
                AskQuestion={AskQuestion}
                title={title}
                filter={filter}
            />
            <hr></hr>
            <QuestionList 
                questions={questions} 
                displayAnswers={displayAnswers} 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage} 
                profileId={profileId}
            />
        </div>
    );
};

export default HomePage;
