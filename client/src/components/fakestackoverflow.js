
  import Answers from './pages/answers.js';
  import AskQuestionPage from './pages/askquestionpage';
  import AnswerQuestionPage from './pages/AnswerQuestionPage';
  import TagsPage from './pages/tagsPage';
  import {useState} from 'react';
  import {useEffect} from 'react';
  import axios from 'axios';    
  import WelcomePage from './pages/welcomePage.js';
  import { Routes, Route, useNavigate, Navigate} from 'react-router-dom';
  import HomePage from './pages/homePage.js';
  import Main from './main.js';
  import Signup from './signup.js';
  import Login from './login.js';
  import { useAuth } from '../contexts/authContext.js';
  import { newest, active, unanswered } from '../helpers.js';
  axios.defaults.withCredentials = true;


  export default function FakeStackOverflow() {
    const[questions, setQuestions] = useState([]);
    const[searchInput, setSearchInput] = useState("");
    const[title, setTitle] = useState("All Questions");
    const [currentQuestions, setCurrentQuestions] = useState([]);
    const [filter, setFilter] = useState("newest");
    let navigate = useNavigate();
    const { currentUser, continueAsGuest, logout, isGuest } = useAuth();

    useEffect(() => {
      // questions from the server
      fetchQuestions();
    }, []);  
    const fetchQuestions = () => {
      axios.get('http://localhost:8000/questions')
      .then(response => {
          setQuestions(newest(response.data));
          setCurrentQuestions(newest(response.data));
      })
      .catch(error => console.error('Error fetching questions:', error));

    };

    const incrementViews = async (questionId) => {
      await axios.post(`http://localhost:8000/questions/increment-view/${questionId}`);

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
      axios.get('http://localhost:8000/questions').then(response => {
      setCurrentQuestions(response.data);
      switch (filter) {
        case 'newest':
          setQuestions(newest(response.data));
          break;
        case 'active':
          setQuestions(active(response.data));
          break;
        case 'unanswered':
          setQuestions(unanswered(response.data));
          break;
        default:
          setQuestions(newest(response.data));
      }
      });
      navigate('/home');
    };

    const Search = () => {
      axios.get('http://localhost:8000/questions', {
        params: {
          searchText: searchInput
        }
      }).then(response => {
        setTitle("Search Results");
        console.log(title);
        setQuestions(newest(response.data));
        setCurrentQuestions(newest(response.data));
        navigate('/home');
      });
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        Search();
      }
    };

    function handleSortNewest() {
      setFilter("newest");
      setQuestions(newest(currentQuestions));
    };

    function handleSortActive(){ 
      setFilter("active");
      setQuestions(active(currentQuestions));
  
    };  

    function handleSortUnanswered (){
      setFilter("unanswered");
      setQuestions(unanswered(currentQuestions));
    };

    const handleTagClick = (tid) => {
      axios.get(`http://localhost:8000/questions/tag/${tid}`)
      .then(response => {
          setQuestions(response.data);
          setCurrentQuestions(response.data);
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

        }
      } catch (error) {
        console.error('Error fetching question details:', error);
      }
    };

    const handleAnswerClick = (qid) => {
      incrementViews(qid);
      fetchQuestionDetails(qid);
      
    };
    const handleMenu = async (e) => {
      if( e.target.id === 'firstpage'){
        navigate('/home');
        setTitle("All Questions");
        axios.get('http://localhost:8000/questions')
        .then(response => {
          setQuestions(newest(response.data));
          setCurrentQuestions(newest(response.data));
          setFilter("newest");
        });
        } else{
          navigate('home/tags');
      }
    };

    const handleAnswerQuestion = (qid) => {
      navigate(`home/answer/${qid}`);
    };

  const showLogin = () => {
    navigate('/login');
  };
  
  const showSignup = () => {
    navigate('/signup');
  };

  const handleLogout = async () => {
    await logout();
    console.log("userloggedout");
    navigate('/login');
  };


  return (
    <Routes>
      <Route path="/" element={!currentUser && !isGuest  ?  <WelcomePage showSignup ={showSignup} showLogin = {showLogin} handleContinueAsGuest = {continueAsGuest} /> : <Navigate replace to="/home"/> } />
      <Route path="/login" element={<Login onContinueAsGuest={continueAsGuest} onSignUp ={showSignup} loginUser={loginUser}/>} />
      <Route path="/signup" element={<Signup onContinueAsGuest={continueAsGuest} onLogin = {showLogin} registerUser={registerUser}/>} />
      <Route path="/home" element={!currentUser || !isGuest  ? <Main handleSearchChange={handleSearchChange} handleKeyDown={handleKeyDown} handleMenu={handleMenu} handleLogout={handleLogout}/> : <Navigate replace to="/" />} >
        <Route index element={<HomePage
          handleSortNewest={handleSortNewest}
          handleSortActive={handleSortActive}
          handleSortUnanswered={handleSortUnanswered}
          QuestionC={questions.length}
          AskQuestion={() => navigate('home/ask')}
          title={title}
          questions={questions}
          displayAnswers={handleAnswerClick}
          filter = {filter}
        />} />
        <Route path="ask" element={<AskQuestionPage postquestion={postquestion} />} />
        <Route path='question/:id' element={<Answers AskQuestion={() => navigate('home/ask')} handleAnswerQuestion={handleAnswerQuestion} />} />
        <Route path="answer/:id" element={<AnswerQuestionPage fetchQuestionDetails={fetchQuestionDetails} />} />
        <Route path="tags" element={<TagsPage getTagQuestion={handleTagClick} AskQuestion={() => navigate('home/ask')} />} />
        {/* <Route path="profile" element={<Profile />} /> */}
      </Route>
    </Routes>
  );
}
