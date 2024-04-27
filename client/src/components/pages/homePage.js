import React from 'react';
import Top from '../top'
import QuestionList from '../questionList';

const HomePage = ({ handleSortNewest, title, handleSortActive, handleSortUnanswered, questions, AskQuestion, displayAnswers, QuestionC}) => {
    return (
        <div className="home-page">
            <Top
                Newest={handleSortNewest}
                Active={handleSortActive}
                QuestionC={QuestionC}
                Unanswered={handleSortUnanswered}
                AskQuestion={AskQuestion}
                title={title}
            />
            <hr></hr>
            <QuestionList questions={questions} displayAnswers={displayAnswers}/>
        </div>
    );
};

export default HomePage;