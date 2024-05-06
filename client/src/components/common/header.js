import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

function Header({handleChange, handleKeyDown, handleLogout, handleMenu, handleProfile, active}) {
  const { currentUser } = useAuth();
  let navigate = useNavigate();
  
  return (
    <header id="header">
        <h1>
          <span className='fake'>Fake</span><span className='stack'>StackOverflow</span>
        </h1>

      
      <div id="search">
        <input type="text" id="input" placeholder="Search . . ." onChange = {handleChange}
         onKeyDown={handleKeyDown}/>
      </div>
      <div id = "firstpage"  className = {(active === 'firstpage' || active === 'searchresults' || active === 'tagquestions') ? 'active' : ''} onClick = {handleMenu}>Questions</div>
      <div id = "tags" className = {active === 'tags' ? 'active' : ''} onClick = {handleMenu}>Tags</div>
 
      {currentUser ? (<button className='logout' onClick={handleLogout}>Logout</button>) : 
      (<button className='login' onClick={() => navigate('/login')}>Login</button>)}

      {currentUser ? (<button className='profile' onClick={handleProfile}>Profile</button>) : 
      (<button className='signup' onClick={() => navigate('/signup')}>Sign Up</button>)}


    </header>
  );
}

export default Header;