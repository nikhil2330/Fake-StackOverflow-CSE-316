import React from 'react';


export default function Top({Newest, Active, Unanswered, QuestionC, AskQuestion, title}) {
  const questionText = QuestionC === 1 ? 'question' : 'questions';
  return (
    <>
      <div id = "top" >
          <b><h2 id = "head" >{title}</h2></b>
          <button id = "button1" className = "button1" onClick={AskQuestion}>Ask Question</button>
      </div>
      <div className = "mid" id = "mid">
          <div id ="question_count">{QuestionC} {questionText}</div>
          <div id ="button_cont">
              <button id = 'newest' onClick={Newest}>Newest</button>
              <button id = 'active' onClick={Active}>Active</button>
              <button id = 'unanswered' onClick={Unanswered}>Unanswered</button>
          </div>
      </div>
    </>
  );
}