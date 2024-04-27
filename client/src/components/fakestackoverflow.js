
  import Answers from './pages/answers.js';
  import AskQuestionPage from './pages/askquestionpage';
  import AnswerQuestionPage from './pages/AnswerQuestionPage';
  import TagsPage from './pages/tagsPage';
  import {useState} from 'react';
  import {useEffect} from 'react';
  import axios from 'axios';    
  import WelcomePage from './pages/welcomePage.js';
  import { Routes, Route, useNavigate} from 'react-router-dom';
  import HomePage from './pages/homePage.js';
  import Main from './main.js';
  import Signup from './signup.js';
  import Login from './login.js';


  export default function FakeStackOverflow() {
    const[questions, setQuestions] = useState([]);
    const[searchInput, setSearchInput] = useState("");
    const[title, setTitle] = useState("All Questions");
    let navigate = useNavigate();

    useEffect(() => {
      // questions from the server
      fetchQuestions();
    }, []);  
    const fetchQuestions = () => {
      axios.get('http://localhost:8000/questions')
      .then(response => {
          setQuestions(response.data.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)));
      })
      .catch(error => console.error('Error fetching questions:', error));

    };

    const incrementViews = async (questionId) => {
      await axios.post(`http://localhost:8000/questions/increment-view/${questionId}`);
      fetchQuestionDetails(questionId);
    }
    const registerUser = () => {
      navigate('/login');

    }
    const loginUser = () => {
      navigate('/home');

    }
    


    const handleSearchChange = (e) => {
      setSearchInput(e.target.value);
    };

    const postquestion = () => {
        axios.get('http://localhost:8000/questions')
        .then(response => {
        const sorted = response.data.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
        setQuestions(sorted);
      });
      navigate('/home');
    };

    const postanswer = async (qid, user, anstext) => {
      await axios.post('http://localhost:8000/answers', {
        text: anstext,
        ans_by: user,
        questionID: qid
      });
      //navigate(`/question/${qid}`);
      fetchQuestionDetails(qid);
    }

    const Search = () => {
      axios.get('http://localhost:8000/questions', {
        params: {
          searchText: searchInput
        }
      }).then(response => {
        setTitle("Search Results");
        console.log(title);
        setQuestions(response.data.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)));
        navigate('/home');
      });
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        Search();
      }
    };


    function handleSortNewest() {
      navigate('/home');
      setTitle("All Questions");
      axios.get('http://localhost:8000/questions')
      .then(response => {
        const sorted = response.data.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
        setQuestions(sorted);
      });
      
    };

    function handleSortActive(){ 
      navigate('/home');
      setTitle("All Questions");
      axios.get('http://localhost:8000/questions')
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
      navigate('/home');
      setTitle("All Questions");
      axios.get('http://localhost:8000/questions')
      .then(response => {
        const sortedQuestions = response.data.filter(q => q.answers.length === 0).sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
        setQuestions(sortedQuestions);
      });
    };

    const handleTagClick = (tid) => {
      axios.get(`http://localhost:8000/questions/tag/${tid}`)
      .then(response => {
          setQuestions(response.data);
          navigate('/home');
          setTitle("All Questions");
      })
      .catch(error => {
          console.error('Error fetching questions by tag:', error);
      });
    };


    const fetchQuestionDetails = async (qid) => {
      try {
          const response = await axios.get(`http://localhost:8000/questions/${qid}`);
          if (response.status === 200) {
            navigate(`home/question/${qid}`);
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
        navigate('/home');
        setTitle("All Questions");
        axios.get('http://localhost:8000/questions')
        .then(response => {
          const sorted = response.data.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
          setQuestions(sorted);
        });
        } else{
          navigate('home/tags');
      }
    };

    const handleAnswerQuestion = (qid) => {
      navigate(`home/answer/${qid}`);
    };


  const handleContinueAsGuest = () => {
    navigate('/home');
  };
  const showLogin = () => {
    navigate('/login');
  };
  
  const showSignup = () => {
    navigate('/signup');
  };

  const handleLogout = async () => {
    try {
        await axios.get('http://localhost:8000/users/logout');
        navigate('/login');
    } catch (error) {
        console.error('Logout failed', error);
    }
  };
    return (
      <Routes>
        <Route path="/" element={<WelcomePage showSignup ={showSignup} showLogin = {showLogin} handleContinueAsGuest = {handleContinueAsGuest} />} />
        <Route path="/login" element={<Login onContinueAsGuest={handleContinueAsGuest} onSignUp ={showSignup} loginUser={loginUser}/>} />
        <Route path="/signup" element={<Signup onContinueAsGuest={handleContinueAsGuest} onLogin = {showLogin} registerUser={registerUser}/>} />
        <Route path="/home" element={<Main handleSearchChange={handleSearchChange} handleKeyDown={handleKeyDown} handleMenu={handleMenu} handleLogout={handleLogout}/>}>
          <Route index element={<HomePage
            handleSortNewest={handleSortNewest}
            handleSortActive={handleSortActive}
            handleSortUnanswered={handleSortUnanswered}
            QuestionC={questions.length}
            AskQuestion={() => navigate('home/ask')}
            title={title}
            questions={questions}
            displayAnswers={handleAnswerClick}
          />} />
          <Route path="ask" element={<AskQuestionPage postquestion={postquestion} />} />
          <Route path='question/:id' element={<Answers AskQuestion={() => navigate('home/ask')} handleAnswerQuestion={handleAnswerQuestion} />} />
          <Route path="answer/:id" element={<AnswerQuestionPage postAnswer={postanswer} />} />
          <Route path="tags" element={<TagsPage getTagQuestion={handleTagClick} AskQuestion={() => navigate('home/ask')} />} />
        </Route>
      </Routes>
    );
  }
