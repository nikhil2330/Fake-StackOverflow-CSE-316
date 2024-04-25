import Header from './common/header.js';
import Menu from './common/menu.js'; 
import Answers from './pages/answers.js';
import AskQuestionPage from './pages/askquestionpage';
import AnswerQuestionPage from './pages/AnswerQuestionPage';
import TagsPage from './pages/tagsPage';
import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';    
import Welcome from './pages/welcomePage';
import { Routes, Route, useNavigate, useParams} from 'react-router-dom';
import HomePage from './pages/homePage.js';


export default function FakeStackOverflow() {
  const[questions, setQuestions] = useState([]);
  const[searchInput, setSearchInput] = useState("");
  const [curQuestion, setCurQuestion] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    // questions from the server
    fetchQuestions();
  }, []);
  const fetchQuestions = () => {
    axios.get('http://localhost:8000/models/questions')
    .then(response => {
        setQuestions(response.data.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)));
    })
    .catch(error => console.error('Error fetching questions:', error));

  };

  const incrementViews = async (questionId) => {
    await axios.post(`http://localhost:8000/models/questions/increment-view/${questionId}`);
    fetchQuestionDetails(questionId);
  }
  


  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const postquestion = () => {
      axios.get('http://localhost:8000/models/questions')
      .then(response => {
      const sorted = response.data.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
      setQuestions(sorted);
    });
    navigate('/');
  };

  const postanswer = async (qid, user, anstext) => {
    await axios.post('http://localhost:8000/models/answers', {
      text: anstext,
      ans_by: user,
      questionID: qid
    });
    //navigate(`/question/${qid}`);
    fetchQuestionDetails(qid);
  }

  const Search = () => {
    axios.get('http://localhost:8000/models/questions', {
      params: {
        searchText: searchInput
      }
    }).then(response => {
      setQuestions(response.data.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)));
      navigate('/');
    });
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      Search();
    }
  };


  function handleSortNewest() {
    navigate('/');
    axios.get('http://localhost:8000/models/questions')
    .then(response => {
      const sorted = response.data.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
      setQuestions(sorted);
    });
    
  };

  function handleSortActive(){ 
    navigate('/');
    axios.get('http://localhost:8000/models/questions')
    .then(response => {
      let answered = response.data.filter(q => q.answers.length > 0);
      let unanswered = response.data.filter(q => q.answers.length === 0);
      answered = answered.sort((a, b) => { 
          return new Date(b.answers[b.answers.length - 1].ans_date_time)
           - new Date(a.answers[a.answers.length - 1].ans_date_time);
      });
      unanswered = unanswered.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
      setQuestions([...answered, ...unanswered]);
    });
   
  };  

  function handleSortUnanswered (){
    navigate('/');
    axios.get('http://localhost:8000/models/questions')
    .then(response => {
      const sortedQuestions = response.data.filter(q => q.answers.length === 0).sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
      setQuestions(sortedQuestions);
    });
  };

  const handleTagClick = (tid) => {
    axios.get(`http://localhost:8000/models/questions/tag/${tid}`)
    .then(response => {
        setQuestions(response.data);
        navigate('/');
    })
    .catch(error => {
        console.error('Error fetching questions by tag:', error);
    });
  };


  const fetchQuestionDetails = async (qid) => {
    try {
        const response = await axios.get(`http://localhost:8000/models/questions/${qid}`);
        if (response.status === 200) {
          setCurQuestion(response.data);
          navigate(`/question/${qid}`);
          //navigate(`/questions/${qid}`);

        }
    } catch (error) {
        console.error('Error fetching question details:', error);
    }
};

  const handleAnswerClick = (qid) => {
    incrementViews(qid);
    

    
  };
  const handleMenu = async (e) => {
    if( e.target.id === 'firstpage'){
      navigate('/');
      axios.get('http://localhost:8000/models/questions')
      .then(response => {
        const sorted = response.data.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
        setQuestions(sorted);
      });
    } else{
      navigate('/tags');

    }
    
  };

  const handleAnswerQuestion = (qid) => {
    navigate(`/answer/${qid}`);
  };

  return (
    <div className="fake-stack-overflow">
      {/* <Welcome/> */}

      <Header handleChange = {handleSearchChange}  handleKeyDown = {handleKeyDown}/> 
      <div id="main">
        <Menu handleMenu={handleMenu}  />
          <main id = "page" >
            <Routes>
              <Route path="/" element={(<HomePage handleSortNewest={handleSortNewest}
                handleSortActive={handleSortActive}
                handleSortUnanswered={handleSortUnanswered}
                QuestionC={questions.length}    
                AskQuestion={() => navigate('/ask')} 
                title={'All Questions'}
                questions={questions} 
                displayAnswers={handleAnswerClick}
              />)} />
              <Route path="/ask" element={<AskQuestionPage postquestion={postquestion} />} />
              <Route path='/question/:id' element={<Answers AskQuestion={() => navigate('/ask')} handleAnswerQuestion={handleAnswerQuestion} />} />
              <Route path="/answer/:id" element={<AnswerQuestionPage postAnswer={postanswer}/>} />
              <Route path="/tags" element={<TagsPage getTagQuestion={handleTagClick} AskQuestion={() => navigate('/ask')}  />} />
              {/* Add other routes as needed */}
            </Routes>
          </main>
        </div>
    </div>
  );
}