import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios';    


export default function Welcome() {
  const [pageState, setPageState] = useState('welcome');

  const handleCommunityClick = () => {
    setPageState('community');
  };

  const handleGuestClick = () => {
    setPageState('guest');
  };

  const handleLogin = (username, password) => {
    // Logic to handle login
  };

  const handleSignUp = () => {
    setPageState('signup');
  };

  const handleContinueAsGuest = () => {
    setPageState('continueAsGuest');
  };

  return (
    <div className="welcome-cont">
      {pageState === 'welcome' && (
        <div className="welcome-message">
          <h1>Welcome</h1>
        </div>
      )}

      {(pageState === 'welcome' || pageState === 'community') && (
        <div className={`banner ${pageState === 'community' ? 'slide-left' : ''}`}>
          <div className="community-side" onClick={handleCommunityClick}>
            <p>Login or sign up to the fake StackOverflow community</p>
          </div>
          <div className="guest-side" onClick={handleGuestClick}>
            <p>Continue browsing as a guest</p>
          </div>
        </div>
      )}

      {pageState === 'login' && (
        <div className="login-form">
          <input type="text" placeholder="Username or Email" />
          <button onClick={() => handleLogin('username', 'password')}>Login</button>
          <button onClick={handleSignUp}>Sign up</button>
          <button onClick={handleContinueAsGuest}>Continue as guest</button>
        </div>
      )}
    </div>
  );
};
