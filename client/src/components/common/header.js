import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

function Header({handleChange, handleKeyDown, handleLogout}) {
  const { currentUser } = useAuth();
  let navigate = useNavigate();
  
  return (
    <header id="header">
      <h1 id = "main_title">Fake Stack Overflow</h1>
      <div id="search">
        <input type="text" id="input" placeholder="Search . . ." onChange = {handleChange}
         onKeyDown={handleKeyDown}/>
      </div>
      {currentUser ? (<button className='logout' onClick={handleLogout}>Logout</button>) : 
      (<button className='login' onClick={() => navigate('/login')}>Login</button>)}
    </header>
  );
}

export default Header;