import React,{useState} from 'react';


export default function WelcomePage({handleContinueAsGuest, showLogin, showSignup}) {
  
    return (
      <div className="welcome-container">
        <h1>Welcome to Fake StackOverflow</h1>
        <div className="boxes-container">
          <div className="continue-as-guest" onClick={handleContinueAsGuest}>
            <p>Want a quick look through? Continue browsing as guest</p>
          </div>
          <div className="join-community"  onClick={showSignup}>
            <p>Want to be a part of the Fake StackOverflow community? Sign up!</p>
          </div>
          <div className="login-community" onClick={showLogin}>
            <p>Already part of the Fake StackOverflow community? Log Back in!</p>
          </div>
        </div>
      </div>
    );
}
