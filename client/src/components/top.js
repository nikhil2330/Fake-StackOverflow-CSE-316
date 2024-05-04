import React from 'react';
import { useAuth } from '../contexts/authContext';


export default function Top({Newest, Active, Unanswered, QuestionC, AskQuestion, title}) {
  const { currentUser } = useAuth();
  const questionText = QuestionC === 1 ? 'question' : 'questions';
  return (
    <>
      <div id = "top" >
          <b><h2 id = "head" >{title}</h2></b>
          {currentUser && (<button className  = "button1" id="button1" onClick={AskQuestion}>Ask Question</button>)}
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